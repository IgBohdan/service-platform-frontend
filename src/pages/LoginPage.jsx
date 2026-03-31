import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../features/auth/useAuth";

const loginSchema = z.object({
  email: z.string().email("Некоректна адреса електронної пошти"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const response = await login(data);
    if (response.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="w-full max-w-[400px] animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-zinc-950 text-zinc-50 mb-6 shadow-xl ring-1 ring-white/10">
            <span className="font-black text-xl tracking-tighter">S</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950 uppercase">ServCore</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-2 font-bold uppercase tracking-widest">Автономна Операційна Оболонка</p>
        </div>

        <div className="card shadow-2xl border-zinc-200">
          <form className="card-content p-6 md:p-10 space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                Ідентифікатор Доступу
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                placeholder="identity@servcore.sys"
                {...registerForm("email")}
              />
              {errors.email && (
                <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                    <label htmlFor="password" title="password" className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.2em]">
                        Шифр Доступу
                    </label>
                    <button type="button" className="text-[9px] md:text-[10px] font-black text-zinc-300 hover:text-zinc-950 transition-colors uppercase tracking-widest">Відновити?</button>
                </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                placeholder="••••••••"
                {...registerForm("password")}
              />
              {errors.password && (
                <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">
                  {errors.password.message}
                </p>
              )}
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-100 p-4 md:p-5 animate-in slide-in-from-top-2">
                <div className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-rose-500 shrink-0"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                  <p className="text-[9px] md:text-[10px] font-black text-rose-600 uppercase tracking-widest leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-shad-primary h-12 md:h-14 text-xs md:text-sm font-black uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all"
            >
              {isLoading ? "Перевірка Протоколу..." : "Увійти в Систему"}
            </button>

            <div className="text-center pt-2">
                <p className="text-[10px] md:text-xs text-zinc-400 font-bold uppercase tracking-widest leading-loose">
                    Немає акаунту?{" "}
                    <Link to="/register" className="text-zinc-950 font-black hover:underline underline-offset-4 decoration-2">Створити Профіль &rarr;</Link>
                </p>
            </div>
          </form>
        </div>

        <p className="mt-12 md:mt-16 text-center text-zinc-300 text-[9px] md:text-[10px] font-black uppercase tracking-[0.6em]">
            &copy; 2026 ServCore Systems Group.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
