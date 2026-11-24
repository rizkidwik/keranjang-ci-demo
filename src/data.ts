import type { Voucher } from './lib/keranjang.ts'

export interface Produk {
  id: string
  nama: string
  harga: number
}

export const PRODUK: Produk[] = [
  { id: 'kopi', nama: 'Kopi susu', harga: 18000 },
  { id: 'geprek', nama: 'Nasi ayam geprek', harga: 22000 },
  { id: 'mie', nama: 'Mi instan', harga: 3500 },
  { id: 'buku', nama: 'Buku catatan', harga: 12000 },
  { id: 'flashdisk', nama: 'Flashdisk 64 GB', harga: 75000 },
]

export const VOUCHER: Voucher[] = [
  { kode: 'HEMAT50', tipe: 'persen', persen: 50, maksDiskon: 25000, minBelanja: 40000 },
  { kode: 'POTONG10', tipe: 'potongan', nilai: 10000, minBelanja: 30000 },
]
