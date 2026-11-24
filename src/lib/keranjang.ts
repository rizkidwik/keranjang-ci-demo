export interface Item {
  id: string
  nama: string
  harga: number
  qty: number
}

interface VoucherDasar {
  kode: string
  minBelanja: number
}

export type Voucher = VoucherDasar &
  (
    | { tipe: 'persen'; persen: number; maksDiskon: number }
    | { tipe: 'potongan'; nilai: number }
  )

export interface HasilDiskon {
  diskon: number
  alasan?: string
}

export interface Ringkasan {
  subtotal: number
  diskon: number
  total: number
  alasan?: string
}

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatRupiah(jumlah: number): string {
  return rupiah.format(jumlah)
}

export function subtotal(items: Item[]): number {
  return items.reduce((jumlah, item) => jumlah + item.harga * item.qty, 0)
}

export function hitungDiskon(
  belanja: number,
  voucher: Voucher | null,
): HasilDiskon {
  if (!voucher) return { diskon: 0 }

  if (belanja < voucher.minBelanja) {
    return {
      diskon: 0,
      alasan: `Minimal belanja ${formatRupiah(voucher.minBelanja)} untuk ${voucher.kode}`,
    }
  }

  if (voucher.tipe === 'persen') {
    return { diskon: Math.floor((belanja * voucher.persen) / 100) }
  }

  // potongan tetap tidak boleh melebihi belanja, total tidak boleh negatif
  return { diskon: Math.min(voucher.nilai, belanja) }
}

export function cariVoucher(kode: string, daftar: Voucher[]): Voucher | null {
  const bersih = kode.trim().toUpperCase()
  return daftar.find((voucher) => voucher.kode === bersih) ?? null
}

export function ringkasan(items: Item[], voucher: Voucher | null): Ringkasan {
  const belanja = subtotal(items)
  const { diskon, alasan } = hitungDiskon(belanja, voucher)
  return { subtotal: belanja, diskon, total: belanja - diskon, alasan }
}
