import './style.css';

const form = document.getElementById('camping-form');
const modal = document.getElementById('modal');
const loadingSpinner = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeErrorModalBtn = document.getElementById('close-error-modal-btn');

// GANTI DENGAN URL APPS SCRIPT-mu untuk MENGIRIM DATA (doPost)
const scriptURL = 'https://script.google.com/macros/s/AKfycbwzSO1dXDxMeBTEGMYSg5OycQWKhYybwm258PtB4a8pAcuBZR-TUCNDsEBnKQMX5Sn09g/exec'; 

// GANTI DENGAN URL APPS SCRIPT-mu untuk MENGAMBIL DATA (doGet)
const daftarPesertaURL = 'https://script.google.com/macros/s/AKfycbzrrBIupY4qwA6WD8e4iYRUfaZr0oo0-c2riAV2N-WEmej7E8v-65_Cw3WqBk3DLHXF/exec'; 

const namaLengkapInput = document.getElementById('nama_lengkap');
const posisiDivisiInput = document.getElementById('posisi_divisi');
const dropdownNamaList = document.getElementById('dropdown-nama-list');
const loadingNama = document.getElementById('loading-nama');
const loadingPosisi = document.getElementById('loading-posisi');

let pesertaData = [];

// Fungsi untuk mengambil dan mengisi data dropdown
async function populateDropdowns() {
    try {
        // Tampilkan loading, sembunyikan input
        namaLengkapInput.classList.add('hidden');
        posisiDivisiInput.classList.add('hidden');
        loadingNama.classList.remove('hidden');
        loadingPosisi.classList.remove('hidden');

        const response = await fetch(daftarPesertaURL);
        const data = await response.json();

        // Simpan data untuk digunakan nanti
        pesertaData = data;

        // Sembunyikan loading, tampilkan input
        loadingNama.classList.add('hidden');
        loadingPosisi.classList.add('hidden');
        namaLengkapInput.classList.remove('hidden');
        posisiDivisiInput.classList.remove('hidden');

        if (pesertaData.error) {
            console.error(pesertaData.error);
            return;
        }

        // Isi list dropdown dengan data
        pesertaData.forEach(peserta => {
            const li = document.createElement('li');
            li.textContent = peserta["NamaLengkap"];
            li.classList.add('px-4', 'py-2', 'cursor-pointer', 'hover:bg-blue-100');
            li.addEventListener('click', () => {
                namaLengkapInput.value = peserta["NamaLengkap"];
                posisiDivisiInput.value = peserta["Posisi/Divisi"];
                dropdownNamaList.classList.add('hidden');
            });
            dropdownNamaList.appendChild(li);
        });

        // Tampilkan dropdown saat input di-klik
        namaLengkapInput.addEventListener('click', () => {
            dropdownNamaList.classList.toggle('hidden');
        });

        // Sembunyikan dropdown saat klik di luar area
        document.addEventListener('click', (event) => {
            if (!event.target.closest('#dropdown-nama-wrapper')) {
                dropdownNamaList.classList.add('hidden');
            }
        });

    } catch (error) {
        console.error('Error mengambil data:', error);
        loadingNama.textContent = "Gagal memuat data.";
        loadingPosisi.textContent = "Gagal memuat data.";
    }
}

// Panggil fungsi saat halaman dimuat
document.addEventListener('DOMContentLoaded', populateDropdowns);

form.addEventListener('submit', e => {
    e.preventDefault();

    // Tampilkan modal dan loading spinner
    modal.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const formData = new FormData(form);

    // Langsung kirim data tanpa menunggu respons dari server
    fetch(scriptURL, { method: 'POST', body: formData });
    
    // Asumsikan pengiriman sukses dan langsung tampilkan pesan sukses
    // Ini membuat user merasa pengiriman instan
    loadingSpinner.classList.add('hidden');
    successMessage.classList.remove('hidden');
    
    // Reset formulir
    form.reset();
});

// Tutup modal saat tombol "Tutup" diklik
closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

closeErrorModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});