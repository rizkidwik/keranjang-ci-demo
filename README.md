# Kantin Kampus: demo CI/CD

[![CI/CD](https://github.com/rizkidwik/keranjang-ci-demo/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rizkidwik/keranjang-ci-demo/actions/workflows/ci-cd.yml)

Keranjang belanja dengan voucher diskon (Vite + React + TypeScript + Vitest). Dibuat sebagai bahan demo talk "Push, Test, Live": setiap push melewati pipeline, dan deploy ke GitHub Pages hanya jalan kalau semua tahap lolos.

Situs: https://rizkidwik.github.io/keranjang-ci-demo/

## Pipeline

```
install → lint → type-check → test → build → deploy (GitHub Pages)
```

Job `deploy` memakai `needs: ci`, jadi satu tahap merah di `ci` menahan deploy. Footer situs menampilkan 7 karakter commit yang sedang live, jadi mudah dicek apakah situs berganti versi.

## Menjalankan lokal

```sh
npm install
npm run dev        # http://localhost:5173/keranjang-ci-demo/
npm run lint && npm run typecheck && npm test && npm run build
```

## Aturan voucher

| Kode | Aturan | Minimal belanja |
|---|---|---|
| `HEMAT50` | 50%, **maksimal Rp25.000** | Rp40.000 |
| `POTONG10` | potongan tetap Rp10.000 | Rp30.000 |

Total tidak pernah negatif. Skala dan angka hanya contoh.

## Setup GitHub Pages (sekali)

Repo → Settings → Pages → Source: **GitHub Actions**.

## Skenario demo

Riwayat commit repo ini sengaja berisi kegagalan di tiap tahap. Lihat tab Actions.

| Perubahan | Tahap yang merah | Akibat |
|---|---|---|
| Hook React dipanggil setelah `return` awal (`src/Ringkasan.tsx`) | **Lint** | Type-check, test, build, deploy tidak jalan |
| `ubahQty(p.id, e.target.value)` tanpa `Number()` | **Type-check** | Test, build, deploy tidak jalan |
| Hapus `Math.min(diskon, voucher.maksDiskon)` di `hitungDiskon` | **Test** | Deploy tidak jalan, situs tetap versi lama |
| Pull request dengan tes gagal | **Test** (di PR) | Deploy tidak pernah jalan dari PR |

Kenapa tes "melewati batas maksimal" penting: tes `HEMAT50` pada belanja Rp40.000 tetap hijau walaupun batas maksimal dihapus. Bug baru terlihat pada belanja besar (Rp200.000 → diskon seharusnya Rp25.000, bukan Rp100.000). Tes yang hanya mencoba kasus mudah ikut hijau pada kode yang salah.

## Struktur

```
src/lib/keranjang.ts       logika murni: subtotal, diskon, voucher
src/lib/keranjang.test.ts  tes Vitest
src/data.ts                menu dan daftar voucher
src/App.tsx                antarmuka
.github/workflows/ci-cd.yml
```
