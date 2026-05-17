<script setup>
import { ref } from 'vue'
import Dosen from './components/Dosen.vue'
import Mahasiswa from './components/Mahasiswa.vue'

const currentTab = ref('dosen')
</script>

<template>
  <div class="min-h-screen bg-krs-dark flex flex-col md:flex-row">
    <!-- Sidebar -->
    <aside class="w-full md:w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col">
      <div class="mb-10">
        <h1 class="text-2xl font-bold text-white tracking-tight">KRS <span class="text-krs-accent">Terpadu</span></h1>
        <p class="text-slate-400 text-sm mt-1">Sistem Manajemen Akademik</p>
      </div>
      
      <nav class="flex flex-col gap-2 flex-1">
        <button 
          @click="currentTab = 'dosen'" 
          :class="['text-left px-4 py-3 font-medium transition-all duration-200', currentTab === 'dosen' ? 'bg-krs-accent text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white']"
        >
          Data Dosen
        </button>
        <button 
          @click="currentTab = 'mahasiswa'" 
          :class="['text-left px-4 py-3 font-medium transition-all duration-200', currentTab === 'mahasiswa' ? 'bg-krs-accent text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white']"
        >
          Data Mahasiswa
        </button>
      </nav>
      
      <div class="mt-auto pt-6 border-t border-slate-800">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-slate-800 rounded-none flex items-center justify-center text-krs-accent font-bold shadow-inner">
            A
          </div>
          <div>
            <p class="text-sm font-semibold text-white">Admin Panel</p>
            <p class="text-xs text-slate-500">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 p-8 bg-krs-dark overflow-auto">
      <header class="mb-8 flex justify-between items-end border-b border-slate-800 pb-4">
        <div>
          <h2 class="text-3xl font-bold text-white">
            {{ currentTab === 'dosen' ? 'Manajemen Dosen' : 'Manajemen Mahasiswa' }}
          </h2>
          <p class="text-slate-400 mt-2">Kelola data akademik dengan mudah dan efisien.</p>
        </div>
      </header>

      <div class="fade-in">
        <Dosen v-if="currentTab === 'dosen'" />
        <Mahasiswa v-if="currentTab === 'mahasiswa'" />
      </div>
    </main>
  </div>
</template>

<style>
.fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
