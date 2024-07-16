const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;
const { getQRCode, connectWhatsapp } = require('./index');

const mongoURI = 'mongodb+srv://poco4xprou:2v3cEon5KQedX3JA@lugi.ecnsu3f.mongodb.net/?retryWrites=true&w=majority&appName=lugi'; // Ganti dengan URI MongoDB Anda
const dbName = 'lugi'; // Ganti dengan nama database Anda

let db;

// Hubungkan ke MongoDB
MongoClient.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    console.log('Terhubung ke MongoDB');
    db = client.db(dbName);
  })
  .catch(error => console.error('Kesalahan saat menghubungkan ke MongoDB:', error));

app.get('/', (req, res) => {
  res.send('Bot WhatsApp sedang berjalan!');
});

const qrcode = require('qrcode');

app.get('/qr-image', async (req, res) => {
  let attempts = 0;
  const maxAttempts = 10;

  const tryGetQR = async () => {
    const qr = getQRCode();
    if (qr) {
      const qrImage = await qrcode.toDataURL(qr);
      res.send(`<img src="${qrImage}" alt="Kode QR">`);
    } else if (attempts < maxAttempts) {
      attempts++;
      setTimeout(tryGetQR, 1000);
    } else {
      res.send('Kode QR belum tersedia atau sudah terhubung ke WhatsApp');
    }
  };

  tryGetQR();
});

app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});

// Jalankan bot WhatsApp
connectWhatsapp(db);