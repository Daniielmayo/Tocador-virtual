import React from 'react';
import { motion } from 'motion/react';
import { useVanity } from '../context/VanityContext';
import { ProductCard } from './ProductCard';
import { Brand } from '../types';

export const BrandsView: React.FC = () => {
  const {
    brands,
    products,
    selectedBrandId,
    setSelectedBrandId,
    setIsAddBrandModalOpen,
    setCurrentTab,
    setSelectedProductId,
    showToast,
  } = useVanity();

  const activeBrand: Brand =
    brands.find((b) => b.id === selectedBrandId) || brands[0] || {
      id: 'brand-rare-beauty',
      userId: 'default',
      name: 'Rare Beauty',
      creator: 'Selena Gomez',
      quote: 'Maquillaje pensado para celebrar la autenticidad y resaltar la belleza única de cada piel.',
      logoUrl: '',
      bannerUrl: '',
      specialty: 'Color & Swatches',
      isActiveCollection: true,
      productCount: 6,
      createdAt: '',
      updatedAt: '',
    };

  // Products belonging to the currently selected brand
  const brandProducts = products.filter(
    (p) =>
      p.brandId === activeBrand.id ||
      p.brandName.toLowerCase() === activeBrand.name.toLowerCase()
  );

  return (
    <div className="flex flex-col w-full gap-5 pb-28">
      {/* Selector de Pestañas Superiores */}
      <div className="flex items-center justify-between p-1 bg-[#ffe9ea] rounded-full shadow-inner border border-[#dac0c5]/30">
        <button
          className="flex-1 py-2 px-3 rounded-full bg-[#9c385b] text-white text-[13px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          onClick={() => showToast(`Mostrando tus ${brands.length} marcas registradas`)}
        >
          <span className="material-symbols-outlined text-[16px]">stars</span>
          <span>Mis Marcas ({brands.length})</span>
        </button>
        <button
          className="flex-1 py-2 px-3 rounded-full text-[#554246] hover:text-[#9c385b] text-[13px] font-semibold transition-all flex items-center justify-center gap-1.5"
          onClick={() => setIsAddBrandModalOpen(true)}
        >
          <span className="material-symbols-outlined text-[16px]">add_circle</span>
          <span>Añadir Marca</span>
        </button>
      </div>

      {/* Perfil Editorial de Marca Destacada */}
      <div className="flex flex-col rounded-3xl overflow-hidden bg-white shadow-[0_4px_16px_-2px_rgba(61,44,46,0.06)] border border-[#dac0c5]/25 relative">
        {/* Banner de Imagen Editorial */}
        <div className="relative h-44 w-full overflow-hidden bg-[#fee1e4]">
          <img
            className="w-full h-full object-cover"
            alt={activeBrand.name}
            src={activeBrand.bannerUrl}
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#261819]/80 via-[#261819]/25 to-transparent"></div>

          {/* Insignia Colección Verificada */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 py-1 px-2.5 rounded-full bg-[#fff8f7]/95 backdrop-blur-md text-[#261819] text-[11px] font-bold shadow-sm">
            <span
              className="material-symbols-outlined text-[#9c385b] text-[14px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
            <span>Colección Activa</span>
          </div>
        </div>

        {/* Contenido del Perfil */}
        <div className="flex flex-col px-4 pb-5 pt-0 relative">
          {/* Logo Circular con Marco Dorado e Indicador */}
          <div className="-mt-12 mb-2 flex items-end justify-between">
            <div className="relative">
              <div className="w-20 h-20 rounded-full p-1 bg-white shadow-md flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#ffe9ea] flex items-center justify-center overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    alt={`${activeBrand.name} logo`}
                    src={activeBrand.logoUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-[#79542b] text-white flex items-center justify-center text-[12px] shadow-sm">
                <span className="material-symbols-outlined text-[14px]">spa</span>
              </span>
            </div>

            {/* Indicador Tocador */}
            <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-[#fee1e4] text-[#9c385b] text-[11px] font-bold shadow-sm">
              <span
                className="material-symbols-outlined text-[15px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                inventory_2
              </span>
              <span>{brandProducts.length} productos en tocador</span>
            </div>
          </div>

          {/* Textos de Marca */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-headline text-[26px] font-semibold text-[#261819] leading-tight">
                {activeBrand.name}
              </h1>
              {activeBrand.creator && (
                <span className="text-[12px] text-[#554246]/80 font-normal pt-0.5">
                  por {activeBrand.creator}
                </span>
              )}
            </div>
            <p className="text-[13.5px] text-[#554246] italic leading-relaxed">
              "{activeBrand.quote || 'Fórmulas pensadas para resaltar la belleza única de cada piel.'}"
            </p>
          </div>

          {/* Botones de Acción de Marca */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              onClick={() => setIsAddBrandModalOpen(true)}
              className="h-11 px-3 rounded-full bg-[#fee1e4] hover:bg-[#f8dcde] text-[#8e4a53] text-[13px] font-bold flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>Editar Marca</span>
            </button>

            <button
              onClick={() => {
                setCurrentTab('anadir');
              }}
              className="h-11 px-3 rounded-full bg-[#9c385b] hover:bg-[#852a4a] text-white text-[13px] font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span>Añadir Producto</span>
            </button>
          </div>
        </div>
      </div>

      {/* Catálogo de Productos Registrados de la Marca */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="font-headline text-[18px] text-[#261819] font-semibold">
              Productos de {activeBrand.name}
            </span>
            <span className="w-5 h-5 rounded-full bg-[#fda7b0] text-[#3a0813] text-[11px] font-bold flex items-center justify-center">
              {brandProducts.length}
            </span>
          </div>

          <button
            onClick={() => showToast(`Filtrando catálogo de ${activeBrand.name}`)}
            className="text-[#9c385b] text-[13px] font-bold flex items-center gap-0.5 hover:underline"
          >
            <span>Filtrar</span>
            <span className="material-symbols-outlined text-[16px]">tune</span>
          </button>
        </div>

        {/* Grid 2 Columnas de Cosméticos */}
        {brandProducts.length === 0 ? (
          <div className="w-full py-10 px-4 rounded-2xl bg-white border border-[#dac0c5]/30 text-center flex flex-col items-center justify-center space-y-3">
            <span className="material-symbols-outlined text-[36px] text-[#9c385b]">
              brush
            </span>
            <p className="font-headline text-[16px] text-[#261819]">
              Sin productos registrados aún para {activeBrand.name}
            </p>
            <button
              onClick={() => setCurrentTab('anadir')}
              className="py-2 px-4 rounded-full bg-[#9c385b] text-white text-[12px] font-bold"
            >
              + Añadir el primer producto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {brandProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelect={() => setSelectedProductId(p.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Otras Marcas en Tu Tocador (Carrusel Horizontal) */}
      <div className="flex flex-col gap-2 pt-2">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-headline text-[18px] font-semibold text-[#261819]">
              Otras marcas en tu tocador
            </h2>
            <p className="text-[12px] text-[#554246]">
              Toca para explorar sus productos registrados
            </p>
          </div>

          <button
            onClick={() => setIsAddBrandModalOpen(true)}
            className="w-8 h-8 rounded-full bg-[#ffe9ea] text-[#9c385b] flex items-center justify-center hover:bg-[#fee1e4] active:scale-95 transition-all"
            title="Registrar marca"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        {/* Carrusel Horizontal */}
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar scroll-smooth">
          {brands.map((brand) => {
            const isSelected = brand.id === activeBrand.id;
            const count = products.filter(
              (p) =>
                p.brandId === brand.id ||
                p.brandName.toLowerCase() === brand.name.toLowerCase()
            ).length;

            return (
              <div
                key={brand.id}
                onClick={() => {
                  setSelectedBrandId(brand.id);
                  showToast(`Cargando catálogo de ${brand.name}`);
                }}
                className={`flex flex-col items-center flex-shrink-0 w-28 p-3 rounded-2xl bg-white shadow-sm border transition-all cursor-pointer select-none active:scale-95 ${
                  isSelected
                    ? 'border-[#9c385b] ring-2 ring-[#9c385b]/20 bg-[#fff0f1]'
                    : 'border-[#dac0c5]/25 hover:bg-[#ffe9ea]/40'
                }`}
              >
                <div className="w-14 h-14 rounded-full bg-[#fee1e4] p-1 mb-2 shadow-inner flex items-center justify-center overflow-hidden">
                  <img
                    className="w-full h-full rounded-full object-cover"
                    alt={brand.name}
                    src={brand.logoUrl}
                    referrerPolicy="no-referrer"
                  />
                </div>
                <span className="font-semibold text-[13.5px] text-[#261819] truncate w-full text-center">
                  {brand.name}
                </span>
                <span className="text-[11px] font-bold text-[#9c385b] mt-0.5">
                  {count} productos
                </span>
              </div>
            );
          })}

          {/* Tarjeta Registro Rápido Nueva Marca */}
          <div
            onClick={() => setIsAddBrandModalOpen(true)}
            className="flex flex-col items-center justify-center flex-shrink-0 w-28 p-3 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] transition-all cursor-pointer shadow-sm border border-[#dac0c5]/30 active:scale-95 group"
          >
            <div className="w-14 h-14 rounded-full bg-white text-[#9c385b] flex items-center justify-center mb-2 shadow-sm group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-[24px]">add_business</span>
            </div>
            <span className="text-[11.5px] text-center text-[#261819] font-bold leading-tight">
              Registrar Marca
            </span>
          </div>
        </div>
      </div>

      {/* Botón Fijo Estilizado para Registrar Nueva Marca */}
      <button
        onClick={() => setIsAddBrandModalOpen(true)}
        className="w-full h-12 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] text-[#261819] flex items-center justify-center gap-2 font-bold text-[14px] transition-all shadow-sm border border-[#dac0c5]/30 active:scale-[0.99]"
      >
        <span className="material-symbols-outlined text-[#9c385b] text-[20px]">
          add_circle_outline
        </span>
        <span>+ Registrar nueva marca en mi tocador</span>
      </button>
    </div>
  );
};
