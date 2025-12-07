// File: app/admin/page.tsx
import { getAdminStats } from './dashboard/actions';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { 
  DollarSign, ShoppingBag, Package, Users, 
  ArrowUpRight, Sparkles, TrendingUp, LayoutDashboard 
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  const StatCard = ({ title, value, icon: Icon, gradient, delay }: any) => (
    <div 
        className={`relative overflow-hidden rounded-3xl p-[1px] shadow-xl shadow-pink-100 hover:shadow-2xl transition-shadow duration-500 group animate-fade-up`}
        style={{ animationDelay: `${delay}ms` }}
    >
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-40 transition-opacity duration-500`}></div>
        <div className="relative bg-white/80 backdrop-blur-xl h-full rounded-[23px] p-6 flex flex-col justify-between overflow-hidden">
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:scale-150 transition-transform duration-700 blur-xl`}></div>
            <div className="flex justify-between items-start z-10">
                <div className={`p-3 rounded-2xl bg-white shadow-sm text-stone-700 group-hover:scale-110 transition-transform duration-300 ring-1 ring-stone-100`}>
                    <Icon size={24} />
                </div>
            </div>
            <div className="mt-6 z-10">
                <p className="text-sm font-medium text-stone-500 uppercase tracking-widest mb-1">{title}</p>
                <h3 className="text-3xl font-lora font-bold text-stone-800 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-stone-800 group-hover:to-pink-600 transition-all">
                    {value}
                </h3>
            </div>
        </div>
    </div>
  );

  return (
    <div className="space-y-10">
      
      {/* --- HEADER BARU (Konsisten dengan Profil) --- */}
      <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl text-white shadow-lg shadow-pink-200">
             <LayoutDashboard size={24} />
          </div>
          <div>
             <h1 className="text-3xl font-lora font-bold text-stone-800">Dashboard</h1>
             <p className="text-stone-500">Ringkasan aktivitas toko dan statistik terkini.</p>
          </div>
      </div>
      {/* --------------------------------------------- */}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Pendapatan" value={formatCurrency(stats.totalRevenue)} icon={DollarSign} gradient="from-emerald-400 to-teal-500" delay={100} />
        <Link href="/admin/orders" className="block">
            <StatCard title="Pesanan Baru" value={stats.pendingOrdersCount} icon={ShoppingBag} gradient="from-pink-400 to-rose-500" delay={200} />
        </Link>
        <Link href="/admin/products" className="block">
            <StatCard title="Total Produk" value={stats.totalProducts} icon={Package} gradient="from-blue-400 to-indigo-500" delay={300} />
        </Link>
        <StatCard title="Pelanggan" value={stats.totalCustomers} icon={Users} gradient="from-purple-400 to-violet-500" delay={400} />
      </div>

      <div className="grid md:grid-cols-3 gap-8 animate-fade-up" style={{ animationDelay: '500ms' }}>
         <div className="md:col-span-2 relative overflow-hidden rounded-3xl p-8 shadow-2xl shadow-pink-200 group">
            <div className="absolute inset-0 bg-gradient-to-r from-stone-900 to-stone-800" />
            <div className="absolute inset-0 opacity-30">
               <div className="absolute top-10 left-20 text-pink-500 animate-pulse"><Sparkles size={20} /></div>
               <div className="absolute bottom-10 right-20 text-purple-500 animate-bounce delay-700"><Sparkles size={30} /></div>
            </div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 h-full">
               <div className="text-white space-y-4">
                  <div className="inline-block px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold tracking-wider">ADMIN TIPS</div>
                  <h3 className="text-3xl font-lora font-bold leading-tight">Kelola Stok dengan <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">Lebih Efisien.</span></h3>
                  <p className="text-stone-400 max-w-md">Pantau produk yang menipis dan lakukan restock sebelum kehabisan.</p>
               </div>
               <Link href="/admin/stock" className="flex-shrink-0 group-hover:scale-105 transition-transform">
                  <div className="w-16 h-16 rounded-full bg-white text-stone-900 flex items-center justify-center shadow-lg hover:bg-pink-500 hover:text-white transition-colors">
                     <ArrowUpRight size={28} />
                  </div>
               </Link>
            </div>
         </div>
         <div className="glass-super rounded-3xl p-8 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-400 to-emerald-400"></div>
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-4 shadow-sm"><Sparkles size={32} /></div>
            <h4 className="text-xl font-bold text-stone-800 mb-2">Toko Terlihat Cantik!</h4>
            <p className="text-sm text-stone-500 mb-6">Jangan lupa cek ulasan pelanggan untuk melihat feedback terbaru.</p>
            <Link href="/admin/reviews" className="text-sm font-bold text-teal-600 hover:text-teal-700 hover:underline">Lihat Ulasan &rarr;</Link>
         </div>
      </div>
    </div>
  );
}