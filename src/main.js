import './style.css';

const form = document.getElementById('camping-form');
const modal = document.getElementById('modal');
const loadingSpinner = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeErrorModalBtn = document.getElementById('close-error-modal-btn');

const scriptURL = 'https://script.google.com/macros/s/AKfycbz82obGPK3Pzynw1k0y6lr_i9J4JAGH0sLf-CySu0cmJ2mnU3g7xfST7jerT3ZebXo/exec';

const daftarPesertaURL = 'https://script.google.com/macros/s/AKfycbwZji8gNHnVfgQhT2iO_lFDIhhXPSbvaDOmk9K0EAYST6eLUxP-siQj1gy6QY7ZdBxZ/exec';

const namaLengkapInput = document.getElementById('nama_lengkap');
const posisiDivisiInput = document.getElementById('posisi_divisi');
const dropdownNamaList = document.getElementById('dropdown-nama-list');
const loadingNama = document.getElementById('loading-nama');
const loadingPosisi = document.getElementById('loading-posisi');

let pesertaData = [];

async function populateDropdowns() {
    try {
        namaLengkapInput.classList.add('hidden');
        posisiDivisiInput.classList.add('hidden');
        loadingNama.classList.remove('hidden');
        loadingPosisi.classList.remove('hidden');

        const response = await fetch(daftarPesertaURL);
        const data = await response.json();

        pesertaData = data;

        loadingNama.classList.add('hidden');
        loadingPosisi.classList.add('hidden');
        namaLengkapInput.classList.remove('hidden');
        posisiDivisiInput.classList.remove('hidden');

        if (pesertaData.error) {
            console.error(pesertaData.error);
            return;
        }

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

        namaLengkapInput.addEventListener('click', () => {
            dropdownNamaList.classList.toggle('hidden');
        });

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

document.addEventListener('DOMContentLoaded', populateDropdowns);

form.addEventListener('submit', e => {
    e.preventDefault();

    // Tampilkan modal loading
    modal.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const formData = new FormData(form);

    // Kirim data ke Google Apps Script tanpa menunggu respons
    fetch(scriptURL, {
        method: 'POST',
        body: formData
    })
    .then(response => {
        // Log respons dari server untuk debugging (opsional)
        console.log('Respons server diterima:', response);
    })
    .catch(error => {
        // Log error jika ada masalah, tapi tidak tampilkan ke pengguna
        console.error('Error saat mengirim data:', error);
    });

    // Atur penundaan 2 detik sebelum menampilkan pesan sukses
    setTimeout(() => {
        loadingSpinner.classList.add('hidden');
        successMessage.classList.remove('hidden');
        form.reset();
    }, 2000); // Waktu tunda dalam milidetik (2000ms = 2 detik)
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

closeErrorModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});
