// File: app/dashboard/layout.tsx
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Package, User } from 'lucide-react'; // Import ikon

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard/my-orders', label: 'Pesanan Saya', icon: Package },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 min-h-[calc(100vh-200px)]">
      {/* Sidebar Navigasi Dashboard */}
      <aside className="md:w-64 lg:w-72 flex-shrink-0">
        <h2 className="text-2xl font-lora font-semibold mb-6">Akun Saya</h2>
        <nav className="flex flex-row md:flex-col gap-2">
          {navLinks.map(link => {
            // Cek kecocokan penuh, bukan 'startsWith'
            const isActive = pathname === link.href; 
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" // Warna Pink jika aktif
                    : "hover:bg-stone-100"
                )}
              >
                <link.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Konten Halaman */}
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
}