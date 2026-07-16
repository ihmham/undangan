document.addEventListener('DOMContentLoaded', () => {

    // ==================== COVER GATE (Buka Undangan) ====================
    const coverGate = document.getElementById('coverGate');
    if (coverGate) {
        const guestNameEl = document.getElementById('coverGuestName');
        const openBtn = document.getElementById('coverOpenBtn');
        const params = new URLSearchParams(window.location.search);
        const guestName = params.get('to') || params.get('nama');

        if (guestNameEl && guestName) {
            guestNameEl.textContent = guestName;
        }

        const openInvitation = () => {
            coverGate.classList.add('is-open');
            document.documentElement.classList.remove('gate-locked');
            setTimeout(() => {
                coverGate.style.display = 'none';
                if (window.ScrollTrigger) ScrollTrigger.refresh();
            }, 1800);
        };

        if (openBtn) {
            openBtn.addEventListener('click', openInvitation);
        }

        // Mode debug (?scroll=...): langsung lewati gate supaya auto-scroll testing tetap jalan
        if (params.has('scroll')) {
            coverGate.style.display = 'none';
        } else {
            document.documentElement.classList.add('gate-locked');
        }
    }

    // ==================== MUSIK LATAR ====================
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');

    if (bgMusic && musicToggle) {
        bgMusic.volume = 0.6;

        const setPlayingState = (isPlaying) => {
            musicToggle.dataset.playing = isPlaying ? 'true' : 'false';
        };

        const playMusic = () => {
            bgMusic.play()
                .then(() => setPlayingState(true))
                .catch(() => setPlayingState(false)); // Autoplay diblokir browser, tunggu klik user
        };

        // Coba autoplay begitu halaman dimuat (kemungkinan diblokir browser)
        playMusic();

        // Fallback: begitu user melakukan gesture valid pertama kali (klik/tap/keyboard),
        // coba mainkan lagi kalau belum jalan. Catatan: 'scroll' TIDAK dihitung sebagai user gesture
        // oleh kebijakan autoplay browser, jadi sengaja tidak dipakai di sini.
        const tryPlayOnFirstInteraction = () => {
            if (bgMusic.paused) playMusic();
            window.removeEventListener('click', tryPlayOnFirstInteraction);
            window.removeEventListener('touchend', tryPlayOnFirstInteraction);
            window.removeEventListener('keydown', tryPlayOnFirstInteraction);
        };
        window.addEventListener('click', tryPlayOnFirstInteraction, { once: true });
        window.addEventListener('touchend', tryPlayOnFirstInteraction, { once: true });
        window.addEventListener('keydown', tryPlayOnFirstInteraction, { once: true });

        // Tombol toggle manual
        musicToggle.addEventListener('click', () => {
            if (bgMusic.paused) {
                playMusic();
            } else {
                bgMusic.pause();
                setPlayingState(false);
            }
        });
    }

    // ==================== TOMBOL SCROLL KE BAWAH ====================
    const scrollBottomBtn = document.getElementById('scrollBottomBtn');
    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({
                top: document.documentElement.scrollHeight,
                behavior: 'smooth'
            });
        });
    }

    // ==================== REVEAL ON SCROLL ====================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.info-section').forEach((section) => {
        revealObserver.observe(section);
    });

    // ==================== COPY TO CLIPBOARD (Amplop Digital) ====================
    document.querySelectorAll('.btn-copy').forEach((btn) => {
        const label = btn.querySelector('span');
        const originalLabel = label ? label.textContent : '';

        btn.addEventListener('click', () => {
            const card = btn.closest('.envelope-card');
            const numberEl = card ? card.querySelector('.envelope-number') : null;
            const value = numberEl ? numberEl.dataset.copy : '';
            if (!value) return;

            navigator.clipboard.writeText(value).then(() => {
                if (label) label.textContent = 'Tersalin';
                btn.classList.add('copied');
                setTimeout(() => {
                    if (label) label.textContent = originalLabel;
                    btn.classList.remove('copied');
                }, 2000);
            });
        });
    });

    // ==================== WISHES FORM (Firebase Firestore, tersimpan permanen & real-time) ====================
    const wishesForm = document.getElementById('wishesForm');
    const wishesList = document.getElementById('wishesList');
    const wishesStatus = document.getElementById('wishesStatus');
    const wishesSubmitBtn = wishesForm ? wishesForm.querySelector('button[type="submit"]') : null;

    function renderWishItem(name, message, attend) {
        const initials = name
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((word) => word[0].toUpperCase())
            .join('');

        const item = document.createElement('div');
        item.className = 'wishes-item';
        item.innerHTML = `
            <div class="wishes-avatar">${initials}</div>
            <div class="wishes-content">
                <div class="wishes-item-head">
                    <strong>${escapeHtml(name)}</strong>
                    <span class="wishes-tag ${attend === 'tidak' ? 'tag-absent' : ''}">${attend === 'hadir' ? 'Hadir' : 'Tidak Hadir'}</span>
                </div>
                <p>${escapeHtml(message)}</p>
            </div>
        `;
        return item;
    }

    if (wishesForm && wishesList) {
        if (typeof db === 'undefined') {
            // Firebase belum dikonfigurasi (lihat js/firebase-config.js)
            if (wishesStatus) wishesStatus.textContent = 'Firebase belum dikonfigurasi — lihat js/firebase-config.js';
        } else {
            // Dengarkan koleksi "ucapan" secara real-time, urut dari yang terbaru
            db.collection('ucapan')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    wishesList.innerHTML = '';

                    if (snapshot.empty) {
                        if (wishesStatus) {
                            wishesStatus.textContent = 'Belum ada ucapan. Jadilah yang pertama mengirim doa!';
                            wishesStatus.style.display = 'block';
                        }
                        return;
                    }

                    if (wishesStatus) wishesStatus.style.display = 'none';

                    snapshot.forEach((doc) => {
                        const data = doc.data();
                        wishesList.appendChild(renderWishItem(data.nama || '', data.pesan || '', data.hadir || 'hadir'));
                    });
                }, (error) => {
                    console.error('Gagal memuat ucapan:', error);
                    if (wishesStatus) {
                        wishesStatus.textContent = 'Gagal memuat ucapan. Coba muat ulang halaman.';
                        wishesStatus.style.display = 'block';
                    }
                });

            wishesForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const name = document.getElementById('wishesName').value.trim();
                const message = document.getElementById('wishesMessage').value.trim();
                const attend = wishesForm.querySelector('input[name="attend"]:checked').value;

                if (!name || !message) return;

                if (wishesSubmitBtn) {
                    wishesSubmitBtn.disabled = true;
                    wishesSubmitBtn.textContent = 'Mengirim...';
                }

                db.collection('ucapan').add({
                    nama: name,
                    pesan: message,
                    hadir: attend,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                }).then(() => {
                    wishesForm.reset();
                }).catch((error) => {
                    console.error('Gagal mengirim ucapan:', error);
                    alert('Gagal mengirim ucapan. Silakan coba lagi.');
                }).finally(() => {
                    if (wishesSubmitBtn) {
                        wishesSubmitBtn.disabled = false;
                        wishesSubmitBtn.textContent = 'Kirim Ucapan';
                    }
                });
            });
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
});
