import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../features/auth/useAuth";

const registerSchema = z.object({
  email: z.string().email("Некоректна адреса електронної пошти"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
  confirmPassword: z.string().min(6, "Пароль має містити щонайменше 6 символів"),

}).refine((data) => data.password === data.confirmPassword, {
  message: "Паролі не збігаються",
  path: ["confirmPassword"],
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: registerUser, isLoading, error } = useAuth();

  const {
    register: registerForm,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "client",
    }
  });

  const onSubmit = async (data) => {
    const { confirmPassword, ...registerData } = data;
    const response = await registerUser(registerData);
    if (response.success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4 md:p-8 animate-in fade-in duration-700">
      <div className="w-full max-w-[440px] animate-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col items-center text-center mb-10 md:mb-12">
          <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-zinc-950 text-zinc-50 mb-6 shadow-xl ring-1 ring-white/10">
            <span className="font-black text-xl tracking-tighter">S</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-950 uppercase">ServCore</h1>
          <p className="text-xs md:text-sm text-zinc-500 mt-2 font-bold uppercase tracking-widest">Протокол Реєстрації Вузла</p>
        </div>

        <div className="card shadow-2xl border-zinc-200">
          <form className="card-content p-6 md:p-10 space-y-6 md:space-y-8" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-3">
              <label htmlFor="email" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">
                Електронна Пошта
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                placeholder="name@servcore.sys"
                {...registerForm("email")}
              />
              {errors.email && (
                <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">{errors.email.message}</p>
              )}
            </div>

            <div className="hidden grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-4">
              <div className="space-y-3">
                <label htmlFor="firstName" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Ім'я</label>
                <input
                  id="firstName"
                  className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                  placeholder="Системне"
                  {...registerForm("firstName")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">{errors.firstName.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="lastName" className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Прізвище</label>
                <input
                  id="lastName"
                  className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                  placeholder="Системне"
                  {...registerForm("lastName")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-4">
              <div className="space-y-3">
                <label htmlFor="password" title="password" className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                  Security Key
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                  placeholder="Min. 6..."
                  {...registerForm("password")}
                />
                {errors.password && (
                  <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label htmlFor="confirmPassword" title="confirm password" className="text-[10px] md:text-xs font-black text-zinc-400 uppercase tracking-[0.2em] ml-1">
                  Verify Cipher
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className="input-shad !h-11 md:!h-12 font-bold text-sm tracking-tight"
                  placeholder="Repeat key"
                  {...registerForm("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-rose-500 text-[9px] font-black uppercase tracking-widest ml-1 animate-in shake">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-rose-50 border border-rose-100 p-4 md:p-5 animate-in slide-in-from-top-2">
                <p className="text-[10px] font-black text-rose-600 text-center uppercase tracking-widest leading-relaxed">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-shad-primary h-14 text-sm font-black uppercase tracking-[0.2em] shadow-xl hover:shadow-2xl transition-all"
            >
              {isLoading ? "Авторизація..." : "Створити Акаунт"}
            </button>

            <div className="text-center">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
                Вже зареєстровані?{" "}
                <Link to="/login" className="text-zinc-950 font-black hover:underline underline-offset-4 decoration-2">Увійти &rarr;</Link>
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

export default RegisterPage;
