import React, { useState } from 'react';
import { useVanity } from '../context/VanityContext';
import { ProductCard } from './ProductCard';

export const WishlistView: React.FC = () => {
  const { products, updateProduct, setCurrentTab, showToast } = useVanity();
  const [subTab, setSubTab] = useState<'favoritos' | 'reponer'>('favoritos');

  const favoriteProducts = products.filter((p) => p.isFavorite);
  const outOfStockProducts = products.filter(
    (p) => p.status === 'agotado' || p.status === 'por_reponer'
  );

  const displayedProducts =
    subTab === 'favoritos' ? favoriteProducts : outOfStockProducts;

  return (
    <div className="flex flex-col w-full pb-28 space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee1e4] text-[#9c385b] text-[11px] font-bold w-fit shadow-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px]">favorite</span>
          <span>LISTA DE AMOR & REPOSICIÓN</span>
        </div>

        <h1 className="font-headline text-[30px] font-semibold text-[#261819] leading-tight">
          Tesoros Favoritos
        </h1>
        <p className="text-[13.5px] text-[#554246]">
          Guarda tus fórmulas imprescindibles y supervisa los productos agotados que necesitas reponer.
        </p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center p-1 bg-[#ffe9ea] rounded-full shadow-inner border border-[#dac0c5]/30">
        <button
          onClick={() => setSubTab('favoritos')}
          className={`flex-1 py-2 px-3 rounded-full text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'favoritos'
              ? 'bg-[#9c385b] text-white shadow-sm'
              : 'text-[#554246] hover:text-[#9c385b]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[17px]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <span>Favoritos ({favoriteProducts.length})</span>
        </button>

        <button
          onClick={() => setSubTab('reponer')}
          className={`flex-1 py-2 px-3 rounded-full text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 ${
            subTab === 'reponer'
              ? 'bg-[#9c385b] text-white shadow-sm'
              : 'text-[#554246] hover:text-[#9c385b]'
          }`}
        >
          <span className="material-symbols-outlined text-[17px]">shopping_bag</span>
          <span>Por Reponer ({outOfStockProducts.length})</span>
        </button>
      </div>

      {/* Grid de Productos */}
      {displayedProducts.length === 0 ? (
        <div className="w-full py-12 px-4 rounded-3xl bg-white border border-[#dac0c5]/30 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-[#fee1e4] text-[#9c385b] flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">
              {subTab === 'favoritos' ? 'favorite_border' : 'done_all'}
            </span>
          </div>
          <p className="font-headline text-[18px] text-[#261819]">
            {subTab === 'favoritos'
              ? 'Aún no tienes favoritos marcados'
              : '¡Tu tocador está completo! No hay productos agotados.'}
          </p>
          <button
            onClick={() => setCurrentTab('tocador')}
            className="px-4 py-2 rounded-full bg-[#9c385b] text-white text-[12px] font-bold shadow-sm"
          >
            Explorar Tocador
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {displayedProducts.map((p) => (
            <div key={p.id} className="relative flex flex-col">
              <ProductCard product={p} />
              {p.status === 'agotado' && (
                <button
                  onClick={() => {
                    updateProduct(p.id, { status: 'en_uso' });
                    showToast(`"${p.name}" marcado como repuesto en uso ✨`);
                  }}
                  className="mt-1.5 w-full py-1.5 rounded-xl bg-[#fee1e4] hover:bg-[#fda7b0] text-[#9c385b] text-[11px] font-bold flex items-center justify-center gap-1 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">check</span>
                  <span>Marcar como repuesto</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
