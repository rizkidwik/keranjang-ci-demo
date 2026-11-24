import { useMemo } from 'react'
import { formatRupiah, ringkasan, type Item, type Voucher } from './lib/keranjang.ts'

interface Props {
  items: Item[]
  voucher: Voucher | null
}

export function Ringkasan({ items, voucher }: Props) {
  if (items.length === 0) {
    return <p className="kosong">Keranjang masih kosong.</p>
  }

  const hasil = useMemo(() => ringkasan(items, voucher), [items, voucher])

  return (
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
  )
}
