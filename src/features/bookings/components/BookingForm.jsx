import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateBooking } from "../bookings.queries";
import { useCustomers } from "../../customers/customers.queries";
import { useServices } from "../../services/services.queries";
import { useEffect, useMemo } from "react";

const bookingSchema = z.object({
  customerId: z.string().min(1, "Customer identity is required"),
  resourceId: z.string().min(1, "Service selection is required"),
  bookingDate: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  notes: z.string().optional(),
});

const BookingForm = ({ onSuccess }) => {
  const { data: customers = [] } = useCustomers();
  const { data: services = [] } = useServices();
  const createBookingMutation = useCreateBooking();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      customerId: "",
      resourceId: "",
      bookingDate: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      notes: "",
    },
  });

  const selectedCustomerId = useWatch({ control, name: "customerId" });
  const selectedResourceId = useWatch({ control, name: "resourceId" });
  const bookingDate = useWatch({ control, name: "bookingDate" });
  const startTime = useWatch({ control, name: "startTime" });

  const onSubmit = (values) => {
    const customer = customers.find((c) => c.id === values.customerId);
    const service = services.find((s) => s.id === values.resourceId);

    console.log(values.customerId)
    if (!customer || !service) return;

    // Temporal Logic
    const startAt = new Date(`${values.bookingDate}T${values.startTime}:00`);
    const endAt = new Date(startAt.getTime() + (service.durationMinutes || 60) * 60000);

    const payload = {
      resourceId: values.resourceId,
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
      customerName: `${customer.firstName} ${customer.lastName}`,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      notes: values.notes,
    };

    createBookingMutation.mutate(payload, {
      onSuccess: () => {
        reset();
        if (onSuccess) onSuccess();
      },
      onError: (err) => {
        // Toast or error handling could go here
        console.error("Booking Logic Fault:", err);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Customer Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            Ідентифікація Клієнта
          </label>
          <div className="relative">
            <select
              {...register("customerId")}
              className={`input-shad appearance-none pr-10 font-bold text-sm ${errors.customerId ? 'border-rose-500 ring-rose-500' : ''}`}
            >
              <option value="">Авторизувати акаунт</option>
              {customers?.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} ({customer.email})
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
          {errors.customerId && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 animate-in slide-in-from-top-1">{errors.customerId.message}</p>}
        </div>

        {/* Service Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            Визначення Послуги
          </label>
          <div className="relative">
            <select
              {...register("resourceId")}
              className={`input-shad appearance-none pr-10 font-bold text-sm ${errors.resourceId ? 'border-rose-500 ring-rose-500' : ''}`}
            >
              <option value="">Вибрати послугу</option>
              {services?.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title} — ${service.price} ({service.durationMinutes} хв)
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
            </div>
          </div>
          {errors.resourceId && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 animate-in slide-in-from-top-1">{errors.resourceId.message}</p>}
        </div>

        {/* Date Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            Операційна Дата
          </label>
          <input
            type="date"
            {...register("bookingDate")}
            className={`input-shad font-bold text-sm ${errors.bookingDate ? 'border-rose-500 ring-rose-500' : ''}`}
          />
          {errors.bookingDate && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 animate-in slide-in-from-top-1">{errors.bookingDate.message}</p>}
        </div>

        {/* Time Selection */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            Синхронізований Час
          </label>
          <input
            type="time"
            {...register("startTime")}
            className={`input-shad font-bold text-sm ${errors.startTime ? 'border-rose-500 ring-rose-500' : ''}`}
          />
          {errors.startTime && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 animate-in slide-in-from-top-1">{errors.startTime.message}</p>}
        </div>
      </div>

      {/* Notes Field */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
          Опис Завдання (Опціонально)
        </label>
        <textarea
          {...register("notes")}
          rows={3}
          className="input-shad !h-auto py-3 font-medium text-sm resize-none"
          placeholder="Додаткові параметри або інструкції..."
        />
      </div>

      {createBookingMutation.isError && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl animate-in shake">
          <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
            Системний виняток: {createBookingMutation.error?.message || "Помилка при створенні запису."}
          </p>
        </div>
      )}

      <div className="pt-8 border-t border-zinc-100 flex items-center justify-end">
        <button
          type="submit"
          disabled={createBookingMutation.isLoading}
          className="btn-shad-primary h-12 px-12 text-xs font-black uppercase tracking-widest shadow-xl hover:shadow-2xl transition-all"
        >
          {createBookingMutation.isLoading ? "Авторизація протоколу..." : "Зафіксувати Реєстр"}
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
