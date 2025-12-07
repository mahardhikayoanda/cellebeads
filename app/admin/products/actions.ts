// File: app/admin/products/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
}

// Interface untuk hasil pagination
export interface PaginatedResult {
  products: IProduct[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}

// ... (KODE CREATE, DELETE, UPDATE BIARKAN TETAP SAMA SEPERTI SEBELUMNYA) ...
// ... (Hanya tambahkan fungsi baru ini di bawah) ...

// 1. CREATE (Tetap)
export async function createProduct(formData: FormData) {
  // ... (kode createProduct tetap sama)
  await dbConnect();
  
  const imageFiles = formData.getAll('images') as File[];
  if (!imageFiles || imageFiles.length === 0 || imageFiles[0].size === 0) {
    return { success: false, message: 'Minimal satu gambar wajib diisi' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const category = formData.get('category') as string; 

  try {
    const uploadPromises = imageFiles.map(file => 
      put(file.name, file, { access: 'public', addRandomSuffix: true })
    );
    const blobs = await Promise.all(uploadPromises);
    const imageUrls = blobs.map(blob => blob.url);

    const newProduct = new Product({
      name, description, price, stock, category,
      images: imageUrls, 
    });
    
    await newProduct.save();
    
    revalidatePath('/admin/products'); 
    revalidatePath('/products'); 
    
    return { success: true, message: 'Produk berhasil ditambahkan' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menambahkan produk' };
  }
}

// 2. READ ALL (Untuk Admin / Home - Tetap)
export async function getProducts(categoryFilter?: string): Promise<IProduct[]> {
  await dbConnect();
  try {
    const query = categoryFilter && categoryFilter !== 'Semua' ? { category: categoryFilter } : {};
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(products)).map((p: any) => ({
      ...p,
      images: p.images || (p.image ? [p.image] : []) 
    }));
  } catch (error) {
    return []; 
  }
}

// --- FUNGSI BARU: READ PAGINATED (Untuk Halaman Katalog) ---
export async function getPaginatedProducts(
  category: string = 'Semua', 
  page: number = 1, 
  limit: number = 12
): Promise<PaginatedResult> {
  await dbConnect();
  try {
    const query = category !== 'Semua' ? { category } : {};
    const skip = (page - 1) * limit;

    // Jalankan query produk dan hitung total secara paralel (lebih cepat)
    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query)
    ]);

    const formattedProducts = JSON.parse(JSON.stringify(products)).map((p: any) => ({
      ...p,
      images: p.images || (p.image ? [p.image] : [])
    }));

    return {
      products: formattedProducts,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      totalProducts: totalCount
    };
  } catch (error) {
    console.error("Pagination error:", error);
    return { products: [], totalPages: 0, currentPage: 1, totalProducts: 0 };
  }
}
// -----------------------------------------------------------

export async function getProductById(productId: string): Promise<IProduct | null> {
  await dbConnect();
  try {
    const product = await Product.findById(productId);
    if (!product) return null;
    const p = JSON.parse(JSON.stringify(product));
    p.images = p.images || (p.image ? [p.image] : []);
    return p;
  } catch (error) { return null; }
}

// 3. DELETE (Tetap)
export async function deleteProduct(productId: string) {
  // ... (kode deleteProduct tetap sama)
  await dbConnect();
  try {
    const product = await Product.findById(productId);
    if (!product) return { success: false, message: 'Produk tidak ditemukan' };

    const imagesToDelete = product.images || (product.image ? [product.image] : []);
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map((url: string) => del(url).catch(e => console.error(e))));
    }

    await Product.findByIdAndDelete(productId);
    
    revalidatePath('/admin/products');
    revalidatePath('/products'); 
    return { success: true, message: 'Produk berhasil dihapus' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 4. UPDATE (Tetap)
export async function updateProduct(formData: FormData) {
  // ... (kode updateProduct tetap sama)
  await dbConnect();

  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    
    const newImageFile = formData.get('newImage') as File; 
    const oldImageUrl = formData.get('oldImageUrl') as string;

    let finalImages: string[] = [oldImageUrl]; 

    if (newImageFile && newImageFile.size > 0) {
        const blob = await put(newImageFile.name, newImageFile, { 
            access: 'public', 
            addRandomSuffix: true 
        });
        finalImages = [blob.url];

        if (oldImageUrl && !oldImageUrl.includes('placeholder')) {
           try { await del(oldImageUrl); } catch (err) { console.log(err); }
        }
    }

    await Product.findByIdAndUpdate(id, {
      name, description, price, stock, images: finalImages, 
    });

    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath(`/products/${id}`);

    return { success: true, message: 'Produk berhasil diperbarui!' };

  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal mengupdate produk' };
  }
}