# STEP 1: PILIH BASE IMAGE
# Kita pakai Node.js versi 22 dengan Alpine Linux yang ringan.
FROM node:22-alpine

# STEP 2: SET WORKING DIRECTORY
# Semua file project akan diletakkan di dalam folder /app di kontainer.
WORKDIR /app

# STEP 3: SALIN FILE MANIFEST DEPENDENSI
# Salin package.json dan package-lock.json.
# Ini penting untuk caching Docker layers dan konsistensi dependensi.
COPY package.json ./
COPY package-lock.json ./

# STEP 4: INSTAL DEPENDENSI PROJECT
# Jalankan npm install untuk menginstal semua dependensi yang dibutuhkan.
# Opsi --production akan memastikan hanya dependensi produksi yang diinstal.
RUN npm install --production

# STEP 5: SALIN SISA KODE PROJECT
# Salin semua file dan folder lain dari project-mu ke dalam working directory di kontainer.
# Pastikan .dockerignore sudah berisi node_modules/ agar tidak disalin lagi.
COPY . .

# STEP 6: EXPOSE PORT
# Beritahu Docker bahwa aplikasi di dalam kontainer akan mendengarkan koneksi di port 3000.
EXPOSE 3000

# STEP 7: DEFINISIKAN COMMAND UNTUK MENJALANKAN APLIKASI
# Perintah langsung untuk menjalankan file server.js di dalam folder backend.
CMD ["node", "backend/server.js"]