<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

const mahasiswas = ref([])
const dosens = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const formData = ref({ id: null, nama: '', nim: '', dosenId: '' })

const fetchData = async () => {
  try {
    const [resMhs, resDosen] = await Promise.all([
      api.get('/mahasiswa'),
      api.get('/dosen')
    ])
    mahasiswas.value = resMhs.data
    dosens.value = resDosen.data
  } catch (error) {
    console.error('Failed to fetch data', error)
  }
}

onMounted(() => {
  fetchData()
})

const openModal = (mhs = null) => {
  if (mhs) {
    isEdit.value = true
    formData.value = { ...mhs, dosenId: mhs.dosenId || '' }
  } else {
    isEdit.value = false
    formData.value = { id: null, nama: '', nim: '', dosenId: '' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveMahasiswa = async () => {
  try {
    const payload = {
      nama: formData.value.nama,
      nim: formData.value.nim,
      dosenId: formData.value.dosenId || null
    }
    if (isEdit.value) {
      await api.put(`/mahasiswa/${formData.value.id}`, payload)
    } else {
      await api.post('/mahasiswa', payload)
    }
    closeModal()
    fetchData()
  } catch (error) {
    console.error('Failed to save mahasiswa', error)
    alert('Terjadi kesalahan saat menyimpan data.')
  }
}

const deleteMahasiswa = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    try {
      await api.delete(`/mahasiswa/${id}`)
      fetchData()
    } catch (error) {
      console.error('Failed to delete mahasiswa', error)
      alert('Terjadi kesalahan saat menghapus data.')
    }
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-white">Daftar Mahasiswa</h3>
      <button @click="openModal()" class="btn-primary">
        + Tambah Mahasiswa
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-900 border-b border-slate-700">
            <th class="py-3 px-4 text-slate-300 font-medium">ID</th>
            <th class="py-3 px-4 text-slate-300 font-medium">Nama Mahasiswa</th>
            <th class="py-3 px-4 text-slate-300 font-medium">NIM</th>
            <th class="py-3 px-4 text-slate-300 font-medium">Dosen Pembimbing</th>
            <th class="py-3 px-4 text-slate-300 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="mhs in mahasiswas" :key="mhs.id" class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <td class="py-4 px-4 text-slate-400">{{ mhs.id }}</td>
            <td class="py-4 px-4 font-medium text-white">{{ mhs.nama }}</td>
            <td class="py-4 px-4 text-slate-400">{{ mhs.nim }}</td>
            <td class="py-4 px-4 text-slate-400">
              <span v-if="mhs.dosen" class="bg-slate-700 px-2 py-1 text-xs text-white">{{ mhs.dosen.nama }}</span>
              <span v-else class="text-slate-600 italic">- Belum ditentukan -</span>
            </td>
            <td class="py-4 px-4 text-right">
              <button @click="openModal(mhs)" class="text-slate-300 hover:text-white mr-4 transition-colors font-medium">Edit</button>
              <button @click="deleteMahasiswa(mhs.id)" class="text-krs-accent hover:text-red-400 transition-colors font-medium">Hapus</button>
            </td>
          </tr>
          <tr v-if="mahasiswas.length === 0">
            <td colspan="5" class="py-8 text-center text-slate-500">Belum ada data mahasiswa.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="bg-slate-900 border border-slate-700 w-full max-w-md p-6 shadow-2xl transform transition-all">
        <h3 class="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
          {{ isEdit ? 'Edit Data Mahasiswa' : 'Tambah Data Mahasiswa' }}
        </h3>
        
        <form @submit.prevent="saveMahasiswa" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">Nama Lengkap</label>
            <input v-model="formData.nama" type="text" required class="input-field" placeholder="Masukkan nama mahasiswa" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">NIM</label>
            <input v-model="formData.nim" type="text" required class="input-field" placeholder="Masukkan NIM" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">Dosen Pembimbing</label>
            <select v-model="formData.dosenId" class="input-field appearance-none bg-slate-800">
              <option value="">-- Pilih Dosen Pembimbing --</option>
              <option v-for="dosen in dosens" :key="dosen.id" :value="dosen.id">
                {{ dosen.nama }} ({{ dosen.nidn }})
              </option>
            </select>
          </div>
          
          <div class="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-800">
            <button type="button" @click="closeModal" class="btn-secondary">Batal</button>
            <button type="submit" class="btn-primary">Simpan</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
