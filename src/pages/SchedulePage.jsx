import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useDeleteSchedule,
  useSchedules,
  useCreateSchedule,
  useUpdateSchedule,
} from "../features/schedule/schedule.queries";

const scheduleSchema = z.object({
  title: z.string().min(2, "Identity required (2+ characters)"),
  description: z.string().optional(),
  startAt: z.string().min(1, "Temporal start is required"),
  endAt: z.string().min(1, "Temporal end is required"),
  location: z.string().optional(),
}).refine((data) => new Date(data.endAt) > new Date(data.startAt), {
  message: "End time must exceed start time",
  path: ["endAt"],
});

const SchedulePage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const { data: schedules = [], isLoading, error } = useSchedules();
  const createScheduleMutation = useCreateSchedule();
  const updateScheduleMutation = useUpdateSchedule();
  const deleteScheduleMutation = useDeleteSchedule();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(scheduleSchema),
  });

  const handleCreate = (date) => {
    const startAt = new Date(date);
    startAt.setHours(9, 0, 0, 0);
    const endAt = new Date(date);
    endAt.setHours(10, 0, 0, 0);

    reset({
      title: "",
      description: "",
      location: "",
      startAt: startAt.toISOString().slice(0, 16),
      endAt: endAt.toISOString().slice(0, 16),
    });
    setCurrentId(null);
    setIsModalOpen(true);
  };

  const handleEdit = (schedule) => {
    reset({
      title: schedule.title || "",
      description: schedule.description || "",
      location: schedule.location || "",
      startAt: new Date(schedule.startAt).toISOString().slice(0, 16),
      endAt: new Date(schedule.endAt).toISOString().slice(0, 16),
    });
    setCurrentId(schedule.id);
    setIsModalOpen(true);
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      startAt: new Date(data.startAt).toISOString(),
      endAt: new Date(data.endAt).toISOString(),
    };

    if (currentId) {
      updateScheduleMutation.mutate(
        { id: currentId, ...payload },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createScheduleMutation.mutate(payload, {
        onSuccess: () => setIsModalOpen(false),
      });
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Purge registry record?")) {
      deleteScheduleMutation.mutate(id);
      setIsModalOpen(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-zinc-950 border-opacity-20"></div>
    </div>
  );

  if (error) return (
    <div className="p-12 text-center animate-in shake">
      <p className="badge-shad bg-rose-50 border-rose-100 text-rose-600 font-black uppercase tracking-widest px-8 py-4">Node Fault: {error.message || "Schedule unreachable."}</p>
    </div>
  );

  const month = selectedDate.getMonth();
  const year = selectedDate.getFullYear();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const daysArr = [];
  for (let i = 0; i < firstDayOfMonth; i++) daysArr.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArr.push(new Date(year, month, i));

  const monthNames = [
    "Січень", "Лютий", "Березень", "Квітень", "Травень", "Червень",
    "Липень", "Серпень", "Вересень", "Жовтень", "Листопад", "Грудень"
  ];

  return (
    <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in duration-700 max-w-full">
      {/* Header Block with Temporal Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase">Операційний Розклад</h1>
          <p className="text-[11px] font-black text-zinc-400 mt-2 uppercase tracking-widest">Розподіл часу та координація сесій.</p>
        </div>

        <div className="flex items-center bg-white border border-zinc-200 rounded-xl p-1.5 shadow-sm overflow-hidden gap-1.5">
          <button
            onClick={() => setSelectedDate(new Date(year, month - 1, 1))}
            className="p-2.5 hover:bg-zinc-50 text-zinc-300 hover:text-zinc-950 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
          </button>
          <h2 className="px-5 text-xs font-black text-zinc-950 min-w-[150px] text-center uppercase tracking-[0.2em]">
            {monthNames[month]} {year}
          </h2>
          <button
            onClick={() => setSelectedDate(new Date(year, month + 1, 1))}
            className="p-2.5 hover:bg-zinc-50 text-zinc-300 hover:text-zinc-950 rounded-lg transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
          </button>
        </div>
      </div>

      {/* Industrial Calendar Grid */}
      <div className="card shadow-2xl border-zinc-200/50 overflow-hidden bg-white">
        <div className="grid grid-cols-7 border-b border-zinc-50 bg-zinc-50/30">
          {["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"].map((day) => (
            <div key={day} className="py-4 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest border-r border-zinc-50 last:border-none">
              {day}
            </div>
          ))}
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <div className="grid grid-cols-7 bg-zinc-100/50 gap-px min-w-[800px]">
            {daysArr.map((date, index) => {
              const isToday = date?.toDateString() === new Date().toDateString();
              const dateSchedules = date ? schedules.filter(s => new Date(s.startAt).toDateString() === date.toDateString()) : [];

              return (
                <div
                  key={index}
                  className={`bg-white min-h-[140px] md:min-h-[180px] p-4 transition-all relative group ${!date ? 'bg-zinc-50/20' : 'hover:bg-zinc-50/30'}`}
                  onDoubleClick={() => date && handleCreate(date)}
                >
                  {date && (
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-[11px] font-black flex items-center justify-center rounded-xl h-7 w-7 transition-all ${isToday ? 'bg-zinc-950 text-white shadow-2xl ring-4 ring-zinc-100' : 'text-zinc-400'
                          }`}>
                          {date.getDate()}
                        </span>
                        <button
                          onClick={() => handleCreate(date)}
                          className="opacity-0 group-hover:opacity-100 p-2 text-zinc-300 hover:text-zinc-950 transition-all rounded-lg hover:bg-white hover:shadow-sm"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
                        </button>
                      </div>

                      <div className="space-y-1.5 overflow-y-auto max-h-[100px] custom-scrollbar pr-0.5">
                        {dateSchedules.map(s => (
                          <div
                            key={s.id}
                            onClick={() => handleEdit(s)}
                            className={`text-[9px] font-black uppercase p-2 rounded-lg cursor-pointer truncate tracking-widest border transition-all ${s.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                s.status === 'cancelled' ? 'bg-rose-50 text-rose-700 border-rose-100' :
                                  s.status === 'in-progress' ? 'bg-zinc-950 text-zinc-50 border-zinc-900 shadow-xl' :
                                    'bg-white text-zinc-600 border-zinc-100 shadow-sm'
                              } hover:border-zinc-300 hover:shadow-lg hover:z-10`}
                          >
                            <div className="flex items-center gap-1.5 opacity-60 mb-1">
                              <div className={`w-1 h-1 rounded-full ${s.status === 'in-progress' ? 'bg-white' : 'bg-zinc-400'}`}></div>
                              {new Date(s.startAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                            </div>
                            <div className="truncate">{s.title}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Protocol Configuration Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/30 backdrop-blur-md animate-in fade-in duration-300">
          <div className="card w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 rounded-b-none sm:rounded-2xl border-zinc-200/50">
            <div className="card-header border-b border-zinc-50 flex flex-row items-center justify-between space-y-0 pb-6 mb-6 sticky top-0 bg-white z-10 px-8 pt-8">
              <div>
                <h3 className="text-xl font-black text-zinc-950 leading-none uppercase tracking-tighter">
                  {currentId ? "Налаштувати Вузол" : "Ініціалізувати Сесію"}
                </h3>
                <p className="text-[11px] font-black text-zinc-400 mt-2 uppercase tracking-widest">Параметри часу та операційний брифінг.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-300 hover:text-zinc-950 transition-colors p-2.5 hover:bg-zinc-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-6 pb-12 sm:pb-10 overflow-y-auto max-h-[75vh] px-8 custom-scrollbar">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Директива Події</label>
                <input
                  {...register("title")}
                  className={`input-shad !h-12 font-black text-sm ${errors.title ? "border-rose-500 ring-rose-500" : ""}`}
                  placeholder="напр. Системний Протокол Альфа"
                />
                {errors.title && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1 ml-1 shake">{errors.title.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Початок</label>
                  <input
                    {...register("startAt")}
                    type="datetime-local"
                    className={`input-shad !h-12 font-black text-xs ${errors.startAt ? "border-rose-500 ring-rose-500" : ""}`}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Завершення</label>
                  <input
                    {...register("endAt")}
                    type="datetime-local"
                    className={`input-shad !h-12 font-black text-xs ${errors.endAt ? "border-rose-500 ring-rose-500" : ""}`}
                  />
                </div>
              </div>
              {errors.endAt && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-0 ml-1 shake text-center">{errors.endAt.message}</p>}

              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Локація Взаємодії</label>
                <input
                  {...register("location")}
                  className="input-shad !h-12 font-black text-sm"
                  placeholder="Фізичний або цифровий вузол"
                />
              </div>

              <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-8 border-t border-zinc-100">
                {currentId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(currentId)}
                    className="btn-shad-ghost text-rose-500 hover:text-rose-700 hover:bg-rose-50 w-full sm:w-auto font-black uppercase tracking-widest text-[10px] h-12 px-8 border-rose-100/50"
                  >
                    Видалити Запис
                  </button>
                )}
                <div className="flex gap-3 w-full sm:w-auto ml-auto">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 sm:flex-none btn-shad-outline h-12 px-10 font-black uppercase tracking-widest text-[10px]"
                  >
                    Закрити
                  </button>
                  <button
                    type="submit"
                    disabled={createScheduleMutation.isLoading || updateScheduleMutation.isLoading}
                    className="flex-1 sm:flex-none btn-shad-primary h-12 px-12 font-black uppercase tracking-widest text-[10px] shadow-2xl"
                  >
                    {currentId ? "Оновити" : "Авторизувати"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
