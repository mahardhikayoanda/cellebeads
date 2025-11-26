'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from 'lucide-react';

// Data Dummy untuk Demo (Idealnya dari Database history)
const data = [
  { name: 'Sen', total: 400000 },
  { name: 'Sel', total: 300000 },
  { name: 'Rab', total: 550000 },
  { name: 'Kam', total: 450000 },
  { name: 'Jum', total: 700000 },
  { name: 'Sab', total: 900000 },
  { name: 'Min', total: 850000 },
];

export default function DashboardCharts() {
  return (
    <Card className="glass-panel border-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-stone-800">
          <div className="p-2 bg-green-100 text-green-600 rounded-lg">
            <TrendingUp size={18} />
          </div>
          Tren Pendapatan (Minggu Ini)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a8a29e', fontSize: 12}} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#a8a29e', fontSize: 12}} 
                tickFormatter={(value) => `Rp${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Pendapatan']}
              />
              <Area 
                type="monotone" 
                dataKey="total" 
                stroke="#ec4899" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTotal)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}