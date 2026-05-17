<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:3000/api' })

const dosens = ref([])
const showModal = ref(false)
const isEdit = ref(false)
const formData = ref({ id: null, nama: '', nidn: '' })

const fetchDosen = async () => {
  try {
    const res = await api.get('/dosen')
    dosens.value = res.data
  } catch (error) {
    console.error('Failed to fetch dosen', error)
  }
}

onMounted(() => {
  fetchDosen()
})

const openModal = (dosen = null) => {
  if (dosen) {
    isEdit.value = true
    formData.value = { ...dosen }
  } else {
    isEdit.value = false
    formData.value = { id: null, nama: '', nidn: '' }
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveDosen = async () => {
  try {
    if (isEdit.value) {
      await api.put(`/dosen/${formData.value.id}`, {
        nama: formData.value.nama,
        nidn: formData.value.nidn
      })
    } else {
      await api.post('/dosen', {
        nama: formData.value.nama,
        nidn: formData.value.nidn
      })
    }
    closeModal()
    fetchDosen()
  } catch (error) {
    console.error('Failed to save dosen', error)
    alert('Terjadi kesalahan saat menyimpan data.')
  }
}

const deleteDosen = async (id) => {
  if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
    try {
      await api.delete(`/dosen/${id}`)
      fetchDosen()
    } catch (error) {
      console.error('Failed to delete dosen', error)
      alert('Terjadi kesalahan saat menghapus data.')
    }
  }
}
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-xl font-semibold text-white">Daftar Dosen</h3>
      <button @click="openModal()" class="btn-primary">
        + Tambah Dosen
      </button>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-slate-900 border-b border-slate-700">
            <th class="py-3 px-4 text-slate-300 font-medium">ID</th>
            <th class="py-3 px-4 text-slate-300 font-medium">Nama Dosen</th>
            <th class="py-3 px-4 text-slate-300 font-medium">NIDN</th>
            <th class="py-3 px-4 text-slate-300 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="dosen in dosens" :key="dosen.id" class="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
            <td class="py-4 px-4 text-slate-400">{{ dosen.id }}</td>
            <td class="py-4 px-4 font-medium text-white">{{ dosen.nama }}</td>
            <td class="py-4 px-4 text-slate-400">{{ dosen.nidn }}</td>
            <td class="py-4 px-4 text-right">
              <button @click="openModal(dosen)" class="text-slate-300 hover:text-white mr-4 transition-colors font-medium">Edit</button>
              <button @click="deleteDosen(dosen.id)" class="text-krs-accent hover:text-red-400 transition-colors font-medium">Hapus</button>
            </td>
          </tr>
          <tr v-if="dosens.length === 0">
            <td colspan="4" class="py-8 text-center text-slate-500">Belum ada data dosen.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="bg-slate-900 border border-slate-700 w-full max-w-md p-6 shadow-2xl transform transition-all">
        <h3 class="text-xl font-bold text-white mb-6 border-b border-slate-800 pb-3">
          {{ isEdit ? 'Edit Data Dosen' : 'Tambah Data Dosen' }}
        </h3>
        
        <form @submit.prevent="saveDosen" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">Nama Lengkap</label>
            <input v-model="formData.nama" type="text" required class="input-field" placeholder="Masukkan nama dosen" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-400 mb-1">NIDN</label>
            <input v-model="formData.nidn" type="text" required class="input-field" placeholder="Masukkan NIDN" />
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
