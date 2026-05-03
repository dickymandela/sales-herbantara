import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, Cell, PieChart, Pie, Legend, AreaChart, Area
} from 'recharts';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Settings,
  Search,
  Filter,
  Download,
  AlertCircle,
  Package,
  Truck,
  MessageCircle,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { format, parseISO, isSameDay, startOfMonth, subDays } from 'date-fns';
import { useSalesData, SalesData } from './hooks/useSalesData';

// --- Constants ---

const MONTHS = [
  'All', 'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December'
];

const COMMISSION_RANGES = [
  { label: 'All', min: 0, max: Infinity },
  { label: 'Low (< 10k)', min: 0, max: 10000 },
  { label: 'Medium (10k - 50k)', min: 10001, max: 50000 },
  { label: 'High (> 50k)', min: 50001, max: Infinity }
];

// --- Components ---

const StatCard = ({ title, value, trend, index, icon: Icon, color = 'indigo', darkMode }: any) => {
  const variants: Record<string, string> = {
    indigo: darkMode ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-indigo-50/50 border-indigo-100 text-indigo-600',
    emerald: darkMode ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-emerald-50/50 border-emerald-100 text-emerald-600',
    violet: darkMode ? 'bg-violet-500/10 border-violet-500/20 text-violet-400' : 'bg-violet-50/50 border-violet-100 text-violet-600',
    amber: darkMode ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50/50 border-amber-100 text-amber-600',
    rose: darkMode ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50/50 border-rose-100 text-rose-600',
  };

  const glowVariants: Record<string, string> = {
    indigo: darkMode ? 'shadow-indigo-900/10' : 'shadow-indigo-100/50',
    emerald: darkMode ? 'shadow-emerald-900/10' : 'shadow-emerald-100/50',
    violet: darkMode ? 'shadow-violet-900/10' : 'shadow-violet-100/50',
    amber: darkMode ? 'shadow-amber-900/10' : 'shadow-amber-100/50',
    rose: darkMode ? 'shadow-rose-900/10' : 'shadow-rose-100/50',
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', stiffness: 100 }}
      className={`relative overflow-hidden p-6 rounded-[2rem] shadow-xl ${glowVariants[color]} border flex flex-col justify-between h-full hover:shadow-2xl hover:-translate-y-1 transition-all duration-500 group ${darkMode ? 'bg-slate-900/80 border-white/5' : 'bg-white/80 border-white/60'} backdrop-blur-xl`}
    >
      {/* Decorative Background Shape */}
      <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-[0.06] dark:group-hover:opacity-[0.1] transition-opacity blur-2xl ${variants[color].split(' ')[0]}`}></div>
      
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${variants[color]} shadow-sm`}>
          <Icon size={20} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg border ${trend > 0 ? 'bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400' : 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400'}`}>
            {trend > 0 ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 font-black mb-1">{title}</div>
        <div className="text-2xl font-black text-slate-900 dark:text-white tracking-tight truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase">{value}</div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-slate-50 dark:border-white/5 flex items-center justify-between">
         <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Growth metrics</span>
         <div className="flex -space-x-1.5 font-mono text-[9px] font-bold text-slate-300 dark:text-slate-700">
            <span>●</span>
            <span>●</span>
            <span>●</span>
         </div>
      </div>
    </motion.div>
  );
};

const ChartCard = ({ title, children, subtitle, index, icon: Icon, darkMode }: any) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.98 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.4 + (index * 0.1) }}
    className={`p-8 rounded-[2.5rem] shadow-2xl border flex flex-col transition-all duration-500 group w-full h-full ${darkMode ? 'bg-slate-900/80 shadow-black/20 border-white/5 hover:shadow-indigo-900/20' : 'bg-white/80 shadow-slate-200/50 border-white hover:shadow-indigo-100/40'} backdrop-blur-2xl`}
  >
    <div className="mb-8 flex justify-between items-center shrink-0">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-xl group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-500 transition-colors">
            <Icon size={18} />
          </div>
        )}
        <div>
          <h3 className="text-base font-black text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
          {subtitle && <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 mt-0.5 uppercase tracking-wider">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 p-1.5 rounded-xl border border-slate-100 dark:border-white/5">
        <button className="px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">D</button>
        <button className="px-3 py-1 text-[10px] font-bold bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 rounded-lg shadow-sm border border-indigo-50 dark:border-white/10">W</button>
        <button className="px-3 py-1 text-[10px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">M</button>
      </div>
    </div>
    <div className="flex-1 w-full relative min-h-[350px] min-w-0">
      <div className="absolute inset-0">
        {children}
      </div>
    </div>
  </motion.div>
);

