import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Area,
    AreaChart,
} from "recharts";
import { useState, useMemo } from "react";
import { useExtendedAnalytics } from "../features/analytics/analytics.queries";

const AnalyticsPage = () => {
    // Use a 30-day range by default
    const [dateRange, setDateRange] = useState(() => {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        return {
            start: start.toISOString().split("T")[0],
            end: end.toISOString().split("T")[0],
        };
    });

    const { data, isLoading, error } = useExtendedAnalytics(dateRange.start, dateRange.end);

    const stats = data?.bookingStats || { totalBookings: 0, totalConfirmed: 0, totalPending: 0, totalCancelled: 0 };
    const revenue = data?.revenueStats || { totalRevenue: 0, averageRevenue: 0 };
    const trends = data?.bookingTrends || [];
    const topServices = data?.topServices || [];

    const { totalBookings, totalConfirmed, totalPending, totalCancelled } = stats;
    const { totalRevenue, averageRevenue } = revenue;
    const completionRate = totalBookings > 0 ? Math.round((totalConfirmed / totalBookings) * 100) : 0;

    const handleRangeChange = (e) => {
        const { name, value } = e.target;
        setDateRange(prev => ({ ...prev, [name]: value }));
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[500px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-zinc-950 border-opacity-20"></div>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center animate-in shake">
            <p className="badge-shad bg-rose-50 border-rose-100 text-rose-600 font-black uppercase tracking-widest px-8 py-4">Помилка Аналітики: {error.message}</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in duration-700 max-w-full">
            {/* Header Block with Period Controls */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase opacity-90">Аналітичний Термінал</h1>
                    <p className="text-[11px] font-black text-zinc-400 mt-2 uppercase tracking-widest">Візуалізація системних метрик та операційної ефективності.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-center bg-white border border-zinc-200 rounded-xl p-1.5 shadow-sm gap-2">
                    <div className="flex items-center gap-2 px-3 border-r border-zinc-100">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Період Аудиту:</span>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <input
                            type="date"
                            name="start"
                            value={dateRange.start}
                            onChange={handleRangeChange}
                            className="input-shad !h-9 !px-3 font-bold text-xs !border-none !ring-0 focus:bg-zinc-50"
                        />
                        <span className="text-zinc-300">/</span>
                        <input
                            type="date"
                            name="end"
                            value={dateRange.end}
                            onChange={handleRangeChange}
                            className="input-shad !h-9 !px-3 font-bold text-xs !border-none !ring-0 focus:bg-zinc-50"
                        />
                    </div>
                </div>
            </div>

            {/* Primary KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card shadow-2xl p-8 border-zinc-200/50 group transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Обсяг Реєстру</span>
                        <div className="h-4 w-4 rounded-full bg-zinc-950 shadow-lg shadow-zinc-200"></div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 mb-2">{totalBookings}</div>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Всього записів сесій</p>
                </div>

                <div className="card shadow-2xl p-8 bg-zinc-950 text-zinc-50 border-transparent transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-6 text-zinc-500">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">Чистий Дохід</span>
                        <div className="h-4 w-4 rounded-full bg-zinc-700 animate-pulse"></div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black tracking-tighter mb-2 font-mono">${totalRevenue.toLocaleString()}</div>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Вартість операційного циклу</p>
                </div>

                <div className="card shadow-2xl p-8 border-zinc-200/50 group transition-all hover:scale-[1.02]">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Рівень Конверсії</span>
                        <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-xl shadow-emerald-100"></div>
                    </div>
                    <div className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 mb-2">{completionRate}%</div>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Ефективність виконання протоколу</p>
                </div>

                <div className="card shadow-md p-6 border-zinc-200 hover:shadow-xl transition-all group">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]"></span>
                        <div className="h-2 w-2 rounded-full bg-amber-500 group-hover:scale-150 transition-transform"></div>
                    </div>
                    <div className="text-3xl font-black text-zinc-950 tracking-tighter"></div>
                    <p className="text-[10px] text-zinc-400 font-bold mt-2 uppercase tracking-widest"></p>
                </div>
            </div>

            {/* Main Trends Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Trend Chart */}
                <div className="lg:col-span-2 card p-6 md:p-8 shadow-2xl border-zinc-200/50">
                    <div className="flex items-center justify-between mb-8 md:mb-10">
                        <div>
                            <h2 className="text-lg font-black text-zinc-950 uppercase tracking-tighter">Операційна Динаміка</h2>
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Часовий розподіл створення реєстрів.</p>
                        </div>
                        <div className="hidden sm:flex items-center gap-4">
                            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-zinc-950"></div> <span className="text-[9px] font-black text-zinc-400 uppercase">Загальний</span></div>
                            <div className="flex items-center gap-1.5"><div className="h-2 w-2 rounded-full bg-zinc-400"></div> <span className="text-[9px] font-black text-zinc-300 uppercase">Підтверджений</span></div>
                        </div>
                    </div>
                    <div className="h-[300px] md:h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000" stopOpacity={0.05} />
                                        <stop offset="95%" stopColor="#000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 9, fontWeight: 900, fill: '#A1A1AA' }}
                                    dy={10}
                                    tickFormatter={(val) => val.split("-").slice(2).join("/")}
                                />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#A1A1AA' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                />
                                <Area type="monotone" dataKey="count" stroke="#000" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                <Area type="monotone" dataKey="confirmed" stroke="#D4D4D8" strokeWidth={3} fill="transparent" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Services Distribution */}
                <div className="card shadow-2xl p-8 border-zinc-200/50">
                    <h3 className="text-sm font-black text-zinc-950 uppercase tracking-widest mb-10 pb-4 border-b border-zinc-50 inline-block">Операційна Популяція</h3>
                    <div className="space-y-6">
                        {[
                            { label: "Підтверджені Тікети", value: totalConfirmed, color: "bg-emerald-500" },
                            { label: "Очікують Верифікації", value: totalPending, color: "bg-amber-500" },
                            { label: "Скасовані Вузли", value: totalCancelled, color: "bg-rose-500" }
                        ].map((item) => (
                            <div key={item.label}>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.label}</span>
                                    <span className="text-sm font-black text-zinc-950">{item.value}</span>
                                </div>
                                <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: `${totalBookings > 0 ? (item.value / totalBookings) * 100 : 0}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 pt-8 border-t border-zinc-100">
                        <div className="flex items-center justify-between text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                            <span>Статус Стабільності</span>
                            <span className="text-emerald-500">Перевірено</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Secondary Intelligence Block */}
            <div className="hidden grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="card p-8 border-zinc-200/50 shadow-xl bg-zinc-950 text-zinc-50 flex items-center justify-between">
                    <div className="space-y-2">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">Глобальне Навантаження</h4>
                        <div className="text-4xl font-black">74.2%</div>
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Розподіл терміналів у реальному часі</p>
                    </div>
                    <div className="h-16 w-16 md:h-20 md:w-20 rounded-full border-[8px] border-zinc-800 border-t-zinc-50 animate-spin-slow"></div>
                </div>
                <div className="card p-8 border-zinc-200/50 shadow-xl bg-white flex items-center justify-between">
                    <div className="space-y-2 text-zinc-950">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Утилізація Платформи</h4>
                        <div className="text-4xl font-black">1.2m</div>
                        <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Секунд активної взаємодії</p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-100"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
