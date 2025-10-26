// File: app/cart/page.tsx
'use client'; // Halaman ini harus 'use client'

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react"; // Import untuk 'isMounted'

export default function CartPage() {
  // Ambil semua fungsi dan data dari CartContext
  const { cartItems, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const router = useRouter();

  // Tambahkan "Penjaga" (Guard) seperti di halaman checkout
  // Ini mencegah error "prerender" saat Vercel build
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Memuat keranjang...</p>;
  }
  // Selesai "Penjaga"

  const handleCheckout = () => {
    // Arahkan pelanggan ke halaman checkout
    router.push('/checkout');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px' }}>
      <h1>Keranjang Belanja Anda</h1>
      
      {cartItems.length === 0 ? (
        // Tampilan jika keranjang kosong
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p>Keranjang Anda masih kosong.</p>
          <Link href="/products" style={{ color: 'lightblue' }}>
            Mulai Belanja
          </Link>
        </div>
      ) : (
        // Tampilan jika ada barang
        <div>
          {/* Daftar Barang */}
          {cartItems.map((item) => (
            <div key={item._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #555', paddingBottom: '15px' }}>
              <Image 
                src={item.image} 
                alt={item.name} 
                width={80} 
                height={80} 
                style={{ objectFit: 'cover', borderRadius: '4px' }}
              />
              <div style={{ flexGrow: 1, marginLeft: '15px' }}>
                <Link href={`/products/${item._id}`} style={{ fontSize: '1.2rem', textDecoration: 'none' }}>
                  {item.name}
                </Link>
                <p>Rp {item.price.toLocaleString('id-ID')}</p>
              </div>
              
              {/* Pengatur Jumlah (Quantity) */}
              <input 
                type="number" 
                value={item.qty}
                min="1"
                max={item.stock} // Batasi agar tidak melebihi stok
                onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                style={{ width: '60px', padding: '5px', color: 'white', backgroundColor: '#333', border: '1px solid #555', borderRadius: '4px', textAlign: 'center' }}
              />
              
              {/* Tombol Hapus */}
              <button 
                onClick={() => removeFromCart(item._id)}
                style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Hapus
              </button>
            </div>
          ))}

          {/* Ringkasan & Tombol Aksi */}
          <div style={{ marginTop: '30px', borderTop: '2px solid #777', paddingTop: '20px' }}>
            <h2 style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Total Harga:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
              <button 
                onClick={clearCart}
                style={{ backgroundColor: 'gray', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Kosongkan Keranjang
              </button>
              <button 
                onClick={handleCheckout}
                style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer', fontSize: '1.1rem' }}
              >
                Lanjut ke Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}