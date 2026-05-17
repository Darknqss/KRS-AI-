# KRS Terpadu - PEVN Stack

Sistem Manajemen Kartu Rencana Studi (KRS) Terpadu yang dibangun menggunakan arsitektur modern **PEVN Stack** (PostgreSQL, Express.js, Vue.js, Node.js) dan dioptimalkan dengan **Redis Caching** untuk performa data yang sangat cepat.

## 🚀 Fitur Utama

- **Premium UI/UX**: Antarmuka modern dengan *Dark Mode* default menggunakan Tailwind CSS v4, desain komponen *sharp edges* dan aksen merah yang elegan.
- **RESTful API backend**: Dibangun dengan Express.js dan terkoneksi penuh ke sistem PostgreSQL.
- **Prisma ORM**: Pemetaan dan sinkronisasi otomatis menggunakan arsitektur *cloud* Supabase.
- **Redis Caching Strategy**: Implementasi *middleware* *cache-hit* dan auto *invalidate* secara *real-time* saat operasi CRUD (Create, Read, Update, Delete) berjalan pada entitas.
- **Relasi Entitas Terpadu**: Pengelolaan data Dosen dan Mahasiswa di mana setiap mahasiswa dapat dipetakan langsung dengan Dosen Pembimbing masing-masing.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Vue.js 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Hosted on Supabase)
- **ORM**: Prisma ORM
- **Caching**: Redis (Hosted on Upstash)

## 📦 Struktur Direktori

```text
KRS-AI-/
├── backend/                  # Server Express API & Prisma ORM
│   ├── index.js              # Entry point REST API & Redis Middleware
│   ├── redisClient.js        # Konfigurasi Upstash Redis
│   ├── prisma/               # Skema Prisma & pemetaan ke Supabase
│   └── .env                  # Environment Variables (Database & Redis URL)
├── frontend/                 # Client Vue.js
│   ├── src/
│   │   ├── components/       # Komponen Vue (Dosen.vue, Mahasiswa.vue)
│   │   ├── App.vue           # Main Layout & Tab Navigation
│   │   ├── index.css         # Tailwind v4 Directives & Custom Theme
│   │   └── main.js           # Vue Application Entry
│   └── vite.config.js
└── README.md
```

## ⚙️ Cara Menjalankan Secara Lokal (Development)

### Persyaratan Sistem
- **Node.js** (v18+)
- Akun / Database aktif di **Supabase** (PostgreSQL)
- Akun aktif di **Upstash** (Redis)

### 1. Kloning Repositori
```bash
git clone https://github.com/Darknqss/KRS-AI-.git
cd KRS-AI-
```

### 2. Setup Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` di dalam folder backend dan konfigurasikan koneksi sesuai server Anda:
   ```env
   DATABASE_URL="postgresql://[USER]:[PASSWORD]@[HOST]:5432/postgres"
   REDIS_URL="rediss://default:[PASSWORD]@[HOST]:6379"
   PORT=3000
   ```
4. Generate Prisma Client:
   ```bash
   npx prisma generate
   ```
5. Jalankan server backend dengan nodemon:
   ```bash
   npm run dev
   ```

### 3. Setup Frontend
1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd ../frontend
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Jalankan server frontend Vite:
   ```bash
   npm run dev
   ```
4. Buka browser dan akses ke `http://localhost:5175/`.

## 📜 Lisensi

Proyek ini bersifat bebas dan diperuntukkan untuk kebutuhan akademik / pembelajaran.
