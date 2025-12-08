// File: app/admin/products/ProductForm.tsx
'use client'; 

import { useState, useRef } from 'react';
import { createProduct, IModel } from './actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, DollarSign, Layers, AlignLeft, Image as ImageIcon, UploadCloud, Loader2, Plus, Sparkles, X, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [category, setCategory] = useState(""); 
  const [displayPrice, setDisplayPrice] = useState(""); 
  const [rangePriceDisplay, setRangePriceDisplay] = useState(""); 
  const [fileName, setFileName] = useState<string>(""); 

  // --- STATE MODELS ---
  const [models, setModels] = useState<IModel[]>([]);
  const [modelName, setModelName] = useState("");
  const [modelPrice, setModelPrice] = useState("");

  const addModel = () => {
    if (modelName.trim() && modelPrice.trim()) {
      const priceNum = Number(modelPrice.replace(/[^0-9]/g, ''));
      setModels([...models, { name: modelName.trim(), price: priceNum }]);
      setModelName("");
      setModelPrice("");
    }
  };

  const removeModel = (index: number) => {
    setModels(models.filter((_, i) => i !== index));
  };
  
  const formatRupiah = (value: string) => {
    const numberString = value.replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('id-ID', {
      style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0,
    }).format(Number(numberString));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const val = e.target.value;
    if(!val) { setter(""); return; }
    setter(formatRupiah(val));
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
    if (!category) {
        toast.error("Mohon pilih kategori produk.");
        return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const rawPrice = displayPrice.replace(/[^0-9]/g, '');
      formData.set('price', rawPrice); 
      formData.set('category', category); 
      
      formData.append('models', JSON.stringify(models));
      formData.append('displayPrice', rangePriceDisplay); 

      const result = await createProduct(formData);

      if (result.success) {
        toast.success("Produk berhasil ditambahkan!");
        formRef.current?.reset();
        setCategory(""); 
        setDisplayPrice(""); 
        setRangePriceDisplay("");
        setFileName("");
        setModels([]); 
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
      <Card className="glass-panel border-none overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-pink-400 to-purple-500" />
        <CardHeader className="px-8 py-6">
          <div className="flex items-center gap-3">
             <div className="p-3 bg-pink-100 rounded-2xl text-primary shadow-sm"><Sparkles size={24} /></div>
             <div>
               <CardTitle className="text-2xl font-lora font-bold text-stone-800">Tambah Koleksi Baru</CardTitle>
               <CardDescription className="text-stone-500 mt-1">Isi detail di bawah untuk menambahkan item cantik ke katalog.</CardDescription>
             </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-8 pt-0">
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5"> 
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><Package size={14} /> Nama Produk</Label>
                <Input name="name" placeholder="Contoh: Gelang Mutiara..." required className="h-12 bg-stone-50/50 rounded-xl" />
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
              <Textarea name="description" placeholder="Jelaskan detail produk..." required className="min-h-[120px] bg-stone-50/50 rounded-xl" />
            </div>

            {/* --- INPUT VARIAN MODEL --- */}
            <div className="space-y-3 bg-stone-50/50 p-5 rounded-xl border border-stone-200">
               <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                  <Layers size={14} /> Varian & Harga (Opsional)
               </Label>
               
               <div className="flex flex-col md:flex-row gap-3">
                  <Input 
                    placeholder="Nama Varian (Contoh: Model A)" 
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="h-10 bg-white flex-grow"
                  />
                  <Input 
                    placeholder="Harga Varian (Rp)" 
                    value={modelPrice}
                    onChange={(e) => handlePriceChange(e, setModelPrice)}
                    className="h-10 bg-white md:w-40"
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
                             <span className="text-pink-600">Rp {model.price.toLocaleString('id-ID')}</span>
                          </div>
                          <button type="button" onClick={() => removeModel(idx)} className="text-stone-400 hover:text-red-500"><X size={14} /></button>
                       </div>
                    ))}
                 </div>
               )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><DollarSign size={14} /> Harga Dasar</Label>
                <Input name="price" type="text" placeholder="Rp 0" value={displayPrice} onChange={(e) => handlePriceChange(e, setDisplayPrice)} required className="h-12 bg-stone-50/50 rounded-xl" />
              </div>
              <div className="space-y-2.5">
                <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><Package size={14} /> Stok Total</Label>
                <Input name="stock" type="number" placeholder="0" required className="h-12 bg-stone-50/50 rounded-xl" />
              </div>
            </div>

            {/* --- INPUT RENTANG HARGA (KHUSUS REQUEST) --- */}
            {category === 'Request' && (
                <div className="space-y-2.5 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><Tag size={14} /> Teks Rentang Harga (Opsional)</Label>
                    <Input 
                        name="rangeDisplay" 
                        placeholder="Contoh: Rp 50.000 - Rp 100.000" 
                        value={rangePriceDisplay}
                        onChange={(e) => setRangePriceDisplay(e.target.value)}
                        className="h-12 bg-stone-50/50 rounded-xl" 
                    />
                </div>
            )}
            
            {/* Upload Gambar (Sama seperti sebelumnya) */}
            <div className="space-y-2.5">
              <Label className="text-stone-600 font-bold text-xs uppercase tracking-wide flex items-center gap-2"><ImageIcon size={14} /> Foto Produk</Label>
              <div className="relative group">
                <div className="border-2 border-dashed border-stone-300 rounded-2xl p-10 bg-stone-50/30 flex flex-col items-center justify-center text-center cursor-pointer group-hover:scale-[1.01]">
                   <div className="p-4 bg-white rounded-full shadow-md mb-4 text-primary"><UploadCloud size={28} /></div>
                   {fileName ? (
                      <p className="text-sm font-bold text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">{fileName}</p>
                   ) : (
                      <><p className="text-base font-bold text-stone-700">Klik untuk upload gambar</p></>
                   )}
                </div>
                <Input name="images" type="file" accept="image/*" multiple required onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={isLoading} className="w-full h-14 text-base font-bold bg-stone-800 hover:bg-stone-900 shadow-xl rounded-xl">
                {isLoading ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...</> : <span className="flex items-center"><Plus className="mr-2 h-5 w-5" /> Simpan ke Katalog</span>}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}