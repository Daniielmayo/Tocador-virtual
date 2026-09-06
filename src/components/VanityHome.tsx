import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVanity } from '../context/VanityContext';
import { COSMETIC_CATEGORIES } from '../data/initialData';
import { ProductCard } from './ProductCard';

export const VanityHome: React.FC = () => {
  const {
    products,
    brands,
    user,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    brandFilter,
    setBrandFilter,
    statusFilter,
    setStatusFilter,
    favoritesOnly,
    setFavoritesOnly,
    setCurrentTab,
    setSelectedProductId,
    setIsDailyRoutineOpen,
    showToast,
    categories,
  } = useVanity();

  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // Dynamic counts
  const totalCount = products.length;
  const outOfStockCount = products.filter(
    (p) => p.status === 'agotado' || p.status === 'por_reponer'
  ).length;

  // Filtered products
  const filteredProducts = products.filter((item) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchBrand = item.brandName.toLowerCase().includes(q);
      const matchShade = item.shadeName.toLowerCase().includes(q);
      const matchFinish = item.finish.toLowerCase().includes(q);
      const matchCat = item.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchShade && !matchFinish && !matchCat) return false;
    }

    // 2. Category Filter
    if (categoryFilter !== 'all') {
      if (item.category.toLowerCase() !== categoryFilter.toLowerCase()) return false;
    }

    // 3. Brand Filter
    if (brandFilter !== 'all') {
      if (item.brandName.toLowerCase() !== brandFilter.toLowerCase()) return false;
    }

    // 4. Status Filter
    if (statusFilter !== 'all') {
      if (item.status !== statusFilter) return false;
    }

    // 5. Favorites Only
    if (favoritesOnly && !item.isFavorite) {
      return false;
    }

    return true;
  });

  const userName = user?.displayName ? user.displayName.split(' ')[0] : 'Sofía';

  return (
    <div className="flex flex-col w-full pb-28 space-y-5">
      {/* Saludo & Encabezado Cálido */}
      <section className="flex flex-col space-y-1 pt-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="font-headline text-[26px] font-semibold text-[#261819] tracking-tight">
              Hola, {userName}
            </h2>
            <span className="text-[#d4a574] text-lg select-none animate-pulse">✨</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fda7b0]/35 text-[#3a0813] text-[11px] font-bold shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9c385b] animate-ping"></span>
            Al día
          </span>
        </div>
        <p className="text-[13.5px] text-[#554246] flex items-center gap-2">
          <span>{totalCount} tesoros en tu tocador</span>
        </p>
      </section>

      {/* Barra de Búsqueda Intuitiva */}
      <section className="relative w-full">
        <div className="relative flex items-center bg-white rounded-full shadow-[0_4px_16px_-2px_rgba(61,44,46,0.06)] border border-[#dac0c5]/30 transition-all focus-within:shadow-[0_4px_20px_rgba(156,56,91,0.15)] focus-within:border-[#9c385b]">
          <span className="material-symbols-outlined absolute left-4 text-[#877176] text-[20px] select-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-12 bg-transparent text-[14px] text-[#261819] placeholder:text-[#877176]/70 focus:outline-none"
            placeholder="Buscar por nombre, tono, fórmula..."
            type="text"
          />
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 w-7 h-7 rounded-full flex items-center justify-center text-[#877176] hover:text-[#261819]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          ) : (
            <button
              onClick={() => {
                showToast('Escáner de tono & código de barras listo');
                setCurrentTab('anadir');
              }}
              className="absolute right-2.5 w-8 h-8 rounded-full flex items-center justify-center bg-[#fee1e4] text-[#9c385b] hover:bg-[#fda7b0] transition-colors"
              title="Escanear código de barras o swatch"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">photo_camera</span>
            </button>
          )}
        </div>
      </section>

      {/* Categorías: Carrusel Horizontal Interactivo */}
      <section className="w-full -mx-4 px-4 overflow-x-auto no-scrollbar scroll-smooth">
        <div className="flex items-center space-x-2 py-1 min-w-max">
          {/* Merge static categories with user-created dynamic ones */}
          {(() => {
            const staticIds = COSMETIC_CATEGORIES.map((c) => c.id);
            const dynamicCats = categories
              .filter((cat) => !staticIds.includes(cat))
              .map((cat) => ({
                id: cat,
                label: cat.charAt(0).toUpperCase() + cat.slice(1),
                icon: 'category',
              }));
            const allCats = [...COSMETIC_CATEGORIES, ...dynamicCats];
            return allCats;
          })().map((cat) => {
            const isActive = categoryFilter === cat.id;
            const count =
              cat.id === 'all'
                ? products.length
                : products.filter((p) => p.category.toLowerCase() === cat.id.toLowerCase())
                    .length;

            return (
              <button
                key={cat.id}
                onClick={() => setCategoryFilter(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-full transition-all active:scale-95 shadow-sm text-[13px] font-semibold ${
                  isActive
                    ? 'bg-[#9c385b] text-white shadow-[#9c385b]/20'
                    : 'bg-white text-[#554246] hover:bg-[#fee1e4]/60 border border-[#dac0c5]/25'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isActive ? 'text-white' : 'text-[#9c385b]'
                  }`}
                >
                  {cat.icon}
                </span>
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                    isActive ? 'bg-white/25 text-white' : 'bg-[#ffe9ea] text-[#9c385b]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Filtros Rápidos y Toggle de Favoritos */}
      <section className="flex items-center justify-between gap-2 overflow-visible py-1 relative">
        <div className="flex items-center gap-2">
          {/* Selector Marca */}
          <div className="relative">
            <button
              onClick={() => {
                setShowBrandDropdown(!showBrandDropdown);
                setShowStatusDropdown(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#261819] text-[11px] font-medium shadow-sm border border-[#dac0c5]/25 hover:bg-[#ffe9ea] transition-all"
            >
              <span className="text-[#79542b]">Marca:</span>
              <span className="font-bold truncate max-w-[70px]">
                {brandFilter === 'all' ? 'Todas' : brandFilter}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#877176]">
                expand_more
              </span>
            </button>

            {showBrandDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-44 bg-white rounded-2xl shadow-xl border border-[#dac0c5]/30 z-30 p-1.5 flex flex-col gap-1 max-h-56 overflow-y-auto">
                <button
                  onClick={() => {
                    setBrandFilter('all');
                    setShowBrandDropdown(false);
                  }}
                  className={`px-3 py-1.5 text-left text-[12px] rounded-xl font-medium ${
                    brandFilter === 'all'
                      ? 'bg-[#9c385b] text-white'
                      : 'hover:bg-[#ffe9ea] text-[#261819]'
                  }`}
                >
                  Todas las marcas
                </button>
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => {
                      setBrandFilter(b.name);
                      setShowBrandDropdown(false);
                    }}
                    className={`px-3 py-1.5 text-left text-[12px] rounded-xl font-medium truncate ${
                      brandFilter === b.name
                        ? 'bg-[#9c385b] text-white'
                        : 'hover:bg-[#ffe9ea] text-[#261819]'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Selector Estado */}
          <div className="relative">
            <button
              onClick={() => {
                setShowStatusDropdown(!showStatusDropdown);
                setShowBrandDropdown(false);
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-[#261819] text-[11px] font-medium shadow-sm border border-[#dac0c5]/25 hover:bg-[#ffe9ea] transition-all"
            >
              <span className="text-[#79542b]">Estado:</span>
              <span className="font-bold">
                {statusFilter === 'all'
                  ? 'Todos'
                  : statusFilter === 'en_uso'
                  ? 'En uso'
                  : statusFilter === 'nuevo'
                  ? 'Nuevo'
                  : 'Agotado'}
              </span>
              <span className="material-symbols-outlined text-[16px] text-[#877176]">
                expand_more
              </span>
            </button>

            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1.5 w-36 bg-white rounded-2xl shadow-xl border border-[#dac0c5]/30 z-30 p-1.5 flex flex-col gap-1">
                {[
                  { id: 'all', label: 'Todos' },
                  { id: 'en_uso', label: 'En uso' },
                  { id: 'nuevo', label: 'Nuevo' },
                  { id: 'agotado', label: 'Agotado' },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => {
                      setStatusFilter(st.id);
                      setShowStatusDropdown(false);
                    }}
                    className={`px-3 py-1.5 text-left text-[12px] rounded-xl font-medium ${
                      statusFilter === st.id
                        ? 'bg-[#9c385b] text-white'
                        : 'hover:bg-[#ffe9ea] text-[#261819]'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Switch Favoritos */}
        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full shadow-sm active:scale-95 transition-all text-[11px] font-bold ${
            favoritesOnly
              ? 'bg-[#9c385b] text-white shadow-[#9c385b]/20'
              : 'bg-white text-[#261819] border border-[#dac0c5]/25'
          }`}
        >
          <span
            className={`material-symbols-outlined text-[18px] ${
              favoritesOnly ? 'text-white' : 'text-[#9c385b]'
            }`}
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
          <span>Favoritos</span>
        </button>
      </section>

      {/* Vitrina de Productos (2 Column Grid) */}
      <section className="pt-1">
        {filteredProducts.length === 0 ? (
          <div className="w-full py-12 px-4 rounded-3xl bg-white border border-[#dac0c5]/30 text-center flex flex-col items-center justify-center space-y-3 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-[#ffe9ea] text-[#9c385b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">search_off</span>
            </div>
            <p className="font-headline text-[18px] text-[#261819]">No se encontraron cosméticos</p>
            <p className="text-[13px] text-[#554246] max-w-xs">
              Prueba cambiando los filtros o añade una nueva joya a tu tocador.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setCategoryFilter('all');
                setBrandFilter('all');
                setStatusFilter('all');
                setFavoritesOnly(false);
              }}
              className="px-4 py-2 rounded-full bg-[#fee1e4] text-[#9c385b] text-[12px] font-bold active:scale-95 transition-transform"
            >
              Restablecer filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={() => setSelectedProductId(product.id)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Tarjeta Banner Tips & Inspiración Editorial */}
      <section className="p-4 rounded-2xl bg-gradient-to-r from-[#fee1e4] via-[#ffe9ea] to-[#fda7b0]/25 border border-[#dac0c5]/30 flex items-center justify-between shadow-sm">
        <div className="flex flex-col max-w-[72%] space-y-1">
          <div className="flex items-center gap-1.5 text-[#9c385b]">
            <span className="material-symbols-outlined text-[18px]">routine</span>
            <span className="text-[10.5px] uppercase tracking-wider font-bold">Rutina del día</span>
          </div>
          <p className="font-headline text-[16px] text-[#261819] font-semibold leading-tight">
            Glow Natural & Duradero
          </p>
          <p className="text-[12px] text-[#554246] leading-relaxed">
            Combina tu Flawless Filter con Soft Pinch Blush para un acabado luminoso de pasarela.
          </p>
        </div>
        <button
          onClick={() => setIsDailyRoutineOpen(true)}
          className="w-12 h-12 rounded-full bg-[#9c385b] text-white flex items-center justify-center shadow-md cursor-pointer hover:scale-105 active:scale-95 transition-transform flex-shrink-0"
          title="Ver paso a paso de la rutina"
        >
          <span className="material-symbols-outlined text-[24px]">play_arrow</span>
        </button>
      </section>
    </div>
  );
};
