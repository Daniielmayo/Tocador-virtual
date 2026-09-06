import React from 'react';
import { useVanity } from '../context/VanityContext';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, setSelectedProductId, setEditingProduct } = useVanity();

  const handleTabClick = (tab: any) => {
    setSelectedProductId(null);
    setEditingProduct(null);
    setCurrentTab(tab);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#fff8f7]/90 backdrop-blur-xl border-t border-[#dac0c5]/20 shadow-[0_-8px_24px_-2px_rgba(61,44,46,0.04)] pb-[env(safe-area-inset-bottom,0px)]">
      <div className="max-w-md mx-auto flex items-center justify-around h-16 px-2 relative">
        {/* Tocador Tab */}
        <button
          onClick={() => handleTabClick('tocador')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all active:scale-90 ${
            currentTab === 'tocador'
              ? 'text-[#9c385b] font-bold'
              : 'text-[#554246] hover:text-[#9c385b]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'tocador' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            inventory_2
          </span>
          <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Tocador</span>
        </button>

        {/* Marcas Tab */}
        <button
          onClick={() => handleTabClick('marcas')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all active:scale-90 ${
            currentTab === 'marcas'
              ? 'text-[#9c385b] font-bold'
              : 'text-[#554246] hover:text-[#9c385b]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'marcas' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            auto_awesome
          </span>
          <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Marcas</span>
        </button>

        {/* Floating Center (+) Add Button */}
        <div className="relative -top-3 flex items-center justify-center">
          <button
            onClick={() => handleTabClick('anadir')}
            aria-label="Añadir nuevo producto"
            className="w-13 h-13 rounded-full bg-[#9c385b] text-white flex items-center justify-center shadow-[0_4px_16px_-2px_rgba(61,44,46,0.25),0_2px_8px_rgba(156,56,91,0.4)] hover:bg-[#852a4a] hover:scale-105 active:scale-90 transition-all ring-4 ring-[#fff8f7]"
          >
            <span className="material-symbols-outlined text-2xl font-bold">add</span>
          </button>
        </div>

        {/* Deseos Tab */}
        <button
          onClick={() => handleTabClick('deseos')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all active:scale-90 ${
            currentTab === 'deseos'
              ? 'text-[#9c385b] font-bold'
              : 'text-[#554246] hover:text-[#9c385b]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'deseos' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
          <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Deseos</span>
        </button>

        {/* Perfil Tab */}
        <button
          onClick={() => handleTabClick('perfil')}
          className={`flex flex-col items-center justify-center w-14 h-12 transition-all active:scale-90 ${
            currentTab === 'perfil'
              ? 'text-[#9c385b] font-bold'
              : 'text-[#554246] hover:text-[#9c385b]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={{
              fontVariationSettings: currentTab === 'perfil' ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            person
          </span>
          <span className="text-[11px] font-semibold mt-0.5 tracking-tight">Perfil</span>
        </button>
      </div>
    </nav>
  );
};
