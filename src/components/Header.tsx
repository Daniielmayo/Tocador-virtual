import React from 'react';
import { useVanity } from '../context/VanityContext';

interface HeaderProps {
  subtitle?: string;
  onBack?: () => void;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  subtitle = 'Mi Tocador',
  onBack,
  showBack = false,
  rightAction,
}) => {
  const { user, setCurrentTab } = useVanity();

  return (
    <header className="fixed top-0 w-full z-40 bg-[#fff8f7]/85 backdrop-blur-xl border-b border-[#dac0c5]/20 shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="max-w-md mx-auto h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#554246] hover:text-[#9c385b] active:scale-95 transition-all"
              aria-label="Volver"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
          )}

          <div
            onClick={() => setCurrentTab('tocador')}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            {/* Vanity Icon */}
            <div className="w-8 h-8 rounded-lg bg-[#261819] flex items-center justify-center text-[#d4a574] shadow-sm">
              <span className="font-headline font-bold text-[14px] italic">V</span>
            </div>
            <div className="flex flex-col">
              <span className="font-headline text-[22px] tracking-tight text-[#9c385b] leading-none">
                Vanity
              </span>
              <span className="text-[11px] font-semibold text-[#554246] tracking-wide leading-tight">
                {subtitle}
              </span>
            </div>
          </div>
        </div>

        {/* Right side icons */}
        <div className="flex items-center gap-2">
          {rightAction ? (
            rightAction
          ) : (
            <>
              <button
                onClick={() => setCurrentTab('perfil')}
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#554246] hover:text-[#9c385b] transition-colors relative active:scale-95"
                title="Notificaciones de belleza"
              >
                <span className="material-symbols-outlined text-[22px]">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#9c385b] ring-2 ring-[#fff8f7]"></span>
              </button>

              <button
                onClick={() => setCurrentTab('perfil')}
                className="relative flex items-center justify-center p-0.5 rounded-full hover:opacity-90 active:scale-95 transition-all"
                title="Ver Perfil"
              >
                <img
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#79542b]/40 shadow-sm"
                  src={
                    user?.photoURL ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuBqmhkchV3JUBDu8vFUodavOCCVHNymhhfU4aSG3QQOGXjE-8mwTcs8z0FOccTE4eeiyeBvRhqYigj5E8vMWMkOMhjUfeO12nEBW_Mh3FLufFy3_1idNvAmgowIiXULR73udPHz9dn3mpqGwfTJrQiLHqGgAWJc7HxbEMViD2g6mrnTj83s56T2cn7vEdADLuBLmIo-1rJgrAaXaM6J6ggw6Zu6d1bpA7cxfacYsbcM3b8lFCAeGzVrYA'
                  }
                  referrerPolicy="no-referrer"
                />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
