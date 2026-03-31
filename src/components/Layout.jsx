import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/useAuth";

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const isAdmin = ["admin", "manager", "owner"].includes(user?.role);
    const isEmployee = ["employee", "master"].includes(user?.role);
    const isClient = user?.role === "client";

    const navItems = [
        {
            name: "Панель",
            path: "/dashboard",
            roles: ["owner", "admin", "manager", "employee", "master", "client"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
        },
        {
            name: "Бронювання",
            path: "/bookings",
            roles: ["owner", "admin", "manager", "employee", "master", "client"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
        },
        {
            name: "Розклад",
            path: "/schedule",
            roles: ["owner", "admin", "manager", "employee", "master"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v4" /><path d="m15 15-3-3" /><circle cx="12" cy="12" r="10" /></svg>
        },
        {
            name: "Клієнти",
            path: "/customers",
            roles: ["owner", "admin", "manager"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
        },
        {
            name: "Послуги",
            path: "/services",
            roles: ["owner", "admin", "manager"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5" /><path d="M12 22V12" /></svg>
        },
        {
            name: "Аналітика",
            path: "/analytics",
            roles: ["owner", "admin", "manager"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></svg>
        },
        {
            name: "Персонал",
            path: "/users",
            roles: ["owner", "admin"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
        },
        {
            name: "Безпечний Чат",
            path: "/chat",
            roles: ["owner", "admin", "manager", "employee", "master", "client"],
            icon: <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
        }
    ];

    const filteredNavItems = navItems.filter(item => !item.roles || item.roles.includes(user?.role));
    const currentPageName = navItems.find(i => location.pathname.startsWith(i.path))?.name || "Огляд Платформи";

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden subpixel-antialiased">
            {/* Professional Sidebar Area */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-zinc-200 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Brand Identifier */}
                    <div className="h-20 flex items-center px-8 border-b border-zinc-50">
                        <Link to="/" className="flex items-center gap-3.5 group">
                            <div className="h-9 w-9 rounded-xl bg-zinc-950 flex items-center justify-center text-zinc-50 shadow-2xl group-hover:scale-105 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22V8" /><path d="m5 12 7-7 7 7" /></svg>
                            </div>
                            <div>
                                <h1 className="text-sm font-black text-zinc-950 uppercase tracking-tighter leading-none">ServCore</h1>
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">ОС Платформи</p>
                            </div>
                        </Link>
                    </div>

                    {/* Industrial Navigation Stream */}
                    <nav className="flex-1 overflow-y-auto py-8 px-4 custom-scrollbar">
                        <div className="space-y-1.5">
                            {filteredNavItems.map((item) => {
                                const isActive = location.pathname.startsWith(item.path);
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        onClick={() => setSidebarOpen(false)}
                                        className={`flex items-center gap-4 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${isActive
                                            ? "bg-zinc-950 text-white shadow-xl shadow-zinc-200 translate-x-1"
                                            : "text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50"
                                            }`}
                                    >
                                        <span className={isActive ? "text-white" : "text-zinc-300"}>{item.icon}</span>
                                        {item.name}
                                        {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white opacity-50 animate-pulse"></div>}
                                    </Link>
                                );
                            })}
                        </div>
                    </nav>

                    {/* Unified User Terminal */}
                    <div className="p-6 border-t border-zinc-50 bg-white/50 backdrop-blur-sm">
                        <div className="p-4 rounded-2xl border border-zinc-100 bg-white flex items-center gap-4 shadow-sm group hover:shadow-md transition-shadow">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-zinc-950 flex items-center justify-center font-bold text-zinc-50 text-sm shadow-inner group-hover:scale-105 transition-transform">
                                {user?.email?.[0].toUpperCase() || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-[10px] font-black text-zinc-950 uppercase tracking-wider truncate mb-0.5">{user?.email?.split('@')[0]}</h4>
                                <div className="flex items-center gap-1.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Ранг: {user?.role}</span>
                                </div>
                            </div>
                            <button
                                onClick={logout}
                                className="h-8 w-8 rounded-lg flex items-center justify-center text-zinc-300 hover:text-rose-600 hover:bg-rose-50 transition-all border border-transparent hover:border-rose-100"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Platform Control Viewport */}
            <div className="flex-1 flex flex-col min-w-0 bg-zinc-50 relative overflow-hidden">
                {/* Visual Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-[500px] bg-gradient-to-l from-white/50 to-transparent pointer-events-none"></div>

                {/* High-Fidelity Header */}
                <header className="h-20 shrink-0 flex items-center justify-between px-8 lg:px-12 bg-white/80 backdrop-blur-2xl border-b border-zinc-100 z-40">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 text-zinc-950 bg-zinc-100 rounded-xl"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                        </button>

                        <div className="hidden sm:flex flex-col">
                            <h2 className="text-[11px] font-black text-zinc-950 uppercase tracking-[0.2em] opacity-80">{currentPageName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-[8px] font-black text-zinc-300 uppercase underline decoration-zinc-200 underline-offset-4">ServCore v2.4</span>
                                <div className="w-1 h-1 rounded-full bg-zinc-200"></div>
                                <span className="text-[8px] font-black text-zinc-300 uppercase">Операційний Протокол</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 md:gap-8">
                        {/* Universal Actions Area */}
                        <div className="hidden md:flex items-center gap-2">
                            {isAdmin && (
                                <button
                                    onClick={() => navigate('/bookings')}
                                    className="btn-shad-primary !h-10 !px-6 !text-[10px] shadow-lg shadow-zinc-200"
                                >
                                    Швидкий Запис
                                </button>
                            )}
                        </div>

                        {/* Identity Indicators */}
                        <div className="flex items-center gap-3">
                            <button className="h-10 w-10 flex items-center justify-center text-zinc-400 hover:text-zinc-950 hover:bg-zinc-50 rounded-xl transition-all border border-transparent hover:border-zinc-100 relative group">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
                                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded-full group-hover:scale-125 transition-transform"></span>
                            </button>
                            <div className="h-8 w-px bg-zinc-100"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden md:block">
                                    <p className="text-[10px] font-black text-zinc-900 uppercase tracking-tighter leading-none mb-0.5">Вузол {user?.role}</p>
                                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">Статус: Захищено</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Primary Content Scrollway */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="mx-auto max-w-[1400px] p-4 lg:p-8 xl:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Operational Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm lg:hidden transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default Layout;
