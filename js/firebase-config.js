// ====================================================================
// KONFIGURASI FIREBASE — GANTI DENGAN CONFIG PROYEK FIREBASE KAMU SENDIRI
// ====================================================================
// Cara ambil config ini:
// 1. Buka https://console.firebase.google.com -> buat project baru (gratis)
// 2. Di dalam project, klik ikon "</>" (Add app -> Web) untuk daftarkan web app
// 3. Firebase akan kasih object firebaseConfig seperti di bawah ini -> copy-paste ke sini
// 4. Aktifkan Firestore Database: menu kiri "Firestore Database" -> "Create database"
//    -> pilih mode "Start in test mode" dulu (nanti rules diperketat, lihat PROJECT-REFERENCE.md)
// ====================================================================

const firebaseConfig = {
    apiKey: "GANTI_DENGAN_API_KEY",
    authDomain: "GANTI_DENGAN_PROJECT_ID.firebaseapp.com",
    projectId: "GANTI_DENGAN_PROJECT_ID",
    storageBucket: "GANTI_DENGAN_PROJECT_ID.appspot.com",
    messagingSenderId: "GANTI_DENGAN_SENDER_ID",
    appId: "GANTI_DENGAN_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
