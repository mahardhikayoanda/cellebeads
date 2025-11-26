import { getStockData } from './actions';
import StockClient from './StockClient';
import { PackageCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StockPage() {
  const products = await getStockData();

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-lora font-bold text-stone-800 flex items-center gap-2">
             <PackageCheck className="text-primary" /> Stok Gudang
          </h1>
          <p className="text-stone-500 mt-1">Pantau ketersediaan barang dan lakukan *restock* cepat.</p>
        </div>
        
        {/* Statistik Mini */}
        <div className="glass-panel px-6 py-3 rounded-2xl flex gap-6">
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

      {/* Client Component untuk Interaksi */}
      <StockClient initialProducts={products} />
    </div>
  );
}