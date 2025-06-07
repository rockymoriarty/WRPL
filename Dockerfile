# Gunakan Node.js versi LTS sebagai base image
FROM node:22-alpine

# Set direktori kerja utama di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke direktori kerja utama
# Ini penting agar npm install bisa menemukan file-file ini
COPY package.json package-lock.json ./

# Hapus cache npm dan jalankan npm ci (clean install)
# npm ci lebih disarankan untuk CI/CD karena memastikan instalasi bersih berdasarkan package-lock.json
RUN npm cache clean --force && npm ci --omit=dev

# Salin seluruh isi repositori (termasuk folder 'src' dan 'public')
# ke dalam direktori kerja utama kontainer.
COPY . .

# Beri tahu kontainer port mana yang akan didengarkan (Railway akan menggunakan 8080)
EXPOSE 8080

# Command untuk menjalankan aplikasi saat kontainer dimulai
# Ini akan menjalankan 'npm start' dari package.json di root /usr/src/app
CMD ["npm", "start"]