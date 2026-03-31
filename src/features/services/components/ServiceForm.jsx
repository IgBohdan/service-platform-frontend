import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const serviceSchema = z.object({
  title: z.string().min(2, "Title requires at least 2 characters").max(100, "Title is too long (max 100)"),
  description: z.string().min(1, "Description is required").max(500, "Description exceeds maximum capacity"),
  price: z.coerce.number().min(0, "Rate cannot be negative"),
  durationMinutes: z.coerce.number().min(5, "Duration must be at least 5 minutes"),
  imageUrl: z.string().optional().or(z.literal("")),
});

const ServiceForm = ({ service, onSubmit, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      durationMinutes: 30,
      imageUrl: "",
    },
  });

  useEffect(() => {
    if (service) {
      reset({
        title: service.title || "",
        description: service.description || "",
        price: service.price || 0,
        durationMinutes: service.durationMinutes || 30,
        imageUrl: service.imageUrl || "",
      });
    }
  }, [service, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in duration-500">
      <div className="space-y-3">
        <label htmlFor="title" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
          Service Protocol Title
        </label>
        <input
          id="title"
          {...register("title")}
          className={`input-shad !h-11 font-bold text-sm ${errors.title ? "border-rose-500 ring-rose-500" : ""}`}
          placeholder="e.g. Technical Consultation"
        />
        {errors.title && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1 shake">{errors.title.message}</p>}
      </div>

      <div className="space-y-3">
        <label htmlFor="description" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
          Definition Summary
        </label>
        <textarea
          id="description"
          {...register("description")}
          rows={3}
          className={`input-shad !h-auto py-3 font-medium text-sm resize-none ${errors.description ? "border-rose-500 ring-rose-500" : ""}`}
            placeholder="Operational scope of the service definition..."
        />
        {errors.description && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1 shake">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label htmlFor="price" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            Standard Rate ($)
          </label>
          <input
            type="number"
            id="price"
            {...register("price")}
            className={`input-shad !h-11 font-bold text-sm ${errors.price ? "border-rose-500 ring-rose-500" : ""}`}
            placeholder="0.00"
          />
          {errors.price && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1 shake">{errors.price.message}</p>}
        </div>
        <div className="space-y-3">
          <label htmlFor="durationMinutes" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
            Duration (min)
          </label>
          <input
            type="number"
            id="durationMinutes"
            {...register("durationMinutes")}
            className={`input-shad !h-11 font-bold text-sm ${errors.durationMinutes ? "border-rose-500 ring-rose-500" : ""}`}
            placeholder="60"
          />
          {errors.durationMinutes && <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest ml-1 shake">{errors.durationMinutes.message}</p>}
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="imageUrl" className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
          Visual Identity Link (Optional)
        </label>
        <input
          type="url"
          id="imageUrl"
          {...register("imageUrl")}
          placeholder="https://assets.servcore.com/..."
          className="input-shad !h-11 font-medium text-xs text-zinc-400"
        />
      </div>

      <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-50">
        <button type="button" onClick={onCancel} className="btn-shad-outline h-11 px-6 text-[10px] font-black uppercase tracking-widest">Cancel</button>
        <button type="submit" className="btn-shad-primary h-11 px-10 text-[10px] font-black uppercase tracking-widest shadow-lg">
          {service ? "Commit Changes" : "Create Definition"}
        </button>
      </div>
    </form>
  );
};

export default ServiceForm;
