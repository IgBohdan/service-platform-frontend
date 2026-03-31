import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";
import { useBookings } from "../features/bookings/bookings.queries";
import { useCustomers } from "../features/customers/customers.queries";
import { useServices } from "../features/services/services.queries";
import RoleWelcomeGuide from "../components/RoleWelcomeGuide";

const DashboardPage = () => {
  const { user } = useAuth();
  const { data: bookings = [] } = useBookings();
  const { data: customers = [] } = useCustomers();
  const { data: services = [] } = useServices();

  const hour = new Date().getUTCHours();
  const greeting = hour < 12 ? "Доброго ранку" : hour < 18 ? "Доброго дня" : "Доброго вечора";

  const today = new Date().toISOString().split("T")[0];
  const todayBookings = (bookings || []).filter(b => b.startAt && b.startAt.startsWith(today));

  const activeCustomers = (customers || []).filter(c => c.isActive).length;

  // Calculate revenue from services (using resourceId from API)
  const revenueToday = todayBookings.reduce((sum, b) => {
    const s = (services || []).find(s => s.id === b.resourceId);
    return sum + (s ? s.price : 0);
  }, 0);

  const myBookings = user?.role === "client"
    ? (bookings || []).filter(b => b.userId === user.id)
    : (bookings || []);

  const isAdminPanel = ["admin", "owner", "manager"].includes(user?.role);
  const isEmployee = ["employee", "master"].includes(user?.role);
  const isClient = user?.role === "client";

  return (
    <div className="flex flex-col gap-10 md:gap-14 animate-in fade-in duration-700 max-w-full">
      {/* Header with High-Contrast Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-zinc-950 uppercase">{greeting}, {user?.email?.split('@')[0]}</h1>
          <p className="text-xs font-black text-zinc-400 mt-3 uppercase tracking-[0.3em] opacity-80">
            {isClient
              ? "Сесія активна"
              : `${todayBookings.length} записів на сьогодні`}
          </p>
        </div>
      </div>

      <RoleWelcomeGuide role={user?.role} />

      {/* Primary Intelligence Blocks */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {isAdminPanel ? (
          <>
            <div className="card shadow-2xl p-8 border-zinc-200/50 group transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Записи</span>
                <div className="h-3 w-3 rounded-full bg-zinc-950 animate-pulse"></div>
              </div>
              <div className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 mb-2">{todayBookings.length}</div>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Всього {bookings.length}</p>
            </div>

            <div className="card shadow-2xl p-8 border-zinc-200/50 group transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Клієнти</span>
                <div className="h-3 w-3 rounded-full bg-emerald-500 shadow-xl shadow-emerald-100"></div>
              </div>
              <div className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-950 mb-2">{activeCustomers}</div>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest">Активні профілі</p>
            </div>

            <div className="card shadow-2xl p-8 bg-zinc-950 text-zinc-50 border-transparent transition-all hover:scale-[1.02]">
              <div className="flex justify-between items-center mb-6 text-zinc-500">
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">Дохід</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </div>
              <div className="text-4xl md:text-5xl text-black mb-2">${revenueToday.toLocaleString()}</div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">За сьогодні</p>
            </div>
          </>
        ) : (
          <>
            <div className="card p-8 border-zinc-200/50 shadow-2xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 block mb-6">Записи</span>
              <div className="text-4xl font-black tracking-tighter text-zinc-950">{myBookings.length}</div>
              <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-2">За весь час</p>
            </div>
            <div className="card p-8 bg-zinc-950 text-zinc-50 border-transparent">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 block mb-6">Статус</span>
              <div className="text-2xl font-black tracking-tighter uppercase mb-2">Клієнт</div>
              <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Верифіковано</p>
            </div>
            <div className="card p-8 border-zinc-200/50 shadow-2xl flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div>
                  <h4 className="text-xs font-black text-zinc-900 uppercase tracking-widest">В мережі</h4>
                  <p className="text-[9px] font-black text-zinc-400 uppercase">Підключено</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Global Command Center (Quick Links) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isAdminPanel && (
          <>
            <Link to="/bookings" className="card p-4 flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 transition-all border-dashed group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-950"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950">Новий Запис</span>
            </Link>
            <Link to="/customers" className="card p-4 flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 transition-all border-dashed group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-950"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="16" x2="22" y1="11" y2="11" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950">Новий Клієнт</span>
            </Link>
            <Link to="/schedule" className="card p-4 flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 transition-all border-dashed group">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-950"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M9 16h6" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950">Розклад</span>
            </Link>
            <Link to="/analytics" className="card p-4 flex items-center justify-center gap-3 bg-white hover:bg-zinc-50 transition-all border-dashed group text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300 group-hover:text-zinc-950"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-950">Аналітика</span>
            </Link>
          </>
        )}
      </div>

      {/* Activity Feed Container */}
      <div className="card shadow-2xl border-zinc-200/50 overflow-hidden">
        <div className="card-header border-b border-zinc-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-8 px-10">
          <div>
            <h3 className="text-lg font-black text-zinc-950 uppercase tracking-tighter">Останні події</h3>
          </div>
          <Link to="/bookings" className="text-[10px] font-black text-zinc-300 hover:text-zinc-950 transition-colors uppercase tracking-[0.3em]">Всі &rarr;</Link>
        </div>
        <div className="divide-y divide-zinc-50 overflow-x-auto">
          {myBookings.slice(0, 5).map((b) => (
            <div key={b.id} className="flex items-center justify-between p-6 md:px-10 hover:bg-zinc-50/50 transition-colors min-w-[500px] group">
              <div className="flex items-center gap-6">
                <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-100 flex items-center justify-center text-[10px] font-black text-zinc-300 uppercase border border-zinc-200 shadow-sm group-hover:bg-zinc-950 group-hover:text-white transition-all">
                  {b.id.slice(-2)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-zinc-950 uppercase tracking-tight">{isClient ? "Запис" : b.customerName}</h4>
                  <div className="flex items-center gap-3 mt-1 opacity-60">
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{b.startAt ? new Date(b.startAt).toLocaleDateString("uk-UA") : "Немає дати"}</span>
                    <div className="w-1 h-1 rounded-full bg-zinc-200"></div>
                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">{b.startAt ? new Date(b.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "00:00"}</span>
                  </div>
                </div>
              </div>
              <div className={`badge-shad text-[9px] px-3 py-1 font-black tracking-widest ${b.status === "confirmed" ? "border-emerald-200 bg-emerald-50 text-emerald-700" :
                b.status === "pending" ? "border-amber-200 bg-amber-50 text-amber-700" :
                  "border-zinc-200 bg-zinc-50 text-zinc-400"
                }`}>
                {b.status.toUpperCase()}
              </div>
            </div>
          ))}
          {myBookings.length === 0 && (
            <div className="py-24 text-center opacity-20">
              <p className="text-[10px] font-black uppercase tracking-[0.5em]">Немає подій</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
