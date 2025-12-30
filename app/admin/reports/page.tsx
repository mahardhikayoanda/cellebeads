'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, FileDown, Calendar, Filter } from 'lucide-react';
import { toast } from 'sonner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Definisikan tipe UserData dari jspdf-autotable
import { UserOptions } from 'jspdf-autotable';

interface jsPDFCustom extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}

interface Order {
  _id: string;
  createdAt: string;
  totalPrice: number;
  status: string;
  shippingDetails: {
    name: string;
  };
}

export default function ReportsPage() {
  const [filterType, setFilterType] = useState('daily'); // daily, weekly, monthly, yearly
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10)); // Format YYYY-MM-DD
  const [reportData, setReportData] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalSales, setTotalSales] = useState(0);

  // Fungsi Helper untuk menghitung Start & End Date berdasarkan Filter
  const getDateRange = () => {
    const date = new Date(selectedDate);
    let startDate = new Date(date);
    let endDate = new Date(date);

    if (filterType === 'daily') {
      // Hari yang sama (00:00 - 23:59 sudah dihandle backend)
      startDate = date;
      endDate = date;
    } else if (filterType === 'weekly') {
      // Ambil hari Senin minggu ini s.d. Minggu
      const day = startDate.getDay(); // 0 (Sun) - 6 (Sat)
      const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
      startDate.setDate(diff);
      
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
    } else if (filterType === 'monthly') {
      // Awal bulan s.d. Akhir bulan
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    } else if (filterType === 'yearly') {
      // Awal tahun s.d. Akhir tahun
      startDate = new Date(date.getFullYear(), 0, 1);
      endDate = new Date(date.getFullYear(), 11, 31);
    }

    return {
      start: startDate.toISOString().slice(0, 10), // YYYY-MM-DD
      end: endDate.toISOString().slice(0, 10)
    };
  };

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { start, end } = getDateRange();
      const res = await fetch(`/api/admin/reports?startDate=${start}&endDate=${end}`);
      const data = await res.json();

      if (data.success) {
        setReportData(data.data);
        // Hitung total penjualan
        const total = data.data.reduce((acc: number, curr: Order) => acc + curr.totalPrice, 0);
        setTotalSales(total);
        if (data.data.length === 0) {
            toast.info("Data Kosong", { description: "Tidak ada transaksi pada periode ini." });
        }
      } else {
        toast.error("Gagal", { description: data.message });
      }
    } catch (error) {
      toast.error("Error", { description: "Gagal mengambil data laporan." });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF
  const generatePDF = () => {
    if (reportData.length === 0) {
      toast.error("Data Kosong", { description: "Tidak ada data untuk diunduh." });
      return;
    }

    const doc = new jsPDF() as any; // Cast to any to avoid type issues for now

    // Header Laporan
    doc.setFontSize(18);
    doc.text('Laporan Penjualan Cellebeads', 14, 20);
    
    doc.setFontSize(11);
    doc.text(`Periode: ${filterType.toUpperCase()}`, 14, 28);
    const { start, end } = getDateRange();
    doc.text(`Tanggal: ${start} s.d ${end}`, 14, 34);
    
    doc.text(`Total Pendapatan: Rp ${totalSales.toLocaleString('id-ID')}`, 14, 42);

    // Tabel Data
    const tableBody = reportData.map((order, index) => [
      index + 1,
      new Date(order.createdAt).toLocaleDateString('id-ID'),
      order._id.slice(-6).toUpperCase(),
      order.shippingDetails.name,
      `Rp ${order.totalPrice.toLocaleString('id-ID')}`,
      order.status
    ]);

    autoTable(doc, {
      startY: 50,
      head: [['No', 'Tanggal', 'Order ID', 'Pelanggan', 'Total', 'Status']],
      body: tableBody,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [219, 39, 119] } 
    });

    doc.save(`Laporan_Penjualan_${start}_${end}.pdf`);
    toast.success("Berhasil", { description: "Laporan PDF telah diunduh." });
  };

  return (
    <div className="bg-white rounded-[2rem] shadow-sm border border-stone-200 p-8 min-h-[85vh]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-lora font-bold text-stone-800">Laporan Penjualan</h1>
                <p className="text-stone-500 mt-1">Unduh rekap transaksi dalam format PDF.</p>
            </div>
            <Button 
                onClick={generatePDF} 
                className="bg-stone-900 hover:bg-stone-800 text-white gap-2"
                disabled={reportData.length === 0}
            >
                <FileDown size={18} /> Download PDF
            </Button>
          </div>

          {/* -- FILTER SECTION -- */}
          <div className="bg-stone-50 p-6 rounded-2xl border border-stone-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
             <div className="space-y-2 w-full md:w-48">
                <label className="text-sm font-bold text-stone-700">Tipe Filter</label>
                <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Pilih Filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Harian</SelectItem>
                        <SelectItem value="weekly">Mingguan</SelectItem>
                        <SelectItem value="monthly">Bulanan</SelectItem>
                        <SelectItem value="yearly">Tahunan</SelectItem>
                    </SelectContent>
                </Select>
             </div>

             <div className="space-y-2 w-full md:w-auto flex-1">
                <label className="text-sm font-bold text-stone-700">Pilih Tanggal Referensi</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                    <Input 
                        type={filterType === 'monthly' ? 'month' : (filterType === 'yearly' ? 'number' : 'date')}
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="pl-10 bg-white"
                        placeholder={filterType === 'yearly' ? "Contoh: 2024" : ""}
                        min={filterType === 'yearly' ? "2000" : undefined}
                        max={filterType === 'yearly' ? "2099" : undefined}
                    />
                </div>
                <p className="text-xs text-stone-400">
                    {filterType === 'weekly' ? "*Memilih tanggal dalam minggu yang diinginkan." : ""}
                </p>
             </div>

             <Button onClick={fetchReports} className="bg-pink-600 hover:bg-pink-700 text-white w-full md:w-auto">
                {isLoading ? <Loader2 className="animate-spin" /> : <><Filter size={16} className="mr-2"/> Tampilkan</>}
             </Button>
          </div>

          {/* -- SUMMARY CARDS -- */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl">
                 <h3 className="text-emerald-800 font-bold mb-1">Total Transaksi</h3>
                 <p className="text-3xl font-lora text-emerald-900">{reportData.length}</p>
             </div>
             <div className="p-6 bg-pink-50 border border-pink-100 rounded-2xl col-span-2">
                 <h3 className="text-pink-800 font-bold mb-1">Total Pendapatan</h3>
                 <p className="text-3xl font-lora text-pink-900">Rp {totalSales.toLocaleString('id-ID')}</p>
             </div>
          </div>

          {/* -- TABLE PREVIEW -- */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-sm uppercase tracking-wider">
                  <th className="p-4 font-semibold">No</th>
                  <th className="p-4 font-semibold">Tanggal</th>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Pelanggan</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="text-stone-700 divide-y divide-stone-100">
                {isLoading ? (
                    <tr>
                        <td colSpan={6} className="p-8 text-center">
                            <Loader2 className="w-8 h-8 animate-spin mx-auto text-pink-500" />
                        </td>
                    </tr>
                ) : reportData.length === 0 ? (
                    <tr>
                        <td colSpan={6} className="p-8 text-center text-stone-400 italic">
                            Belum ada data laporan untuk periode ini.
                        </td>
                    </tr>
                ) : (
                    reportData.map((item, idx) => (
                        <tr key={item._id} className="hover:bg-stone-50 transition-colors">
                            <td className="p-4">{idx + 1}</td>
                            <td className="p-4">{new Date(item.createdAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric'})}</td>
                            <td className="p-4 font-mono text-xs">{item._id.slice(-6).toUpperCase()}</td>
                            <td className="p-4">{item.shippingDetails?.name || 'Guest'}</td>
                            <td className="p-4">
                                <span className="px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold capitalize">
                                    {item.status}
                                </span>
                            </td>
                            <td className="p-4 text-right font-bold">Rp {item.totalPrice.toLocaleString('id-ID')}</td>
                        </tr>
                    ))
                )}
              </tbody>
            </table>
          </div>

    </div>
  );
}; // Added semicolon just in case, though functional component doesn't need it strictly. Removed AdminNavbar import above.

