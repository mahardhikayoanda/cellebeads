// File: app/admin/products/edit/[id]/EditProductForm.tsx
'use client'; 

import { useState, useRef, useEffect } from 'react';
import { updateProduct, IModel, IProduct } from '@/app/admin/products/actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, DollarSign, Layers, AlignLeft, Image as ImageIcon, UploadCloud, Loader2, Save, Sparkles, X, ArrowLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface EditProductFormProps {
  product: IProduct;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  
  const [category, setCategory] = useState(product.category); 
  const [priceInput, setPriceInput] = useState(""); 
  const [fileName, setFileName] = useState<string>(""); 

  const [models, setModels] = useState<IModel[]>(product.models || []);
  const [modelName, setModelName] = useState("");
  const [modelPrice, setModelPrice] = useState("");

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  // Init Data
  useEffect(() => {
    if (product.displayPrice) {
        setPriceInput(product.displayPrice);
    } else {
        setPriceInput(formatNumber(product.price));
    }
  }, [product]);

  // --- HANDLER HARGA UTAMA (FIXED: Auto Format Kiri & Kanan) ---
  const handleMainPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    
    if (!val) { setPriceInput(""); return; }

    if (val.includes('-')) {
        const parts = val.split('-');
        
        // Ambil angka mentah
        const leftRaw = parts[0].replace(/[^0-9]/g, '');
        const rightRaw = parts.slice(1).join('').replace(/[^0-9]/g, '');

        const leftFmt = leftRaw ? formatNumber(Number(leftRaw)) : '';
        const rightFmt = rightRaw ? formatNumber(Number(rightRaw)) : '';
        
        if (!rightRaw && val.endsWith(' ')) {
             setPriceInput(`${leftFmt} - `);
        } else if (!rightRaw) {
             setPriceInput(`${leftFmt} -`);
        } else {
             setPriceInput(`${leftFmt} - ${rightFmt}`);
        }
    } else {
        const rawNum = val.replace(/[^0-9]/g, '');
        setPriceInput(rawNum ? formatNumber(Number(rawNum)) : "");
    }
  };

  const handleVariantPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    if (!val) setModelPrice("");
    else setModelPrice(formatNumber(Number(val)));
  };

  const addModel = () => {
    if (modelName.trim() && modelPrice.trim()) {
      const priceNum = Number(modelPrice.replace(/[^0-9]/g, ''));
      setModels([...models, { name: modelName.trim(), price: priceNum }]);
      setModelName("");
      setModelPrice("");
    } else {
        toast.error("Nama varian dan harga harus diisi.");
    }
  };

  const removeModel = (index: number) => {
    setModels(models.filter((_, i) => i !== index));
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const count = e.target.files.length;
      if (count === 1) setFileName(e.target.files[0].name);
      else setFileName(`${count} gambar dipilih`);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      const isRange = priceInput.includes('-');
      let finalPrice = 0;
      let finalDisplayPrice = "";

      if (isRange) {
         finalDisplayPrice = priceInput;
         const cleanFirstNum = priceInput.split('-')[0].replace(/[^0-9]/g, '');
         if(cleanFirstNum) finalPrice = Number(cleanFirstNum);
      } else {
         finalPrice = Number(priceInput.replace(/[^0-9]/g, ''));
      }

      formData.set('price', finalPrice.toString());
      formData.set('displayPrice', finalDisplayPrice);
      
      formData.set('category', category); 
      formData.append('models', JSON.stringify(models));
      
      formData.append('id', product._id);
      if (product.images && product.images.length > 0) {
          formData.append('oldImageUrl', product.images[0]);
      }

      const payload = {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
        price: finalPrice,
        stock: Number(formData.get('stock')),
        category: category,
        images: product.images || [],
        models: models.map(m => JSON.stringify(m))
      };
      
      const result = await updateProduct(product._id, payload, formData);

      if (result.success) {
        toast.success("Produk berhasil diperbarui!");
        router.push('/admin/products');
      } else {
        toast.error("Gagal: " + result.message);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      
      <div className="mb-6">
        <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-pink-600 transition-colors">
            <Link href="/admin/products"><ArrowLeft className="mr-2 h-4 w-4"/> Kembali ke Daftar Produk</Link>
        </Button>
      </div>

      <Card className="glass-panel border-none overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-blue-400 to-teal-500" />
        <CardHeader className="px-8 py-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-100 rounded-2xl text-blue-600 shadow-sm"><Sparkles size={24} /></div>
             <div>
               <CardTitle className="text-2xl font-lora font-bold text-stone-800">Edit Produk</CardTitle>
               <CardDescription className="text-stone-500 mt-1">Perbarui informasi produk <b>{product.name}</b>.</CardDescription>
             </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 pt-0">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5"> 
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><Package size={14} /> Nama Produk</Label>
                <Input name="name" defaultValue={product.name} required className="h-12 bg-stone-50/50 rounded-xl" />
              </div>

              <div className="space-y-2.5">
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><Layers size={14} /> Kategori</Label>
                <Select value={category} onValueChange={setCategory} name="category" required>
                  <SelectTrigger className="h-12 bg-stone-50/50 rounded-xl"><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Gelang">Gelang</SelectItem>
                    <SelectItem value="Kalung">Kalung</SelectItem>
                    <SelectItem value="Cincin">Cincin</SelectItem>
                    <SelectItem value="Keychain">Keychain</SelectItem>
                    <SelectItem value="Strap Handphone">Strap Handphone</SelectItem>
                    <SelectItem value="Jam Manik">Jam Manik</SelectItem>
                    <SelectItem value="Request">Request (Custom)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><AlignLeft size={14} /> Deskripsi</Label>
              <Textarea name="description" defaultValue={product.description} required className="min-h-[120px] bg-stone-50/50 resize-none rounded-xl" />
            </div>

            <div className="space-y-3 bg-stone-50/50 p-5 rounded-xl border border-stone-200">
               <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                  <Layers size={14} /> Varian & Harga (Opsional)
               </Label>
               
               <div className="flex flex-col md:flex-row gap-3">
                  <Input 
                    placeholder="Nama Varian (Contoh: Model A)" 
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="h-10 bg-white flex-grow font-normal"
                  />
                  <Input 
                    placeholder="Harga Varian (Rp)" 
                    value={modelPrice}
                    onChange={handleVariantPriceChange}
                    className="h-10 bg-white md:w-40 font-normal"
                  />
                  <Button type="button" onClick={addModel} size="sm" variant="outline" className="border-pink-200 text-pink-600 hover:bg-pink-50 h-10">
                    <Plus size={16} className="mr-1"/> Tambah
                  </Button>
               </div>

               {models.length > 0 && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                    {models.map((model, idx) => (
                       <div key={idx} className="flex justify-between items-center bg-white border border-pink-100 text-stone-600 px-4 py-2 rounded-lg text-sm shadow-sm">
                          <div className="flex gap-2">
                             <span className="font-bold text-stone-800">{model.name}</span>
                             <span className="text-pink-600">Rp {formatNumber(model.price)}</span>
                          </div>
                          <button type="button" onClick={() => removeModel(idx)} className="text-stone-400 hover:text-red-500"><X size={14} /></button>
                       </div>
                    ))}
                 </div>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><DollarSign size={14} /> Harga / Rentang</Label>
                <Input 
                    name="priceDisplay" 
                    type="text" 
                    placeholder="Contoh: 50.000 atau 50.000 - 100.000" 
                    value={priceInput}
                    onChange={handleMainPriceChange} 
                    required 
                    className="h-12 pl-4 bg-stone-50/50 rounded-xl text-stone-800 font-normal" 
                />
                <p className="text-[10px] text-stone-400 ml-1">
                   Ubah angka untuk harga tetap, atau gunakan tanda minus (-) untuk rentang harga.
                </p>
              </div>

              <div className="space-y-2.5">
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><Package size={14} /> Stok Total</Label>
                <Input name="stock" type="number" defaultValue={product.stock} required className="h-12 bg-stone-50/50 rounded-xl font-normal" />
              </div>
            </div>
            
            <div className="space-y-2.5">
              <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><ImageIcon size={14} /> Foto Produk (Opsional)</Label>
              
              {!fileName && product.images && product.images.length > 0 && (
                  <div className="mb-3 flex items-center gap-4 bg-stone-50 p-3 rounded-xl border border-stone-200">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm border border-stone-100">
                          <Image src={product.images[0]} alt="Current" fill className="object-cover" />
                      </div>
                      <p className="text-sm text-stone-500">Gambar saat ini. Upload baru untuk mengganti.</p>
                  </div>
              )}

              <div className="relative group">
                <div className="border-2 border-dashed border-stone-300 rounded-2xl p-8 bg-stone-50/30 flex flex-col items-center justify-center text-center cursor-pointer group-hover:scale-[1.01]">
                   <div className="p-3 bg-white rounded-full shadow-md mb-3 text-primary"><UploadCloud size={24} /></div>
                   {fileName ? (
                      <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">{fileName}</p>
                   ) : (
                      <><p className="text-sm font-bold text-stone-700">Klik untuk upload gambar baru</p></>
                   )}
                </div>
                <Input name="newImage" type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold bg-stone-900 hover:bg-stone-800 shadow-xl rounded-xl">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan Perubahan...</> : <span className="flex items-center"><Save className="mr-2 h-5 w-5" /> Simpan Perubahan</span>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}