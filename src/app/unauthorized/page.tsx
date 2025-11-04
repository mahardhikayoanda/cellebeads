// File: app/unauthorized/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Import Button
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card
import { AlertTriangle } from 'lucide-react'; // Import Ikon

export default function UnauthorizedPage() {
  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto bg-red-100 rounded-full p-3 w-fit"> {/* Lingkaran ikon */}
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-lora font-semibold mt-4">Akses Ditolak</CardTitle>
          <CardDescription>
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/">Kembali ke Halaman Utama</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}