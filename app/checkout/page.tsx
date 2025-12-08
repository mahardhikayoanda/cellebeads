// File: app/checkout/page.tsx
import CheckoutForm from './CheckoutForm';
import { Lock } from 'lucide-react';

// Background Animasi (Konsisten)
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5] pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function CheckoutPage() {
  return (
    <div className="min-h-screen pb-20 relative text-stone-800 font-sans">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 pt-8 max-w-6xl">
        
        {/* Header Sederhana */}
        <div className="flex flex-col items-center justify-center mb-10 text-center space-y-2">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-xs font-bold uppercase tracking-widest">
              <Lock size={12} /> Pembayaran Aman
           </div>
           <h1 className="text-3xl md:text-4xl font-lora font-bold text-stone-800">
              Selesaikan Pesanan
           </h1>
           <p className="text-stone-500 max-w-md">
              Lengkapi detail pengiriman di bawah ini untuk memproses pesananmu.
           </p>
        </div>

        {/* Client Component untuk Form & Logic */}
        <CheckoutForm />
        
      </div>
    </div>
  );
}