import './style.css';

const form = document.getElementById('camping-form');
const modal = document.getElementById('modal');
const loadingSpinner = document.getElementById('loading');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const closeModalBtn = document.getElementById('close-modal-btn');
const closeErrorModalBtn = document.getElementById('close-error-modal-btn');

const scriptURL = 'https://script.google.com/macros/s/AKfycbwzSO1dXDxMeBTEGMYSg5OycQWKhYybwm258PtB4a8pAcuBZR-TUCNDsEBnKQMX5Sn09g/exec';

const daftarPesertaURL = 'https://script.google.com/macros/s/AKfycbzrrBIupY4qwA6WD8e4iYRUfaZr0oo0-c2riAV2N-WEmej7E8v-65_Cw3WqBk3DLHXF/exec';

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

    modal.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');
    successMessage.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const formData = new FormData(form);
    const data = {};
    for (const [key, value] of formData.entries()) {
        const input = form.querySelector(`[name="${key}"]`);
        if (input && (input.type === 'checkbox' || input.type === 'radio')) {
            if (!data[key]) {
                data[key] = [];
            }
            data[key].push(value);
        } else {
            data[key] = value;
        }
    }

    fetch(scriptURL, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'text/plain' // Ubah dari 'application/json' menjadi 'text/plain'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Jaringan bermasalah atau server menolak permintaan.');
        }
        return response.text();
    })
    .then(result => {
        console.log('Success!', result);
        loadingSpinner.classList.add('hidden');
        successMessage.classList.remove('hidden');
        form.reset();
    })
    .catch(error => {
        console.error('Error!', error.message);
        loadingSpinner.classList.add('hidden');
        errorMessage.classList.remove('hidden');
        // Menampilkan pesan error pada elemen p yang ada
        const errorMessageText = errorMessage.querySelector('p');
        if (errorMessageText) {
          errorMessageText.textContent = error.message;
        }
    });
});

closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});

closeErrorModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
});
