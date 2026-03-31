import { useState } from "react";
import ServiceModal from "../features/services/components/ServiceModal";
import {
  useCreateService,
  useDeactivateService,
  useDeleteService,
  useServices,
  useUpdateService,
} from "../features/services/services.queries";
import { useAuth } from "../features/auth/useAuth";

const ServicesPage = () => {
  const { user } = useAuth();
  const isAdmin = ["admin", "owner", "manager"].includes(user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const { data: services, isLoading, error } = useServices();
  const createServiceMutation = useCreateService();
  const updateServiceMutation = useUpdateService();
  const deleteServiceMutation = useDeleteService();
  const deactivateServiceMutation = useDeactivateService();

  const handleCreate = () => {
    setCurrentService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setCurrentService(service);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (serviceData) => {
    if (currentService) {
      updateServiceMutation.mutate({
        id: currentService._id || currentService.id,
        ...serviceData,
      });
      setIsModalOpen(false);
    } else {
      createServiceMutation.mutate(serviceData);
      setIsModalOpen(false);
    }
  };

  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-zinc-950 border-opacity-20"></div>
    </div>
  );

  if (error) return (
    <div className="p-12 text-center text-rose-500 text-sm font-medium card">
      Service Registry Fault: {error.message}
    </div>
  );

  return (
    <div className="flex flex-col gap-8 md:gap-10 animate-in fade-in duration-500 max-w-full">
      {/* Header Block */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Послуги</h1>
          <p className="text-sm text-zinc-500 mt-1">Налаштування та керування параметрами операційного інвентарю.</p>
        </div>

        <button onClick={handleCreate} className="btn-shad-primary w-full sm:w-auto">
          Додати Послугу
        </button>
      </div>

      {/* Responsive Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services?.map((service) => (
          <div key={service._id} className="card group flex flex-col items-stretch transition-transform hover:scale-[1.01]">
            <div className="card-header pb-4 flex-row items-center justify-between space-y-0">
              <div className="h-10 w-10 shrink-0 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-400 border border-zinc-200 shadow-sm transition-all group-hover:bg-zinc-950 group-hover:text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 6 4 14" /><path d="M12 6v14" /><path d="M8 8v12" /><path d="M4 4h16" /></svg>
              </div>
              <div className={`badge-shad text-[9px] px-2 py-0.5 ${service.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-zinc-200 bg-zinc-50 text-zinc-400"
                }`}>
                {service.isActive ? "В мережі" : "Чернетка"}
              </div>
            </div>

            <div className="card-content flex-1 pt-0">
              <h3 className="text-base md:text-lg font-bold text-zinc-950 tracking-tight truncate">{service.title}</h3>
              <p className="mt-1 text-xs text-zinc-500 font-medium line-clamp-2 h-8 leading-relaxed">{service.description}</p>

              <div className="mt-6 pt-5 border-t border-zinc-50 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Тариф План</span>
                  <span className="text-xl font-bold text-zinc-950 tracking-tighter">${service.price}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Тривалість</span>
                  <span className="text-xs font-semibold text-zinc-900">{service.durationMinutes}хв Слот</span>
                </div>
              </div>
            </div>

            <div className="card-footer border-t border-zinc-50 pt-5 mt-auto bg-zinc-50/20">
              <div className="flex w-full gap-2">
                <button
                  onClick={() => handleEdit(service)}
                  className="flex-1 btn-shad-outline !h-8 text-xs font-bold"
                >
                  Налаштувати
                </button>
                <button
                  onClick={() => deactivateServiceMutation.mutate(service._id)}
                  className="btn-shad-ghost !h-8 !w-8 !p-0 text-zinc-300 hover:text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                  title={service.isActive ? "Деактивувати" : "Активувати"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                </button>
                <button
                  onClick={() => deleteServiceMutation.mutate(service._id)}
                  className="btn-shad-ghost !h-8 !w-8 !p-0 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100"
                  title="Видалити"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {services?.length === 0 && (
          <div className="card col-span-full h-80 flex items-center justify-center p-12 text-center border-dashed">
            <div className="space-y-3">
              <div className="h-12 w-12 bg-zinc-50 rounded-full flex items-center justify-center mx-auto text-zinc-300 border border-zinc-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" /></svg>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-950">Порожній Реєстр</h4>
                <p className="text-xs text-zinc-400 font-medium">Створіть свою першу послугу вище.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        service={currentService}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};

export default ServicesPage;
