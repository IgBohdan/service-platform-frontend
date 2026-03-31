import { useState, useEffect } from "react";

const RoleWelcomeGuide = ({ role }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Load visibility from localStorage to persistent dismiss
  useEffect(() => {
    const hidden = localStorage.getItem(`hide_welcome_${role}`);
    if (hidden) setIsVisible(false);
  }, [role]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`hide_welcome_${role}`, "true");
  };

  if (!isVisible) return null;

  const getGuide = () => {
    switch (role) {
      case "owner":
        return {
          title: "ТЕРМІНАЛ ВЛАСНИКА (ALPHA CORE)",
          description: "Ви маєте абсолютний контроль над екосистемою ServCore.",
          steps: [
            { icon: "📈", text: "Моніторте доходи та конверсію у вкладці 'Аналітика'." },
            { icon: "👥", text: "Керуйте рівнями доступу всієї команди в розділі 'Користувачі'." },
            { icon: "🌐", text: "Отримуйте глобальний огляд усіх операцій на головній панелі." }
          ]
        };
      case "admin":
        return {
          title: "ТЕРМІНАЛ АДМІНІСТРАТОРА (SYSTEM NODE)",
          description: "Ваше завдання - технічна стабільність та контроль персоналу.",
          steps: [
            { icon: "🔑", text: "Додавайте нових співробітників та призначайте їм ролі." },
            { icon: "🛡️", text: "Контролюйте безпеку вузлів та блокуйте доступ у разі потреби." },
            { icon: "⚙️", text: "Допомагайте менеджерам з технічними конфігураціями." }
          ]
        };
      case "manager":
        return {
          title: "ТЕРМІНАЛ МЕНЕДЖЕРА (BETA NODE)",
          description: "Ви відповідаєте за оперативну базу та клієнтський сервіс.",
          steps: [
            { icon: "📂", text: "Ведіть повний реєстр клієнтів та їхніх взаємодій." },
            { icon: "🛠️", text: "Налаштовуйте каталог послуг: ціни, тривалість та статуси." },
            { icon: "📅", text: "Координуйте розклад усієї команди для усунення накладок." }
          ]
        };
      case "master":
        return {
          title: "ТЕРМІНАЛ МАЙСТРА (GAMMA NODE)",
          description: "Пріоритетне виконання та керування власним часом.",
          steps: [
            { icon: "⏰", text: "Керуйте своїм робочим графіком через персональний календар." },
            { icon: "💬", text: "Використовуйте 'Чат' для узгодження технічних деталей з клієнтами." },
            { icon: "📊", text: "Відстежуйте власну статитстику виконаних робіт." }
          ]
        };
      case "employee":
        return {
          title: "ТЕРМІНАЛ СПІВРОБІТНИКА (DELTA NODE)",
          description: "Орієнтація на виконання завдань та тайм-менеджмент.",
          steps: [
            { icon: "📋", text: "Переглядайте список призначених вам сесій у 'Бронюваннях'." },
            { icon: "🔄", text: "Вчасно змінюйте статуси замовлень для звітності." },
            { icon: "🤝", text: "Залишайтеся на зв'язку з командою через внутрішній канал." }
          ]
        };
      case "client":
        return {
          title: "ІНТЕРФЕЙС ПАРТНЕРА (EXTERN NODE)",
          description: "Ваш центр самообслуговування та резервування.",
          steps: [
            { icon: "✨", text: "Замовляйте послуги через 'Протокол Нового Запису'." },
            { icon: "📜", text: "Переглядайте історію своїх замовлень та статус поточних." },
            { icon: "📩", text: "Зв'яжіться з нами через вбудований чат підтримки." }
          ]
        };
      default:
        return null;
    }
  };

  const guide = getGuide();
  if (!guide) return null;

  return (
    <div className="relative group animate-in slide-in-from-top-4 duration-500 mb-10 md:mb-14">
      {/* Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-100 rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
      
      <div className="relative card p-8 md:p-10 border-zinc-200 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        <button 
          onClick={handleDismiss}
          className="absolute top-6 right-6 p-2 text-zinc-300 hover:text-zinc-950 transition-colors"
          title="Сховати підказку"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center gap-10">
          <div className="lg:w-1/3">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-4 block">Вступний Протокол</span>
            <h2 className="text-2xl md:text-3xl font-black text-zinc-950 uppercase tracking-tighter mb-4 leading-none">
              {guide.title}
            </h2>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              {guide.description}
            </p>
          </div>

          <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-3 gap-6">
            {guide.steps.map((step, idx) => (
              <div key={idx} className="relative p-5 rounded-2xl bg-zinc-50 border border-zinc-100 group/item hover:bg-zinc-950 hover:border-zinc-950 transition-all duration-300">
                <div className="text-2xl mb-4 group-hover/item:scale-110 transition-transform">{step.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed text-zinc-500 group-hover/item:text-zinc-300">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleWelcomeGuide;
