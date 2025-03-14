let data = []; // Array untuk menyimpan data mahasiswa

let currentPage = 1;
let itemsPerPage = 10; // Default jumlah data per halaman

// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
    localStorage.setItem('mahasiswaData', JSON.stringify(data));
}

// Fungsi untuk memuat data dari localStorage
function loadFromLocalStorage() {
    let savedData = localStorage.getItem('mahasiswaData');
    if (savedData) {
        data = JSON.parse(savedData);
    }
}

// Fungsi untuk menambahkan data
function tambahData() {
    let nama = document.getElementById('nama').value;
    let nim = document.getElementById('nim').value;
    let kehadiran = parseInt(document.getElementById('kehadiran').value);

    if (nama && nim && !isNaN(kehadiran)) {
        data.push({ nama, nim, kehadiran });
        saveToLocalStorage(); // Simpan data ke localStorage
        renderTable();
        document.getElementById('nama').value = '';
        document.getElementById('nim').value = '';
        document.getElementById('kehadiran').value = '';
    } else {
        alert('Harap isi semua field dengan benar!');
    }
}

// Fungsi untuk mengubah jumlah data per halaman
function changeItemsPerPage() {
    itemsPerPage = parseInt(document.getElementById('itemsPerPage').value);
    currentPage = 1; // Kembali ke halaman pertama
    renderTable();
}

// Fungsi untuk sorting data
function sortData() {
    let sortOption = document.getElementById('sortOption').value;
    let [sortBy, sortOrder] = sortOption.split('-');

    let sorted = data.slice().sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
    });

    renderTable(sorted);
}

// Fungsi untuk filter data
function filterData() {
    let search = document.getElementById('search').value.toLowerCase();
    let kehadiranFilter = document.getElementById('kehadiranFilter').value;

    let filtered = data.filter(item => {
        let matchSearch = item.nama.toLowerCase().includes(search) || item.nim.toLowerCase().includes(search);
        let matchKehadiran = true;

        if (kehadiranFilter) {
            matchKehadiran = item.kehadiran >= parseInt(kehadiranFilter);
        }

        return matchSearch && matchKehadiran;
    });

    renderTable(filtered);
}

// Fungsi untuk merender tabel
function renderTable(dataToRender = data) {
    let paginatedData = paginateData(dataToRender);

    let tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    if (paginatedData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align: center;">Tidak ada data yang ditemukan.</td></tr>`;
    } else {
        paginatedData.forEach(item => {
            let row = `<tr>
                <td>${item.nama}</td>
                <td>${item.nim}</td>
                <td>${item.kehadiran}</td>
                <td>
                    <button onclick="editData('${item.nim}')">Ubah</button>
                    <button onclick="deleteData('${item.nim}')">Hapus</button>
                </td>
            </tr>`;
            tbody.innerHTML += row;
        });
    }

    document.getElementById('pageInfo').innerText = `Page ${currentPage}`;
}

// Fungsi untuk pagination
function paginateData(dataToPaginate) {
    let start = (currentPage - 1) * itemsPerPage;
    let end = start + itemsPerPage;
    return dataToPaginate.slice(start, end);
}

// Fungsi untuk mengganti halaman
function changePage(direction) {
    currentPage += direction;
    if (currentPage < 1) currentPage = 1;
    if (currentPage > Math.ceil(data.length / itemsPerPage)) currentPage = Math.ceil(data.length / itemsPerPage);
    renderTable();
}

// Fungsi untuk mengedit data
function editData(nim) {
    let item = data.find(item => item.nim === nim);
    if (item) {
        let newNama = prompt("Masukkan nama baru:", item.nama);
        let newNIM = prompt("Masukkan NIM baru:", item.nim);
        let newKehadiran = prompt("Masukkan kehadiran baru:", item.kehadiran);

        if (newNama !== null && newNIM !== null && newKehadiran !== null) {
            item.nama = newNama;
            item.nim = newNIM;
            item.kehadiran = parseInt(newKehadiran);
            saveToLocalStorage(); // Simpan data ke localStorage
            renderTable();
        }
    }
}

// Fungsi untuk menghapus data
function deleteData(nim) {
    if (confirm(`Apakah Anda yakin ingin menghapus data dengan NIM: ${nim}?`)) {
        data = data.filter(item => item.nim !== nim);
        saveToLocalStorage(); // Simpan data ke localStorage
        renderTable();
    }
}

// Inisialisasi
loadFromLocalStorage(); // Memuat data dari localStorage
document.getElementById('itemsPerPage').value = itemsPerPage;
renderTable();