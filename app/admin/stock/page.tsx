// File: app/admin/stock/page.tsx
import { getStockData } from './actions';
import StockClient from './StockClient';
import { ClipboardList } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StockPage() {
  const products = await getStockData();

  return (
    <div className="space-y-8 pb-20">
      
      {/* --- HEADER BARU --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl text-white shadow-lg shadow-pink-200">
               <ClipboardList size={24} />
            </div>
            <div>
               <h1 className="text-3xl font-lora font-bold text-stone-800">Stok Gudang</h1>
               <p className="text-stone-500">Pantau ketersediaan barang dan lakukan restock.</p>
            </div>
        </div>
        
        {/* Statistik Mini (Style dipercantik sedikit agar match) */}
        <div className="bg-white/80 backdrop-blur-md border border-stone-100 shadow-sm px-6 py-3 rounded-2xl flex gap-6">
           <div className="text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Item</p>
              <p className="text-xl font-bold text-stone-800">{products.length}</p>
           </div>
           <div className="w-px bg-stone-200" />
           <div className="text-center">
              <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Stok Menipis</p>
              <p className="text-xl font-bold text-rose-500">
                {products.filter(p => p.stock < 5).length}
              </p>
           </div>
        </div>
      </div>
      {/* ------------------- */}

      <StockClient initialProducts={products} />
    </div>
  );
}