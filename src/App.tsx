import { useState, type FormEvent } from 'react'
import { PRODUK, VOUCHER } from './data.ts'
import {
  cariVoucher,
  formatRupiah,
  ringkasan,
  type Item,
  type Voucher,
} from './lib/keranjang.ts'

const versi = (import.meta.env.VITE_COMMIT as string | undefined)?.slice(0, 7) ?? 'lokal'

export default function App() {
  const [qty, setQty] = useState<Record<string, number>>({ kopi: 2, geprek: 1 })
  const [kode, setKode] = useState('')
  const [voucher, setVoucher] = useState<Voucher | null>(null)
  const [pesan, setPesan] = useState('')

  const ubahQty = (id: string, jumlah: number) =>
    setQty((lama) => ({ ...lama, [id]: Math.max(0, jumlah) }))

  const items: Item[] = PRODUK.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({
    ...p,
    qty: qty[p.id],
  }))
  const hasil = ringkasan(items, voucher)

  const pasangVoucher = (e: FormEvent) => {
    e.preventDefault()
    const ditemukan = cariVoucher(kode, VOUCHER)
    if (!ditemukan) {
      setPesan(`Kode "${kode.trim()}" tidak dikenal`)
      return
    }
    setVoucher(ditemukan)
    setPesan('')
    setKode('')
  }

  return (
    <main className="halaman">
      <header>
        <p className="label">Demo CI/CD</p>
        <h1>Kantin Kampus</h1>
        <p className="sub">Pilih menu, pasang voucher, lihat totalnya.</p>
      </header>

      <div className="kolom">
        <section aria-labelledby="judul-menu">
          <h2 id="judul-menu">Menu</h2>
          <ul className="menu">
            {PRODUK.map((p) => {
              const jumlah = qty[p.id] ?? 0
              return (
                <li key={p.id}>
                  <div>
                    <p className="nama">{p.nama}</p>
                    <p className="harga">{formatRupiah(p.harga)}</p>
                  </div>
                  <div className="stepper">
                    <button
                      type="button"
                      aria-label={`Kurangi ${p.nama}`}
                      onClick={() => ubahQty(p.id, jumlah - 1)}
                      disabled={jumlah === 0}
                    >
                      −
                    </button>
                    <span aria-live="polite">{jumlah}</span>
                    <button
                      type="button"
                      aria-label={`Tambah ${p.nama}`}
                      onClick={() => ubahQty(p.id, jumlah + 1)}
                    >
                      +
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="judul-ringkasan" className="ringkasan">
          <h2 id="judul-ringkasan">Ringkasan</h2>
          {items.length === 0 ? (
            <p className="kosong">Keranjang masih kosong.</p>
          ) : (
            <>
              <ul className="baris">
                {items.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.nama} × {item.qty}
                    </span>
                    <span>{formatRupiah(item.harga * item.qty)}</span>
                  </li>
                ))}
              </ul>

              <form className="voucher" onSubmit={pasangVoucher}>
                <label htmlFor="kode">Kode voucher</label>
                <div>
                  <input
                    id="kode"
                    value={kode}
                    onChange={(e) => setKode(e.target.value)}
                    placeholder="mis. HEMAT50"
                    autoComplete="off"
                  />
                  <button type="submit">Pakai</button>
                </div>
              </form>
              {pesan && (
                <p role="alert" className="galat">
                  {pesan}
                </p>
              )}
              {voucher && (
                <p className="terpasang">
                  {voucher.kode} terpasang.{' '}
                  <button type="button" className="tautan" onClick={() => setVoucher(null)}>
                    Lepas
                  </button>
                </p>
              )}
              {hasil.alasan && <p className="galat">{hasil.alasan}</p>}

              <dl className="total">
                <div>
                  <dt>Subtotal</dt>
                  <dd>{formatRupiah(hasil.subtotal)}</dd>
                </div>
                {hasil.diskon > 0 && (
                  <div>
                    <dt>Diskon</dt>
                    <dd>−{formatRupiah(hasil.diskon)}</dd>
                  </div>
                )}
                <div className="akhir">
                  <dt>Total</dt>
                  <dd>{formatRupiah(hasil.total)}</dd>
                </div>
              </dl>
            </>
          )}
        </section>
      </div>

      <footer>Versi {versi}</footer>
    </main>
  )
}
