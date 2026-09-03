# ⚡ Cara Menjalankan Si Lestari (Wajib Baca!)

> **Error `HTTP 502` di halaman Jelajahi/Statistik = PocketBase (backend) belum
> jalan.** Aplikasi frontend-nya hidup, tapi tidak bisa mengambil data. Solusinya
> selalu sama: jalankan backend dulu. Ikuti panduan di bawah.

---

## 🚀 Cara Tercepat — Klik Satu File

**Double-click file `MULAI.bat`** di folder utama proyek.

Akan terbuka **2 jendela** (biarkan keduanya tetap terbuka selama aplikasi dipakai):

| Jendela | Isi | Alamat |
|---|---|---|
| PocketBase | Backend + database | http://127.0.0.1:8090 (Admin UI: `/_/`) |
| Next.js Dev | Aplikasi web | http://localhost:3000 (terbuka otomatis) |

**Berhenti:** tutup kedua jendela tersebut (atau tekan `Ctrl+C` di dalamnya).

---

## 🔧 Cara Manual (2 terminal)

### Terminal 1 — Backend PocketBase (WAJIB JALAN DULU)

```bash
cd apps/pocketbase
./pocketbase serve --http=127.0.0.1:8090
# Windows Git Bash: ./pocketbase.exe serve --http=127.0.0.1:8090
```

Tunggu sampai muncul:

```
Server started at http://127.0.0.1:8090
├─ REST API:  http://127.0.0.1:8090/api/
└─ Dashboard: http://127.0.0.1:8090/_/
```

### Terminal 2 — Aplikasi Next.js

```bash
cd apps/web
npm run dev
```

Buka **http://localhost:3000**

---

## ✅ Checklist Harian (sebelum mulai kerja / screenshot)

1. ☐ Jalankan `MULAI.bat` (atau 2 terminal manual)
2. ☐ Buka http://localhost:3000 — **angka di hero harus muncul** (70 kata · 12 daerah)
   - Angka muncul = backend OK ✓
   - Angka kosong / error 502 = PocketBase belum jalan ✗
3. ☐ Baru kerja: edit kode, screenshot, dsb.

---

## 🩺 Kenapa Kok 502?

Alur datanya begini:

```
Browser → Next.js (localhost:3000) → PocketBase (127.0.0.1:8090) → data
```

Kalau PocketBase mati, Next.js tetap hidup tapi semua endpoint data
(`/api/entries`, `/api/stats`, dll) mengembalikan **502** karena tidak bisa
menghubungi database. Itu sebabnya halaman Jelajahi menampilkan
"Kamus tidak bisa dimuat".

**Yang sering jadi penyebab:**
- Komputer baru restart → proses PocketBase hilang (dia tidak auto-start)
- Jendela PocketBase tertutup tak sengaja
- Hanya menjalankan `npm run dev` tanpa menjalankan PocketBase

**Solusi:** jalankan lagi `MULAI.bat`. Data **tidak pernah hilang** —
semua tersimpan di `apps/pocketbase/pb_data/`.

---

## 🧰 Troubleshooting Lain

| Gejala | Penyebab | Solusi |
|---|---|---|
| `pocketbase serve` gagal: port 8090 dipakai | PB lama masih jalan | Tutup jendela PB lama, atau `taskkill /F /IM pocketbase.exe` lalu jalankan lagi |
| `EADDRINUSE :3000` | Dev server lama masih hidup | Tutup terminal Next.js lama, atau `taskkill /F /IM node.exe` (hati-hati: menutup semua node) |
| Halaman blank + error module | Dependency berubah | `cd apps/web && npm install` |
| Chat AI jawaban "koneksi terganggu" | Kuota Gemini habis hari ini | Tunggu reset (tengah malam waktu Pasifik) atau isi `GEMINI_MODEL_FALLBACKS` di `.env.local` |
| Data hilang semua | `pb_data/` terhapus | Restore dari backup; jika belum pernah backup, jalankan ulang `npm run seed` |
| Lupa password admin PocketBase | — | `cd apps/pocketbase && ./pocketbase.exe superuser update admin@silestari.id passwordBaru` |

---

## 💾 Jangan Lupa (Hal yang Sering Kelupaan)

- **Backup data**: salin folder `apps/pocketbase/pb_data/` ke tempat aman secara berkala
- **`.env.local`** berisi kredensial — jangan pernah di-share/commit
- **Kuota Gemini**: model validasi utama ±20 request/hari (chat pakai model
  terpisah). Untuk demo besar, sebaiknya rekam di hari kuota masih fresh
- Sebelum matikan laptop: tidak ada urutan khusus, cukup tutup kedua jendela server
