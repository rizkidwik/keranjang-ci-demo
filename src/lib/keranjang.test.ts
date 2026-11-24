import { describe, expect, it } from 'vitest'
import { VOUCHER } from '../data.ts'
import {
  cariVoucher,
  formatRupiah,
  hitungDiskon,
  ringkasan,
  subtotal,
  type Item,
  type Voucher,
} from './keranjang.ts'

const HEMAT50: Voucher = {
  kode: 'HEMAT50',
  tipe: 'persen',
  persen: 50,
  maksDiskon: 25000,
  minBelanja: 40000,
}

const POTONG10: Voucher = {
  kode: 'POTONG10',
  tipe: 'potongan',
  nilai: 10000,
  minBelanja: 30000,
}

const item = (harga: number, qty: number): Item => ({
  id: `item-${harga}`,
  nama: `Barang ${harga}`,
  harga,
  qty,
})

describe('subtotal', () => {
  it('menjumlahkan harga dikali jumlah tiap barang', () => {
    expect(subtotal([item(18000, 2), item(3500, 4)])).toBe(50000)
  })

  it('keranjang kosong bernilai 0', () => {
    expect(subtotal([])).toBe(0)
  })
})

describe('voucher persen (HEMAT50)', () => {
  it('memberi 50% kalau di bawah batas maksimal diskon', () => {
    expect(hitungDiskon(40000, HEMAT50).diskon).toBe(20000)
  })

  it('diskon dipotong di batas maksimal 25.000', () => {
    const hasil = ringkasan([item(100000, 2)], HEMAT50)
    expect(hasil.subtotal).toBe(200000)
    expect(hasil.diskon).toBe(25000)
    expect(hasil.total).toBe(175000)
  })

  it('belum capai minimal belanja: tanpa diskon dan ada alasan', () => {
    const hasil = hitungDiskon(39000, HEMAT50)
    expect(hasil.diskon).toBe(0)
    expect(hasil.alasan).toContain('Minimal belanja')
  })
})

describe('voucher potongan (POTONG10)', () => {
  it('memotong nilai tetap', () => {
    expect(hitungDiskon(30000, POTONG10).diskon).toBe(10000)
  })

  it('potongan lebih besar dari belanja: total 0, tidak negatif', () => {
    const besar: Voucher = { kode: 'BESAR', tipe: 'potongan', nilai: 50000, minBelanja: 0 }
    const hasil = ringkasan([item(30000, 1)], besar)
    expect(hasil.diskon).toBe(30000)
    expect(hasil.total).toBe(0)
  })
})

describe('cariVoucher', () => {
  const daftar = [HEMAT50, POTONG10]

  it('mengabaikan huruf besar-kecil dan spasi', () => {
    expect(cariVoucher('  hemat50 ', daftar)).toBe(HEMAT50)
  })

  it('kode tidak dikenal menghasilkan null', () => {
    expect(cariVoucher('GRATIS', daftar)).toBeNull()
  })
})

describe('invarian', () => {
  it('total selalu antara 0 dan subtotal untuk keranjang acak', () => {
    let seed = 42
    const acak = (maks: number) => {
      seed = (seed * 1664525 + 1013904223) % 4294967296
      return seed % maks
    }
    for (let i = 0; i < 200; i++) {
      const items = Array.from({ length: acak(5) }, () => item(500 * (1 + acak(200)), 1 + acak(5)))
      for (const voucher of [null, HEMAT50, POTONG10]) {
        const hasil = ringkasan(items, voucher)
        expect(hasil.total).toBeGreaterThanOrEqual(0)
        expect(hasil.total).toBeLessThanOrEqual(hasil.subtotal)
      }
    }
  })
})

describe('voucher BARU25 untuk pelanggan baru', () => {
  it('memberi 25% untuk belanja 100.000', () => {
    const baru25 = cariVoucher('BARU25', VOUCHER)
    expect(hitungDiskon(100000, baru25).diskon).toBe(25000)
  })
})

describe('formatRupiah', () => {
  it('memakai pemisah ribuan titik', () => {
    expect(formatRupiah(175000).replace(/\s/g, ' ')).toBe('Rp 175.000')
  })
})
