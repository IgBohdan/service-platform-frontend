import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
    useCustomers, 
    useCreateCustomer, 
    useDeactivateCustomer 
} from "../features/customers/customers.queries";

const customerSchema = z.object({
  firstName: z.string().min(2, "Має містити 2+ символи"),
  lastName: z.string().min(2, "Має містити 2+ символи"),
  email: z.string().email("Недійсний формат"),
  phone: z.string().optional(),
  address: z.object({
    city: z.string().optional(),
    street: z.string().optional(),
  }).optional(),
});

const CustomersPage = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { data: customers = [], isLoading, error } = useCustomers();
  const createCustomerMutation = useCreateCustomer();
  const deactivateCustomerMutation = useDeactivateCustomer();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: { city: "", street: "" }
    }
  });

  const onSubmit = (data) => {
    createCustomerMutation.mutate(data, {
        onSuccess: () => {
             setShowCreateForm(false);
             reset();
        }
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Purge registry record?")) {
      deactivateCustomerMutation.mutate(id);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[500px]">
      <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-zinc-950 border-opacity-20"></div>
    </div>
  );

  if (error) return (
      <div className="p-12 text-center animate-in shake">
          <p className="badge-shad bg-rose-50 border-rose-100 text-rose-600 font-black uppercase tracking-widest px-8 py-4 leading-relaxed">System Fault: {error.message || "Registry unreachable."}</p>
      </div>
  );

  return (
    <div className="flex flex-col gap-6 md:gap-10 animate-in fade-in duration-500 max-w-full">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Клієнти</h1>
          <p className="text-sm text-zinc-500 mt-1">Керування профілями партнерів та операційними метаданими.</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn-shad-primary w-full sm:w-auto"
        >
          Авторизувати Протокол
        </button>
      </div>

      <div className="card shadow-2xl border-zinc-200/50 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table-shad min-w-[700px] md:min-w-full">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/50">
                <th className="p-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Профіль / Системний ID</th>
                <th className="p-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Метадані Операцій</th>
                <th className="p-5 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">Статус Вузла</th>
                <th className="p-5 text-right text-[10px] font-black text-zinc-400 uppercase tracking-widest">Керування</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? (
                  customers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="!pl-8 py-5">
                        <Link to={`/customers/${customer.id}`} className="group/link flex items-center gap-4">
                          <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-900 flex items-center justify-center font-bold text-zinc-50 text-[11px] shadow-lg group-hover:scale-110 transition-transform">
                            {customer.firstName?.[0]}{customer.lastName?.[0]}
                          </div>
                          <div>
                            <span className="block font-black text-zinc-950 leading-none mb-1 text-sm uppercase tracking-tighter">
                              {customer.firstName} {customer.lastName}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest opacity-50">ID# {customer.id.slice(-6)}</span>
                          </div>
                        </Link>
                      </td>
                      <td className="py-5">
                        <div className="text-xs font-bold text-zinc-900 lowercase tracking-tight">{customer.email}</div>
                        <div className="text-[9px] text-zinc-400 font-black mt-0.5 tracking-widest uppercase">{customer.phone || 'N/A PROTOCOL'}</div>
                      </td>
                      <td className="py-5">
                        <div className={`badge-shad text-[9px] px-3 py-1 font-black tracking-widest ${customer.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-400"}`}>
                          {customer.isActive ? "АКТИВНИЙ" : "НЕАКТИВНИЙ"}
                        </div>
                      </td>
                      <td className="text-right pr-6 md:pr-10 py-5">
                        <div className="flex items-center justify-end gap-2 md:gap-3">
                            <Link to={`/customers/${customer.id}`} className="p-2 text-zinc-300 hover:text-zinc-950 hover:bg-zinc-50 rounded-lg transition-all" title="Налаштувати">
                                 <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.72V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.17a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                            </Link>
                          <button
                            onClick={() => handleDelete(customer.id)}
                            className="p-2 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                            title="Видалити"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
              ) : (
                  <tr>
                      <td colSpan={4} className="py-20 text-center text-[10px] font-black uppercase text-zinc-300 tracking-[0.4em]">Registry Buffer Idle</td>
                  </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateForm && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-zinc-950/20 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="card w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 rounded-b-none sm:rounded-2xl border-zinc-200/50">
            <div className="card-header border-b border-zinc-50 flex flex-row items-center justify-between space-y-0 pb-6 mb-4 sticky top-0 bg-white z-10 p-8">
              <div>
                <h3 className="text-xl font-black text-zinc-950 uppercase tracking-tight">Створити Профіль</h3>
                <p className="text-[11px] text-zinc-400 mt-1 font-black uppercase tracking-widest">Налаштувати параметри ідентифікації для реєстру.</p>
              </div>
              <button onClick={() => setShowCreateForm(false)} className="text-zinc-300 hover:text-zinc-950 transition-colors p-2 hover:bg-zinc-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="card-content space-y-6 pb-12 sm:pb-10 max-h-[80vh] overflow-y-auto custom-scrollbar px-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ім'я</label>
                  <input {...register("firstName")} className={`input-shad !h-12 font-bold text-sm ${errors.firstName ? 'border-rose-500 ring-rose-500' : ''}`} placeholder="напр. Іван" />
                  {errors.firstName && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 shake">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Прізвище</label>
                  <input {...register("lastName")} className={`input-shad !h-12 font-bold text-sm ${errors.lastName ? 'border-rose-500 ring-rose-500' : ''}`} placeholder="напр. Франко" />
                  {errors.lastName && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 shake">{errors.lastName.message}</p>}
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" {...register("email")} className={`input-shad !h-12 font-bold text-sm lowercase ${errors.email ? 'border-rose-500 ring-rose-500' : ''}`} placeholder="contact@example.com" />
                {errors.email && <p className="text-rose-600 text-[10px] font-black uppercase tracking-widest mt-1 ml-1 shake">{errors.email.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Телефон</label>
                  <input type="tel" {...register("phone")} className="input-shad !h-12 font-bold text-sm" placeholder="+38 000 000 00 00" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Місто</label>
                  <input {...register("address.city")} className="input-shad !h-12 font-bold text-sm" placeholder="Київ" />
                </div>
              </div>

              {createCustomerMutation.isError && (
                <div className="p-5 bg-rose-50 border border-rose-100 rounded-2xl animate-in shake">
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">
                    Помилка реєстру: {createCustomerMutation.error.message || "Відмова облікових даних."}
                  </p>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-8 border-t border-zinc-50">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-shad-outline h-12 w-full sm:w-auto px-10 font-black uppercase tracking-widest text-[10px]">Скасувати</button>
                <button type="submit" disabled={createCustomerMutation.isLoading} className="btn-shad-primary h-12 w-full sm:w-auto px-12 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-zinc-200">
                  {createCustomerMutation.isLoading ? "Авторизація..." : "Створити Запис"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
