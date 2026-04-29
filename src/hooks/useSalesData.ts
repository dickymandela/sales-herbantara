import { useState, useEffect } from 'react';

export interface SalesData {
  no: number | string;
  order_id: string;
  tanggal: string | Date;
  nama: string;
  no_wa: string | number;
  alamat: string;
  produk: string;
  qty: number;
  satuan: string;
  harga_satuan: number;
  subtotal: number;
  bonus: string;
  ongkir: number;
  potongan_ongkir: number;
  total_bayar: number;
  metode: string;
  ekspedisi: string;
  catatan: string;
  komisi: number;
}

const calculateKomisi = (produk: string, qty: number): number => {
  const p = produk.toLowerCase();
  if (p.includes('slim premier 12')) return qty * 1000;
  if (p.includes('royal class')) return qty * 1500;
  return 0;
};

const MOCK_DATA: SalesData[] = [
  {
    no: 1,
    order_id: "ORD-001",
    tanggal: "2026-04-26",
    nama: "Imam Purbadi",
    no_wa: "81298191918",
    alamat: "Jl. Gambang 5 No. 303, Desa Mekar Jaya, Kecamatan Sukmajaya, Kabupaten Depok, Jawa Barat",
    produk: "Slim Premier 12",
    qty: 10,
    satuan: "pcs",
    harga_satuan: 15000,
    subtotal: 150000,
    bonus: "Free 1 Royal Class",
    ongkir: 24000,
    potongan_ongkir: 10000,
    total_bayar: 164000,
    metode: "COD",
    ekspedisi: "JNE",
    catatan: "Promo beli 1 slop...",
    komisi: 10000
  },
  {
    no: 2,
    order_id: "ORD-002",
    tanggal: "2026-04-26",
    nama: "Wisly",
    no_wa: "81270318977",
    alamat: "Griya Batu Aji Asri...",
    produk: "Royal Class",
    qty: 10,
    satuan: "pcs",
    harga_satuan: 24500,
    subtotal: 245000,
    bonus: "Free 1 Slop Slim Premier 12",
    ongkir: 44000,
    potongan_ongkir: 10000,
    total_bayar: 279000,
    metode: "COD",
    ekspedisi: "JNE",
    catatan: "Promo beli 1 slop...",
    komisi: 15000
  },
  {
    no: 6,
    order_id: "ORD-006",
    tanggal: "2026-04-30",
    nama: "Syamsi",
    no_wa: "85925573352",
    alamat: "Jl. M. Hamim No. 77...",
    produk: "Slim Premier 12",
    qty: 10,
    satuan: "pcs",
    harga_satuan: 15000,
    subtotal: 150000,
    bonus: "Free 1 Royal Class",
    ongkir: 17000,
    potongan_ongkir: 17000,
    total_bayar: 150000,
    metode: "COD",
    ekspedisi: "JNE",
    catatan: "Promo beli 1 slop...",
    komisi: 10000
  }
];

export function useSalesData() {
  const [data, setData] = useState<SalesData[]>(MOCK_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gasUrl, setGasUrl] = useState<string>(import.meta.env.VITE_GAS_URL || '');

  useEffect(() => {
    if (!gasUrl) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(gasUrl);
        if (!response.ok) throw new Error('Failed to fetch from GAS');
        const json = await response.json();
        
        // Basic normalization if needed
        const normalized = json.map((item: any) => {
          const qty = Number(item.qty);
          const produk = String(item.produk);
          return {
            ...item,
            tanggal: new Date(item.tanggal),
            qty,
            harga_satuan: Number(item.harga_satuan),
            subtotal: Number(item.subtotal),
            ongkir: Number(item.ongkir),
            potongan_ongkir: Number(item.potongan_ongkir),
            total_bayar: Number(item.total_bayar),
            komisi: calculateKomisi(produk, qty),
          };
        });
        
        setData(normalized);
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Gagal mengambil data dari Google Sheet. Pastikan URL Web App benar dan sudah dideploy sebagai "Anyone".');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [gasUrl]);

  return { data, loading, error, setGasUrl, gasUrl, isMock: !gasUrl };
}
