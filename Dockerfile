# Gunakan Node.js versi LTS sebagai base image
FROM node:18-alpine

# Set direktori kerja utama di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json ke direktori kerja
COPY package.json package-lock.json ./

# Instal dependensi
# --omit=dev akan menghindari instalasi devDependencies di produksi
RUN npm install --omit=dev

# Salin seluruh folder 'src' dari repositori ke dalam /usr/src/app/src di kontainer
COPY src ./src

# Eksplisit beritahu Node.js di mana mencari modul
# Ini adalah trik untuk kasus di mana modul tidak ditemukan meskipun sudah diinstal di WORKDIR.
ENV NODE_PATH=./node_modules

# Beri tahu kontainer port mana yang akan didengarkan (Railway akan menggunakan 8080)
EXPOSE 8080

# Command untuk menjalankan aplikasi saat kontainer dimulai
# Ini akan menjalankan 'npm start' dari package.json di root /usr/src/app
CMD ["npm", "start"]