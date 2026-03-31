import { useUsers, useUpdateUser } from "../features/users/users.queries";

const UsersPage = () => {
    const { data: users = [], isLoading, error } = useUsers();
    const updateUserMutation = useUpdateUser();

    const handleRoleChange = (id, newRole) => {
        updateUserMutation.mutate({ id, role: newRole });
    };

    if (isLoading) return (
        <div className="flex items-center justify-center min-h-[500px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-zinc-950 border-opacity-20"></div>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center animate-in shake">
            <p className="badge-shad bg-rose-50 border-rose-100 text-rose-600 font-black uppercase tracking-widest px-8 py-4">Auth Node Fault: {error.message || "Credential buffer unreachable."}</p>
        </div>
    );

    return (
        <div className="flex flex-col gap-8 md:gap-12 animate-in fade-in duration-500 max-w-full">
            {/* Header Block */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-900">Користувачі</h1>
                    <p className="text-sm text-zinc-500 mt-1">Керування правами доступу та параметрами акаунтів персоналу.</p>
                </div>
                <div className="flex items-center gap-3 bg-white border border-zinc-200 rounded-xl px-5 py-3 shadow-sm group hover:shadow-md transition-shadow">
                    <div className="text-right">
                        <span className="block text-[8px] font-black text-zinc-300 uppercase tracking-widest leading-none mb-1">Authenticated Node</span>
                        <span className="text-[10px] font-black text-zinc-950 uppercase tracking-tighter">System Level: {users.length}</span>
                    </div>
                </div>
            </div>

            {/* Immersive Data Block */}
            <div className="card shadow-2xl border-zinc-200/50 overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="table-shad min-w-[700px] md:min-w-full">
                        <thead>
                            <tr className="border-b border-zinc-100 bg-zinc-50/50">
                                <th className="p-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Акаунт / Ідентифікатор</th>
                                <th className="p-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Рівень Доступу</th>
                                <th className="p-5 text-left text-[10px] font-black text-zinc-400 uppercase tracking-widest">Протокол</th>
                                <th className="p-5 text-right text-[10px] font-black text-zinc-400 uppercase tracking-widest">Керування</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length > 0 ? users.map((u) => (
                                <tr key={u.id} className="group hover:bg-zinc-50/50 transition-colors">
                                    <td className="!pl-10 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-950 flex items-center justify-center font-bold text-zinc-50 text-[11px] shadow-lg group-hover:scale-110 transition-transform">
                                                {u.email?.[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="block font-black text-zinc-950 text-sm tracking-tighter hover:underline cursor-pointer">{u.email}</span>
                                                <span className="text-[10px] text-zinc-400 font-bold tracking-widest uppercase opacity-40">NODE ID# {u.id.slice(-6)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className="relative w-40 group/select">
                                            <select
                                                disabled={updateUserMutation.isLoading}
                                                value={u.role}
                                                onChange={(e) => handleRoleChange(u.id, e.target.value)}
                                                className="input-shad !h-10 !px-4 !py-0 !bg-zinc-100 !border-transparent hover:!bg-zinc-950 hover:!text-white appearance-none font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer shadow-inner"
                                            >
                                                <option value="client">Клієнт</option>
                                                <option value="employee">Співробітник</option>
                                                <option value="manager">Менеджер</option>
                                                <option value="admin">Адмін</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400 group-hover/select:text-white transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-5">
                                        <div className={`badge-shad text-[9px] font-black tracking-widest ${u.isActive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}>
                                            {u.isActive ? "АКТИВНИЙ" : "ЗАБЛОКОВАНИЙ"}
                                        </div>
                                    </td>
                                    <td className="text-right pr-6 md:pr-10 py-5">
                                        <div className="flex items-center justify-end gap-3">
                                            <button className="p-2 text-zinc-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Видалити">
                                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="py-24 text-center text-[10px] font-black uppercase text-zinc-300 tracking-[0.4em]">Auth Repository Empty</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            {/* System Intelligence Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 group hover:opacity-100 transition-opacity">
                 <div className="p-6 border border-zinc-200 rounded-3xl flex flex-col items-center text-center gap-3">
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-950 w-3/4 animate-pulse"></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Memory Integrity: 99.2%</p>
                 </div>
                 <div className="p-6 border border-zinc-200 rounded-3xl flex flex-col items-center text-center gap-3">
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-950 w-1/2 animate-pulse"></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Node Sync: Normal</p>
                 </div>
                 <div className="p-6 border border-zinc-200 rounded-3xl flex flex-col items-center text-center gap-3">
                    <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-950 w-full animate-pulse"></div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Traffic Latency: 4ms</p>
                 </div>
            </div>
        </div>
    );
};

export default UsersPage;
