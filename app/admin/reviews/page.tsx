// File: app/admin/reviews/page.tsx
import { getReviews, IReviewPopulated } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from 'next/image';
import { Star } from 'lucide-react'; // Ikon bintang

export default async function AdminReviewsPage() {
  const reviews: IReviewPopulated[] = await getReviews();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-lora font-semibold">Kelola Ulasan Pelanggan</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Daftar Ulasan Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produk</TableHead>
                <TableHead>Pelanggan</TableHead>
                <TableHead className="text-center">Rating</TableHead>
                <TableHead>Komentar</TableHead>
                <TableHead>Foto Ulasan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.map((review) => (
                <TableRow key={review._id}>
                  <TableCell className="font-medium">
                    {review.product?.name || 'Produk Dihapus'}
                  </TableCell>
                  <TableCell>{review.user?.name || 'User Dihapus'}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="flex items-center justify-center gap-1 w-12">
                      {review.rating} <Star className="w-3 h-3 text-yellow-500 fill-yellow-500"/>
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-sm text-muted-foreground">{review.comment}</TableCell>
                  <TableCell>
                    {review.image ? (
                      <a href={review.image} target="_blank" rel="noopener noreferrer">
                        <Image 
                          src={review.image} 
                          alt="Foto Ulasan" 
                          width={60} 
                          height={60}
                          className="object-cover rounded-md border aspect-square hover:scale-105 transition-transform"
                        />
                      </a>
                    ) : (
                      <span>-</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {reviews.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
                    Belum ada ulasan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}