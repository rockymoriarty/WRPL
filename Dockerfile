# Gunakan Node.js versi LTS sebagai base image
FROM node:18-alpine

# Set direktori kerja utama di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke direktori kerja
# Ini penting agar npm install bisa menemukan file-file ini
COPY package.json package-lock.json ./

# Instal dependensi
# --omit=dev akan menghindari instalasi devDependencies di produksi
RUN npm install --omit=dev

# Salin seluruh folder 'src' dari repositori ke dalam /usr/src/app/src di kontainer
# Ini akan memastikan server.js ada di /usr/src/app/src/backend/server.js
COPY src ./src

# Beri tahu kontainer port mana yang akan didengarkan
# Express akan mendengarkan di process.env.PORT yang disuntikkan Railway (8080)
EXPOSE 8080

# Command untuk menjalankan aplikasi saat kontainer dimulai
# Ini akan menjalankan 'npm start' yang sudah didefinisikan di package.json
# Railway akan menggunakan ini jika Start Command di Railway dikosongkan.
CMD ["npm", "start"]