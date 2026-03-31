import { useState } from "react";
import BookingList from "../features/bookings/components/BookingList";
import BookingForm from "../features/bookings/components/BookingForm";
import { useAuth } from "../features/auth/useAuth";

const BookingsPage = () => {
  const [activeTab, setActiveTab] = useState("list");
  const { user } = useAuth();
  
  const canCreate = ["admin", "owner", "manager", "master", "client"].includes(user?.role);
  const canEdit = ["admin", "owner", "manager", "master"].includes(user?.role);

  return (
    <div className="flex flex-col gap-6 md:gap-10 max-w-full">
      {/* Header Block */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="max-w-xl">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Бронювання</h1>
          <p className="text-sm text-zinc-500 mt-1">Керування та відстеження всіх запланованих сервісних взаємодій у системі.</p>
        </div>
        
        {/* Tab Switcher - Responsive Width */}
        <div className="inline-flex h-10 items-center justify-center rounded-lg bg-zinc-100 p-1 text-zinc-500 w-full sm:w-fit">
          <button
            onClick={() => setActiveTab("list")}
            className={`flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-xs font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
              activeTab === "list"
                ? "bg-white text-zinc-950 shadow-sm"
                : "hover:bg-zinc-200/50 hover:text-zinc-900"
            }`}
          >
            Активний Реєстр
          </button>
          {canCreate && (
            <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center whitespace-nowrap rounded-md px-6 py-1.5 text-xs font-semibold ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 ${
                activeTab === "create"
                    ? "bg-white text-zinc-950 shadow-sm"
                    : "hover:bg-zinc-200/50 hover:text-zinc-900"
                }`}
            >
                Ініціалізувати
            </button>
          )}
        </div>
      </div>

      {/* Main Operational Block */}
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === "list" ? (
          <div className="card overflow-hidden">
             <div className="card-header border-b border-zinc-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
                 <div>
                    <h3 className="text-base md:text-lg font-bold text-zinc-900 leading-tight">Операційний Реєстр</h3>
                    <p className="text-[10px] md:text-xs text-zinc-500">Глобальні записи для всіх активних потоків</p>
                 </div>
                 <div className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100 hidden sm:block">Живий Статус</div>
             </div>
             <div className="card-content !px-0 !pb-0 overflow-x-auto">
                <BookingList />
             </div>
          </div>
        ) : (
          <div className="card max-w-2xl mx-auto shadow-xl">
            <div className="card-header border-b border-zinc-100 mb-6 py-6 md:py-8">
                <h3 className="text-xl font-bold text-zinc-900">Протокол Нового Запису</h3>
                <p className="text-xs text-zinc-500 mt-1">Вкажіть параметри для ініціалізації нової сесії.</p>
            </div>
            <div className="card-content pb-10">
                <BookingForm onSuccess={() => setActiveTab("list")} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