const formatIDR = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

export default function App() {
  const { data, loading, error, gasUrl, setGasUrl, isMock } = useSalesData();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [selectedMonth, setSelectedMonth] = useState('All');
  const [selectedCommission, setSelectedCommission] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(gasUrl);
  const [darkMode, setDarkMode] = useState(false);

  // --- Theme Effect ---
  React.useEffect(() => {
    const root = window.document.documentElement;
    const body = window.document.body;
    if (darkMode) {
      root.classList.add('dark');
      body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      body.classList.remove('dark');
    }
  }, [darkMode]);

  // --- Data Calculations ---

  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.produk.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProduct = selectedProduct === 'All' || item.produk === selectedProduct;
      const matchesMethod = selectedMethod === 'All' || item.metode === selectedMethod;

      // Month Filter
      const itemDate = item.tanggal instanceof Date ? item.tanggal : parseISO(item.tanggal as string);
      const itemMonth = format(itemDate, 'MMMM');
      const matchesMonth = selectedMonth === 'All' || itemMonth === selectedMonth;

      // Commission Filter
      let matchesCommission = true;
      if (selectedCommission !== 'All') {
        const range = COMMISSION_RANGES.find(r => r.label === selectedCommission);
        if (range) {
          matchesCommission = item.komisi >= range.min && item.komisi <= range.max;
        }
      }

      return matchesSearch && matchesProduct && matchesMethod && matchesMonth && matchesCommission;
    }).sort((a, b) => {
      const dateA = a.tanggal instanceof Date ? a.tanggal.getTime() : parseISO(a.tanggal as string).getTime();
      const dateB = b.tanggal instanceof Date ? b.tanggal.getTime() : parseISO(b.tanggal as string).getTime();
      return dateB - dateA;
    });
  }, [data, searchTerm, selectedProduct, selectedMethod, selectedMonth, selectedCommission]);

  const totalRevenue = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.total_bayar, 0), [filteredData]);
  const totalOrders = filteredData.length;
  const totalUnits = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.qty, 0), [filteredData]);
  const totalKomisi = useMemo(() => filteredData.reduce((acc, curr) => acc + curr.komisi, 0), [filteredData]);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const productStats = useMemo(() => {
    const stats: Record<string, { name: string, qty: number, revenue: number }> = {};
    filteredData.forEach(item => {
      if (!stats[item.produk]) {
        stats[item.produk] = { name: item.produk, qty: 0, revenue: 0 };
      }
      stats[item.produk].qty += item.qty;
      stats[item.produk].revenue += item.total_bayar;
    });
    return Object.values(stats).sort((a, b) => b.revenue - a.revenue);
  }, [filteredData]);

  const customerStats = useMemo(() => {
    const stats: Record<string, { revenue: number, orders: number, products: Set<string> }> = {};
    filteredData.forEach(item => {
      if (!stats[item.nama]) {
        stats[item.nama] = { revenue: 0, orders: 0, products: new Set() };
      }
      stats[item.nama].revenue += item.total_bayar;
      stats[item.nama].orders += 1;
      stats[item.nama].products.add(item.produk);
    });
    return Object.entries(stats)
      .map(([name, stat]) => ({ 
        name, 
        revenue: stat.revenue, 
        orders: stat.orders, 
        uniqueProducts: stat.products.size 
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredData]);

  const salesByDate = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredData.forEach(item => {
      const dateStr = item.tanggal instanceof Date ? format(item.tanggal, 'MMM d') : format(parseISO(item.tanggal as string), 'MMM d');
      stats[dateStr] = (stats[dateStr] || 0) + item.total_bayar;
    });
    return Object.entries(stats).map(([name, total]) => ({ name, total }));
  }, [filteredData]);

  const COLORS = ['#6366f1', '#3b82f6', '#8b5cf6', '#a855f7'];

  const uniqueProducts = useMemo(() => {
    const products = Array.from(new Set(data.map(item => item.produk))).sort();
    return ['All', ...products];
  }, [data]);

  const uniqueMethods = useMemo(() => {
    const methods = Array.from(new Set(data.map(item => item.metode))).sort();
    return ['All', ...methods];
  }, [data]);

  const handleUpdateUrl = () => {
    setGasUrl(inputUrl);
    setIsSettingsOpen(false);
  };

  const handleExport = () => {
    if (filteredData.length === 0) return;
    
    // Prepare data for export
    const exportData = filteredData.map(item => ({
      ID: item.order_id,
      Tanggal: item.tanggal instanceof Date ? format(item.tanggal, 'yyyy-MM-dd') : item.tanggal,
      Nama: item.nama,
      WhatsApp: item.no_wa,
      Produk: item.produk,
      Qty: item.qty,
      Total_Bayar: item.total_bayar,
      Komisi: item.komisi,
      Metode: item.metode
    }));

    const headers = Object.keys(exportData[0]);
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(h => `"${String(row[h as keyof typeof row]).replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `herbantara_export_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`h-screen overflow-hidden flex relative transition-colors duration-500 ${darkMode ? 'dark bg-slate-950 text-slate-400' : 'bg-slate-50 text-slate-600'} selection:bg-indigo-100 dark:selection:bg-indigo-900/30 selection:text-indigo-900 dark:selection:text-indigo-200`}>
      {/* Background Mesh Gradient */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className={`absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 dark:bg-indigo-900/20 blur-[120px] transition-colors duration-700`}></div>
        <div className={`absolute top-[20%] -right-[10%] w-[35%] h-[35%] rounded-full bg-purple-200/20 dark:bg-purple-900/10 blur-[120px] transition-colors duration-700`}></div>
        <div className={`absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-emerald-200/20 dark:bg-emerald-900/10 blur-[120px] transition-colors duration-700`}></div>
      </div>

      {/* Sidebar - Optimized for Tablet (Icons Only) & Desktop (Full) */}
      <aside className={`w-20 lg:w-72 border-r ${darkMode ? 'border-white/5 bg-slate-900/70' : 'border-slate-200/60 bg-white/70'} backdrop-blur-3xl flex flex-col items-center lg:items-start py-10 shrink-0 hidden md:flex z-40 transition-all duration-500 ease-in-out shadow-[1px_0_10px_rgba(0,0,0,0.02)]`}>
        <div className="px-0 lg:px-8 mb-16 flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-200 dark:shadow-indigo-950 shrink-0 transition-transform hover:rotate-6">
            <LayoutDashboard className="text-white" size={24} />
          </div>
          <div className="hidden lg:block overflow-hidden">
            <span className="font-black text-slate-900 dark:text-white text-2xl tracking-tighter block uppercase">Herbantara</span>
            <div className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] -mt-1">Natura Analytics</div>
          </div>
        </div>
        
        <nav className="flex-1 w-full px-3 lg:px-5 space-y-3">
            {[
              { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
              { id: 'orders', icon: ShoppingBag, label: 'Orders' },
              { id: 'customers', icon: Users, label: 'Customers' },
              { id: 'analytics', icon: TrendingUp, label: 'Analytics' },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`w-full flex items-center justify-center lg:justify-start gap-4 px-3 lg:px-5 py-4 rounded-2xl text-[13px] font-black tracking-tight transition-all duration-300 group relative ${
                  activeTab === item.id 
                  ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-200 dark:shadow-indigo-900/40 ring-4 ring-indigo-50 dark:ring-indigo-500/10' 
                  : 'text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20'
                }`}
              >
              <item.icon size={20} className={`transition-transform duration-300 shrink-0 group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
              <span className="hidden lg:block truncate">{item.label}</span>
              {activeTab === item.id && (
                <motion.div layoutId="nav-pill" className="ml-auto hidden lg:block w-1.5 h-1.5 rounded-full bg-white opacity-90 shadow-[0_0_8px_white]" />
              )}
            </button>
          ))}
        </nav>

        <div className="px-3 lg:px-5 w-full mt-auto space-y-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="w-full flex items-center justify-center lg:justify-start gap-4 px-3 lg:px-5 py-4 rounded-2xl text-[13px] font-black text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all group shadow-transparent hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20"
          >
            {darkMode ? (
              <>
                <Sun size={20} className="text-amber-400 transition-all group-hover:rotate-90" />
                <span className="hidden lg:block">Day View</span>
              </>
            ) : (
              <>
                <Moon size={20} className="text-indigo-400 transition-all group-hover:-rotate-12" />
                <span className="hidden lg:block">Night Vision</span>
              </>
            )}
          </button>

          <div className="bg-slate-900/5 dark:bg-white/5 p-5 rounded-[2rem] hidden lg:block border border-white/50 dark:border-white/5 backdrop-blur-md">
             <div className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                Engine Status
             </div>
             <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black text-slate-700 dark:text-slate-300">Healthy</span>
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md">99.9%</span>
             </div>
             <button onClick={() => window.location.reload()} className="w-full py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-100 dark:border-white/5 hover:bg-indigo-600 hover:text-white transition-all shadow-sm hover:shadow-indigo-100 dark:hover:shadow-indigo-900/30">Hot Reload</button>
          </div>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-full flex items-center justify-center lg:justify-start gap-4 px-3 lg:px-5 py-4 rounded-2xl text-[13px] font-black text-slate-400 hover:bg-white dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all group shadow-transparent hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-black/20"
          >
            <Settings size={20} className="text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:rotate-45 transition-all" />
            <span className="hidden lg:block">Architecture</span>
          </button>
        </div>
      </aside>

      {/* Mobile Navigation - Only visible on small screens */}
      <nav className="md:hidden fixed bottom-6 left-6 right-6 z-50">
        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl rounded-3xl border border-white/60 dark:border-white/5 p-2.5 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.1)] ring-1 ring-black/5">
          {[
            { id: 'overview', icon: LayoutDashboard },
            { id: 'orders', icon: ShoppingBag },
            { id: 'customers', icon: Users },
            { id: 'analytics', icon: TrendingUp },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`p-4 rounded-2xl transition-all duration-300 relative ${
                activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/40 scale-110 -translate-y-2' 
                : 'text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400'
              }`}
            >
              <item.icon size={20} />
              {activeTab === item.id && (
                <motion.div layoutId="mobile-dot" className="absolute -bottom-1 left-1/2 -translateX-1/2 w-1 h-1 bg-white rounded-full" />
              )}
            </button>
          ))}
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-4 rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-indigo-400" />}
          </button>
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-4 rounded-2xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all"
          >
            <Settings size={20} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col relative z-10 pb-28 md:pb-0">
        {/* Connection status overlay for mobile if needed, but here we stay clean */}
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight capitalize">{activeTab}</h1>
            <div className="flex items-center gap-2 mt-1">
              {isMock ? (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-200 dark:hover:bg-amber-500/20 transition-colors shadow-sm"
                >
                  <Clock size={12} /> Using Mock Data (Click to Connect)
                </button>
              ) : (
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 transition-colors shadow-sm"
                >
                  <RefreshCw size={12} className="animate-spin-slow" /> Connected to Sheets
                </button>
              )}
            </div>
          </div>
          
          <div className="flex flex-col md:items-end gap-3">
             <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-100 dark:border-white/5 shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Live Sync</span>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">Updated</div>
                  <div className="text-xs font-mono text-slate-900 dark:text-slate-200 font-medium">{format(new Date(), 'HH:mm:ss')}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                  <input 
                    type="text" 
                    placeholder="Search transactions..." 
                    className="pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 w-full md:w-64 transition-all text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-xl text-xs font-bold transition-all shadow-sm ${
                    showFilters 
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 text-slate-500 hover:border-indigo-200 dark:hover:border-indigo-500/30'
                  }`}
                >
                  <Filter size={14} />
                  Filters
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  className="p-2 border border-slate-200 dark:border-white/10 rounded-xl bg-white dark:bg-slate-900 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all shadow-sm"
                >
                  <RefreshCw size={14} />
                </button>
                <button 
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-950"
                >
                  <Download size={14} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
          </div>
        </header>

        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 dark:border-white/5 p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 shadow-2xl shadow-slate-200/40 dark:shadow-black/20">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Product Category</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      {uniqueProducts.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Payment Method</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
                      value={selectedMethod}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                    >
                      {uniqueMethods.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Monthly Period</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] px-1">Commission Tier</label>
                  <div className="relative">
                    <select 
                      className="w-full appearance-none px-5 py-3.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 rounded-2xl text-[13px] font-black tracking-tight focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-700 dark:text-slate-200 cursor-pointer shadow-sm"
                      value={selectedCommission}
                      onChange={(e) => setSelectedCommission(e.target.value)}
                    >
                      {COMMISSION_RANGES.map(r => <option key={r.label} value={r.label}>{r.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                <div className="flex items-end">
                   <button 
                    onClick={() => { setSelectedProduct('All'); setSelectedMethod('All'); setSelectedMonth('All'); setSelectedCommission('All'); setSearchTerm(''); }}
                    className="w-full px-5 py-3.5 bg-slate-900 dark:bg-indigo-600 text-white rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200 dark:shadow-indigo-900/30 hover:bg-slate-800 dark:hover:bg-indigo-700"
                   >
                     <RefreshCw size={14} /> Reset Filters
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <div className="mb-10 p-5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-4 text-rose-700 shadow-sm">
            <AlertCircle className="shrink-0 mt-0.5 text-rose-500" size={20} />
            <div className="flex-1 text-sm">
              <p className="font-bold">Sync Error</p>
              <p className="opacity-80 mt-0.5">{error}</p>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="mt-3 text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center gap-2 transition-colors"
              >
                Configure Connection <ExternalLink size={12} />
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid - Visible on all analytics tabs but tailored to overview */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              <StatCard title="Total Revenue" value={formatIDR(totalRevenue)} trend={12.4} index={0} color="indigo" icon={DollarSign} darkMode={darkMode} />
              <StatCard title="Total Orders" value={totalOrders} trend={8.1} index={1} color="emerald" icon={ShoppingBag} darkMode={darkMode} />
              <StatCard title="Total Komisi" value={formatIDR(totalKomisi)} trend={15.2} index={2} color="violet" icon={TrendingUp} darkMode={darkMode} />
              <StatCard title="Items Sold" value={totalUnits} trend={-2.4} index={3} color="amber" icon={Package} darkMode={darkMode} />
              <StatCard title="Avg Order Value" value={formatIDR(avgOrderValue)} trend={15.0} index={4} color="rose" icon={Truck} darkMode={darkMode} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              <div className="xl:col-span-2">
                <ChartCard title="Revenue Growth" subtitle="Daily settlement performance" index={0} icon={TrendingUp} darkMode={darkMode}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salesByDate}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#ffffff' : '#94a3b8', fontSize: 10, fontWeight: 700 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#ffffff' : '#94a3b8', fontSize: 10, fontWeight: 700 }} tickFormatter={(val) => `${val/1000}k`} />
                    <RechartsTooltip 
                      contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#ffffff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)', padding: '20px' }} 
                      itemStyle={{ fontWeight: 800, fontSize: '13px', color: darkMode ? '#ffffff' : '#475569' }}
                      formatter={(val: number) => [formatIDR(val), 'Revenue']} 
                    />
                      <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <ChartCard title="Product Distribution" subtitle="Inventory share by units" index={1} icon={Package} darkMode={darkMode}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={productStats} cx="50%" cy="50%" innerRadius={80} outerRadius={100} paddingAngle={10} dataKey="qty" stroke="none" cornerRadius={12}>
                      {productStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} />
                    <Legend verticalAlign="bottom" iconType="circle" iconSize={8} formatter={(value) => <span className="text-slate-500 font-black text-[10px] uppercase tracking-widest ml-1">{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className={`rounded-[2.5rem] shadow-2xl border overflow-hidden mb-12 transition-all ${darkMode ? 'bg-slate-900/80 shadow-black/20 border-white/5' : 'bg-white/80 shadow-slate-200/50 border-white'} backdrop-blur-2xl`}>
              <div className={`p-8 border-b flex items-center justify-between ${darkMode ? 'border-white/5 bg-slate-900/40' : 'border-slate-50 bg-white/40'}`}>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Real-time Transaction Ledger</h3>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Live feed from cloud synchronization</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-100 dark:border-white/5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none mt-0.5">Stream Active</span>
                  </div>
                  <button 
                    onClick={handleExport}
                    className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase tracking-widest transition-all"
                  >
                    Bulk Export
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left order-separate border-spacing-0">
                  <thead className="bg-slate-50/30 dark:bg-slate-800/30">
                    <tr>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">Log ID</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">Timestamp</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">Origin / Client</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5">SKU / Product</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 text-right">Vol.</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 text-right">Gross Amount</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 text-right">Fee</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5 text-center">Protocol</th>
                      <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-50 dark:border-white/5"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    <AnimatePresence>
                      {filteredData.map((row) => (
                        <motion.tr 
                          key={row.order_id} 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }} 
                          exit={{ opacity: 0 }} 
                          whileHover={{ x: 4 }}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all group cursor-default relative"
                        >
                          <td className="px-8 py-6 text-xs font-black text-slate-400 dark:text-slate-300 font-mono tracking-tighter group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors uppercase relative">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                            {row.order_id}
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-500 dark:text-slate-200">{row.tanggal instanceof Date ? format(row.tanggal, 'MMM dd, yyyy') : format(parseISO(row.tanggal as string), 'MMM dd, yyyy')}</td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800 dark:text-slate-100 tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{row.nama}</span>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest mt-1 opacity-60">{row.no_wa}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6"><span className="text-sm text-slate-600 dark:text-slate-300 font-black tracking-tight">{row.produk}</span></td>
                          <td className="px-8 py-6 text-xs font-black text-slate-500 dark:text-white text-right font-mono">{row.qty}</td>
                          <td className="px-8 py-6 text-sm font-black text-slate-900 dark:text-white text-right tracking-tight">{formatIDR(row.total_bayar)}</td>
                          <td className="px-8 py-6 text-sm font-black text-emerald-600 dark:text-white text-right tracking-tight">{formatIDR(row.komisi)}</td>
                          <td className="px-8 py-6 text-center">
                            <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border shadow-sm ${row.metode === 'COD' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20' : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20'}`}>
                              {row.metode}
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right opacity-0 group-hover:opacity-100 transition-all transform translate-x-1 group-hover:translate-x-0">
                            <button className="text-slate-400 hover:text-white hover:bg-indigo-600 transition-all p-2 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-black/20">
                               <ExternalLink size={16} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                      {filteredData.length === 0 && (
                        <tr><td colSpan={9} className="px-8 py-20 text-center text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em] italic opacity-40">Zero records found in local cache</td></tr>
                      )}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <ChartCard title="Product Volume" subtitle="Units sold by category" icon={Package} darkMode={darkMode}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={productStats}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#ffffff' : '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#ffffff' : '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <RechartsTooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#ffffff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} itemStyle={{ color: darkMode ? '#e2e8f0' : '#475569' }} />
                    <Bar dataKey="qty" fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <div className={`p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-500 ${darkMode ? 'bg-slate-900/80 shadow-black/20 border-white/5' : 'bg-white/80 shadow-slate-200/50 border-white'} backdrop-blur-2xl`}>
                <div className="flex items-center gap-4 mb-8">
                   <div className="p-3 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl">
                      <Search size={22} />
                   </div>
                   <div>
                     <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Inventory Intelligence</h3>
                     <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Real-time stock analytics</p>
                   </div>
                </div>
                <div className="space-y-8">
                  {productStats.map((item, i) => (
                    <div key={i} className="flex flex-col gap-2">
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-3">
                           <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                           <span className="text-sm font-black text-slate-700 dark:text-slate-200">{item.name}</span>
                         </div>
                         <span className="text-xs font-black text-slate-400 dark:text-white uppercase tracking-wider">{item.qty} units</span>
                       </div>
                       <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(item.qty / totalUnits) * 100}%` }}
                          transition={{ duration: 1, delay: i * 0.1 }}
                          className="h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]" 
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                         ></motion.div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'customers' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
               <div className={`xl:col-span-2 rounded-[2.5rem] shadow-2xl border overflow-hidden transition-all duration-500 ${darkMode ? 'bg-slate-900/80 shadow-black/20 border-white/5' : 'bg-white/80 shadow-slate-200/50 border-white'} backdrop-blur-2xl`}>
                  <div className={`p-8 border-b flex items-center justify-between ${darkMode ? 'border-white/5' : 'border-slate-50'}`}>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight">Top Client Performance</h3>
                      <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Ranking by lifetime value</p>
                    </div>
                    <button className="text-[11px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 uppercase tracking-widest px-4 py-2 bg-indigo-50/50 dark:bg-indigo-500/10 rounded-xl transition-all">Full Report</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/30 dark:bg-slate-800/30">
                        <tr>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Client Identity</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Orders</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Unique SKU</th>
                          <th className="px-8 py-5 text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">LTV</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {customerStats.map((customer, i) => (
                          <tr key={i} className="hover:bg-indigo-50/20 transition-colors group">
                            <td className="px-8 py-5">
                               <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                    {customer.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <span className="text-sm font-black text-slate-800 dark:text-slate-100">{customer.name}</span>
                               </div>
                            </td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-500 dark:text-white text-right">{customer.orders}</td>
                            <td className="px-8 py-5 text-sm font-bold text-slate-400 dark:text-white text-right">{customer.uniqueProducts}</td>
                            <td className="px-8 py-5 text-sm font-black text-indigo-600 dark:text-white text-right">{formatIDR(customer.revenue)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
               </div>
               
               <div className="space-y-8">
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-indigo-600 to-violet-600 p-10 rounded-[2.5rem] shadow-2xl shadow-indigo-200 text-white min-h-[220px] flex flex-col justify-between relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform"></div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Retention Rate</p>
                      <h4 className="text-5xl font-black mt-2 tracking-tighter italic">100%</h4>
                    </div>
                    <div className="pt-6 border-t border-white/20 flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                      <span className="opacity-60">Database Nodes</span>
                      <span className="bg-white/20 px-3 py-1 rounded-lg">{customerStats.length} PX</span>
                    </div>
                  </motion.div>

                  <div className={`p-10 rounded-[2.5rem] shadow-2xl border transition-all duration-500 ${darkMode ? 'bg-slate-900/80 shadow-black/20 border-white/5' : 'bg-white/80 shadow-slate-200/50 border-white'} backdrop-blur-2xl`}>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white tracking-tight mb-8">Segment Distribution</h3>
                    <ResponsiveContainer width="100%" height={220}>
                       <PieChart>
                          <Pie 
                            data={customerStats.slice(0, 5)} 
                            dataKey="revenue" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={75} 
                            innerRadius={55} 
                            paddingAngle={8}
                            stroke="none"
                            cornerRadius={8}
                          >
                            {customerStats.slice(0, 5).map((_entry, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <RechartsTooltip contentStyle={{ borderRadius: '24px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#ffffff', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)' }} itemStyle={{ color: darkMode ? '#e2e8f0' : '#475569' }} />
                       </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-8 grid grid-cols-2 gap-4">
                       {customerStats.slice(0, 4).map((c, i) => (
                         <div key={i} className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                           <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 truncate uppercase tracking-wider">{c.name}</span>
                         </div>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                <StatCard title="Total Komisi Pipeline" value={formatIDR(totalKomisi)} trend={12.5} index={0} icon={TrendingUp} color="violet" darkMode={darkMode} />
                <StatCard title="Projected Revenue" value={formatIDR(totalRevenue * 1.2)} trend={20} index={1} icon={DollarSign} color="indigo" darkMode={darkMode} />
                <StatCard title="Order Efficiency" value="98.2%" trend={2} index={2} icon={Truck} color="emerald" darkMode={darkMode} />
             </div>
             
             <ChartCard title="Revenue Distribution Over Time" subtitle="Komparasi volume transaksi harian" icon={TrendingUp} darkMode={darkMode}>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={salesByDate}>
                    <defs>
                      <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "rgba(255,255,255,0.05)" : "#f1f5f9"} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 11 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: darkMode ? '#64748b' : '#94a3b8', fontSize: 11 }} tickFormatter={(val) => `${val/1000}k`} />
                    <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#0f172a' : '#ffffff', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} itemStyle={{ color: darkMode ? '#e2e8f0' : '#475569', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                  </AreaChart>
                </ResponsiveContainer>
             </ChartCard>
          </motion.div>
        )}

        <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center text-[11px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 gap-4">
          <div className="flex items-center gap-4">
            <span className="text-slate-300 dark:text-slate-700">DEPLOYMENT ID: {gasUrl ? gasUrl.slice(-8).toUpperCase() : 'STABLE-BUILD'}</span>
            <div className="w-1 h-1 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
            <span className="flex items-center gap-1.5"><Clock size={12}/> Normal Load</span>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Support Documentation</span>
            <span className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors cursor-pointer">Privacy Protocol</span>
          </div>
        </footer>
        </div>
      </main>

      {/* Settings Modal - Modern Light version */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-8 shadow-2xl border border-slate-100 dark:border-white/5"
            >
              <div className="mb-8 flex items-center gap-4">
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                    <RefreshCw size={24} />
                 </div>
                 <div>
                   <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Sync Configuration</h2>
                   <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Link your Google Sheets pipeline</p>
                 </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Web App URL</label>
                  <input 
                    type="text" 
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/..."
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-700 font-medium font-mono"
                  />
                  <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
                    <AlertCircle size={14} className="text-indigo-400" />
                    <span>Check <code className="text-indigo-600 dark:text-indigo-400 font-bold">GOOGLE_APPS_SCRIPT.js</code> for guide</span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/20 rounded-2xl">
                  <div className="flex items-start gap-3">
                    <Clock className="text-amber-500 shrink-0 mt-0.5" size={18} />
                    <p className="text-xs text-amber-700 dark:text-amber-300/80 leading-relaxed font-medium">
                      Ensure deployment is set to "Anyone" and type as "Web App" in the Google Script editor.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-10">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="flex-1 px-6 py-3 text-sm font-bold text-slate-500 dark:text-slate-400 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-white/10"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateUrl}
                  className="flex-1 px-6 py-3 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold rounded-2xl hover:bg-indigo-700 dark:hover:bg-indigo-600 shadow-lg shadow-indigo-200 dark:shadow-indigo-950 transition-all"
                >
                  Confirm Sync
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
