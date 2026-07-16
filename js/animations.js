// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    // Set initial scales and origins
    gsap.set('.layer-outer', { transformOrigin: '50% 50%' });
    gsap.set('.layer-inner', { transformOrigin: '50% 50%' });

    // Main scroll timeline
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.scroll-track',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5 // Increased from 1 for smoother animation lag
        }
    });

    // 1. Fade out the couple photo (.bride-groom) quickly at the start of the scroll
    tl.to('.bride-groom', {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: 'power1.out'
    }, 0);

    // 2. Zoom in and fade out the outer frame layer (Frame-01)
    // Duration disamakan dengan Frame-17 (2.5s) supaya transisi selambat & semulus closing
    tl.to('.layer-outer', {
        scale: 3.5,
        opacity: 0,
        duration: 2.5,
        ease: 'power3.inOut'
    }, 0);

    // 3. Zoom in the inner scene layer (Frame-02) to fill the screen
    // Duration tetap 1.2s (bukan 2.5s) karena Frame-03 (posisi 0.5) ikut menganimasikan scale ini juga —
    // durasi berbeda antara dua tween scale yang overlap menyebabkan handoff patah/jerky
    tl.to('.layer-inner', {
        scale: 1,
        duration: 1.2,
        ease: 'power3.inOut'
    }, 0);

    // 4. Buka clip-path secara instan (bukan animasi melebar) begitu scroll mulai,
    // supaya tidak ada efek "oval melebar" yang terlihat — hanya zoom & fade bingkai kayu yang terlihat
    tl.set('.layer-inner', {
        clipPath: 'ellipse(150% 150% at 50% 50%)'
    }, 0);

    // 5. FRAME-03 ZOOM PHASE - Lanjut zoom ke Frame-03 setelah 50% scroll
    tl.to('.layer-inner', {
        scale: 2.5,
        duration: 1.3,
        ease: 'power3.inOut'
    }, 0.5);

    // 6. Translate layer-inner untuk positioning ke Frame-03 area
    tl.to('.layer-inner', {
        y: -100,
        duration: 1.3,
        ease: 'power3.inOut'
    }, 0.5);

    // 7. FRAME-03 CONTENT - Fade in assalamualaikum di akhir zoom Frame-03
    tl.to('.frame-03-assalamualaikum', {
        opacity: 3,
        duration: 0.8,
        ease: 'sine.inOut'
    }, 0.8);

    // 8. TRANSITION - Assalamualaikum visible untuk dibaca, lalu fade-out perlahan
    tl.to('.frame-03-assalamualaikum', {
        opacity: 0,
        duration: 3,
        ease: 'sine.inOut'
    }, 1.2); // Start setelah Frame-03 visible (memberi waktu baca)

    // ==================== FRAME-05 PHASE ====================
    // 9. FRAME-05 - Zoom in sambil transisi bergeser ke Firdaus (pengantin perempuan)
    tl.to('.layer-inner', {
        scale: 6,
        x: 150, // Shift ke kanan untuk fokus ke Firdaus
        y: -110, // Shift ke atas untuk close-up portrait
        duration: 1.5,
        ease: 'power3.inOut'
    }, 2.0); // Start setelah assalamualaikum fade-out progress

    // ==================== FRAME-06 PHASE ====================
    // 10. FRAME-06 - Pan ke samping untuk munculkan area kosong, lalu fade-in nametag Firdaus
    tl.to('.layer-inner', {
        x: 350, // Geser lebih ke kanan untuk munculkan area samping kosong
        duration: 1.5,
        ease: 'power3.inOut'
    }, 3.5); // Start setelah Frame-05 selesai (2.0 + 1.5)

    // 11. FRAME-06 - Fade-in nametag Firdaus di area samping
    tl.to('.frame-06-nametag-daus', {
        opacity: 1,
        duration: 1,
        ease: 'sine.inOut'
    }, 3.5); // Start bersamaan dengan pan

    // ==================== FRAME-07 PHASE ====================
    // 12. FRAME-07 - Zoom out mundur kembali ke landscape area (seperti Frame-03)
    tl.to('.layer-inner', {
        scale: 3.4,
        x: 0,
        y: -5,
        duration: 2,
        ease: 'power3.inOut'
    }, 5.0); // Start setelah Frame-06 selesai (3.5 + 1.5)

    // 13. FRAME-07 - Nametag Firdaus fade-out perlahan saat mundur
    tl.to('.frame-06-nametag-daus', {
        opacity: 0,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 5.0); // Start bersamaan dengan zoom-out mundur

    // ==================== FRAME-08 PHASE ====================
    // 14. FRAME-08 - Zoom in close-up Yusko (mirror dari Frame-05 Firdaus)
    tl.to('.layer-inner', {
        scale: 6,
        x: -100, // Shift ke kiri untuk fokus ke Yusko (mirror dari Frame-05)
        y: -92, // Fokus portrait
        duration: 1.5,
        ease: 'power3.inOut'
    }, 7.0); // Start setelah Frame-07 selesai

    // ==================== FRAME-09 PHASE ====================
    // 15. FRAME-09 - Pan ke kiri untuk munculkan area samping kosong, lalu fade-in nametag Yusko
    tl.to('.layer-inner', {
        x: -350, // Geser ke kiri untuk munculkan area samping kosong (mirror dari Frame-06)
        duration: 1.5,
        ease: 'power3.inOut'
    }, 8.5); // Start setelah Frame-08 selesai (7.0 + 1.5)

    // 16. FRAME-09 - Fade-in nametag Yusko di area samping kiri
    tl.to('.frame-09-nametag-yusko', {
        opacity: 1,
        duration: 1,
        ease: 'sine.inOut'
    }, 8.5); // Start bersamaan dengan pan

    // 17. FRAME-09 - Fade-out nametag Firdaus saat pan ke Yusko
    tl.to('.frame-06-nametag-daus', {
        opacity: 0,
        duration: 1,
        ease: 'sine.inOut'
    }, 8.5); // Fade-out bersamaan dengan munculnya nametag Yusko

    // ==================== FRAME-10 PHASE ====================
    // 18. FRAME-10 - Zoom out mundur kembali ke landscape area (seperti Frame-07)
    tl.to('.layer-inner', {
        scale: 3.6,
        x: 0,
        y: -5,
        duration: 2,
        ease: 'power3.inOut'
    }, 10.0); // Start setelah Frame-09 selesai (8.5 + 1.5)

    // 19. FRAME-10 - Nametag Yusko fade-out perlahan saat mundur
    tl.to('.frame-09-nametag-yusko', {
        opacity: 0,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 10.0); // Start bersamaan dengan zoom-out mundur

    // ==================== FRAME-11 PHASE ====================
    // 20. FRAME-11 - Geser ke atas untuk menampilkan atap rumah Betawi
    tl.to('.layer-inner', {
        y: 500, // Geser ke atas untuk fokus area atap
        duration: 1.5,
        ease: 'power3.inOut'
    }, 12.0); // Start setelah Frame-10 selesai (10.0 + 2.0)

    // 21. FRAME-11 - Fade-in frame-atas-tengah (4 plakat emas)
    tl.to('.frame-11-atas-tengah', {
        opacity: 1,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 12.0); // Start bersamaan dengan geser ke atas

    // 21b. FRAME-11 - Fade-in dzariyat-ayat
    tl.to('.frame-11-dzariyat-ayat', {
        opacity: 1,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 12.3); // Start sedikit setelah frame-atas-tengah

    // ==================== FRAME-12 PHASE ====================
    // 22. FRAME-12 - Geser ke kiri saja
    tl.to('.layer-inner', {
        x: -430, // Geser ke kiri
        duration: 1.5,
        ease: 'power3.inOut'
    }, 13.5); // Start setelah Frame-11 selesai (12.0 + 1.5)

    // 23. FRAME-12 - Fade-in tanggal-akad nikah
    tl.to('.frame-12-tanggal-akad', {
        opacity: 1,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 13.5); // Start bersamaan dengan geser ke kiri

    // ==================== FRAME-13 PHASE ====================
    // 24. FRAME-13 - Geser kanan kembali ke posisi Frame-11 (center)
    tl.to('.layer-inner', {
        x: 0, // Kembali ke center (dari -550)
        duration: 1.5,
        ease: 'power3.inOut'
    }, 15.0); // Start setelah Frame-12 selesai (13.5 + 1.5)

    // 25. FRAME-13 - Fade-out tanggal-akad saat geser kembali
    tl.to('.frame-12-tanggal-akad', {
        opacity: 0,
        duration: 1,
        ease: 'sine.inOut'
    }, 15.0); // Fade-out bersamaan dengan geser kembali

    // 25b. FRAME-13 - Dzariyat-ayat tetap visible (tidak fade-out)
    // Dzariyat-ayat akan terus terlihat di Frame-13

    // ==================== FRAME-14 PHASE ====================
    // 26. FRAME-14 - Geser ke kanan (berlawanan dari Frame-12)
    tl.to('.layer-inner', {
        x: 430, // Geser ke kanan (mirror dari Frame-12 yang -550)
        duration: 1.5,
        ease: 'power3.inOut'
    }, 16.5); // Start setelah Frame-13 selesai (15.0 + 1.5)

    // 27. FRAME-14 - Fade-in tanggal-resepsi
    tl.to('.frame-14-tanggal-resepsi', {
        opacity: 1,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 16.5); // Start bersamaan dengan geser ke kanan

    // 28. FRAME-14 - Fade-out frame-atas-tengah saat geser ke kanan
    tl.to('.frame-11-atas-tengah', {
        opacity: 0,
        duration: 1,
        ease: 'sine.inOut'
    }, 16.5); // Fade-out bersamaan dengan munculnya tanggal-resepsi

    // ==================== FRAME-15 PHASE ====================
    // 29. FRAME-15 - Zoom out dan pan ke center (kembali ke Frame-03 position)
    tl.to('.layer-inner', {
        scale: 2.5, // Zoom out dari 3.4 ke 2.5 (seperti Frame-03)
        x: 0, // Pan ke center dari 550
        y: -150, // Geser ke landscape area (seperti Frame-03)
        duration: 2,
        ease: 'power3.inOut'
    }, 18.0); // Start setelah Frame-14 selesai (16.5 + 1.5)

    // 30. FRAME-15 - Fade-out tanggal-resepsi saat mundur
    tl.to('.frame-14-tanggal-resepsi', {
        opacity: 0,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 18.0); // Fade-out bersamaan dengan zoom-out mundur

    // 30b. FRAME-15 - Fade-out dzariyat-ayat saat mundur
    tl.to('.frame-11-dzariyat-ayat', {
        opacity: 0,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 18.0); // Fade-out bersamaan dengan zoom-out mundur

    // 31. FRAME-15 - Fade-in kalimat-penutup di bagian bawah
    tl.to('.frame-15-kalimat-penutup', {
        opacity: 1,
        duration: 1.5,
        ease: 'sine.inOut'
    }, 18.5); // Start tengah-tengah transisi Frame-15

    // ==================== FRAME-17 PHASE (Frame-16 dibatalkan, rewind langsung dari Frame-15) ====================
    // 32. FRAME-17 - Rewind layer-inner langsung dari posisi Frame-15 kembali ke skala & posisi awal Frame-01
    // (scale 0.38 = ukuran mini landscape di balik jendela oval, BUKAN zoom close-up)
    tl.to('.layer-inner', {
        scale: 0.38, // Kembali persis ke skala awal sebelum zoom masuk
        x: 0,
        y: -50,
        clipPath: 'ellipse(44% 46% at 50% 50%)', // Tutup kembali jadi oval jendela kayu
        duration: 2.5,
        ease: 'power3.inOut'
    }, 20.0); // Start setelah Frame-15 selesai (18.0 + 2.0)

    // 33. FRAME-17 - Fade-out kalimat-penutup saat rewind mulai
    tl.to('.frame-15-kalimat-penutup', {
        opacity: 0,
        duration: 1,
        ease: 'sine.inOut'
    }, 20.0); // Fade-out bersamaan dengan mulai rewind

    // 34. FRAME-17 - Fade-in layer-outer (bingkai kayu utuh + ondel-ondel + nametag + judul)
    tl.to('.layer-outer', {
        opacity: 1,
        scale: 1,
        duration: 2.5,
        ease: 'power3.inOut'
    }, 20.0); // Bersamaan dengan rewind layer-inner

    // 35. FRAME-17 - Kembalikan foto kecil pengantin di dalam bingkai kayu
    tl.to('.bride-groom', {
        opacity: 1,
        scale: 1,
        duration: 1.5,
        ease: 'power3.inOut'
    }, 20.5); // Sedikit delay agar muncul setelah bingkai mulai terlihat
});
