import { useBookings, useUpdateBookingStatus, useDeleteBooking } from "../bookings.queries";

const BookingList = () => {
  const { data: bookings = [], isLoading, error } = useBookings();
  const updateStatusMutation = useUpdateBookingStatus();
  const deleteBookingMutation = useDeleteBooking();

  const handleStatusChange = (id, status) => {
    updateStatusMutation.mutate({ id, status });
  };

  const handleDelete = (id) => {
    if (window.confirm("Purge registry record?")) {
      deleteBookingMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center py-24">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-zinc-950 border-opacity-20"></div>
    </div>
  );

  if (error) return (
    <div className="p-12 text-center animate-in shake">
        <p className="badge-shad bg-rose-50 border-rose-100 text-rose-600 font-black uppercase tracking-widest px-8 py-4">Registry Fault: {error.message || "Bookings unreachable."}</p>
    </div>
  );

  return (
    <div className="flex flex-col divide-y divide-zinc-50 min-w-full bg-white">
      {bookings.length > 0 ? bookings.map((booking) => (
        <div key={booking.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-6 md:px-10 hover:bg-zinc-50/50 transition-all gap-6">
          {/* Primary Identity Area */}
          <div className="flex items-center gap-6">
            <div className="hidden md:flex h-12 w-12 shrink-0 rounded-xl bg-zinc-950 items-center justify-center text-[11px] font-black text-white shadow-xl group-hover:scale-105 transition-transform">
              {booking.id.slice(-2)}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h4 className="text-sm md:text-base font-black text-zinc-950 tracking-tight leading-none uppercase">{booking.resource?.title || "Технічна сесія"}</h4>
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-200"></div>
                <span className="text-[10px] text-zinc-300 font-black uppercase tracking-widest opacity-60">ID ВУЗЛА#{booking.id.slice(-6)}</span>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[10px] md:text-[11px] text-zinc-400 font-black uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                  <span className="text-zinc-500">{booking.customerName || "Невідомий клієнт"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300"><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M9 16h6" /></svg>
                  <span>{booking.startAt ? new Date(booking.startAt).toLocaleDateString() : "Без дати"} / {booking.startAt ? new Date(booking.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '00:00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Controls Area */}
          <div className="flex items-center justify-between sm:justify-end gap-3 md:gap-6 w-full sm:w-auto">
            <div className="relative group/select">
              <select
                value={booking.status}
                onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                className={`badge-shad appearance-none pr-10 !h-10 cursor-pointer font-black tracking-widest text-[10px] uppercase transition-all ring-offset-white focus:outline-none focus:ring-4 focus:ring-zinc-950/10 ${
                    booking.status === "confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                    booking.status === "pending" ? "bg-amber-50 text-amber-700 border-amber-100" :
                    "bg-zinc-100 text-zinc-400 border-zinc-200"
                  }`}
              >
                <option value="pending">Очікує</option>
                <option value="confirmed">Підтверджено</option>
                <option value="cancelled">Скасовано</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover/select:opacity-100 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
              </div>
            </div>

            <button
              onClick={() => handleDelete(booking.id)}
              className="p-2 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
              title="Видалити"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            </button>
          </div>
        </div>
      )) : (
        <div className="py-24 text-center">
           <h5 className="text-[10px] font-black text-zinc-300 uppercase tracking-[0.4em]">Активні бронювання відсутні</h5>
        </div>
      )}
    </div>
  );
};

export default BookingList;
