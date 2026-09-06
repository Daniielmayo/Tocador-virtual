import React from 'react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { useVanity } from '../context/VanityContext';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { toggleFavorite, setSelectedProductId } = useVanity();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setSelectedProductId(product.id);
    }
  };

  const handleFavClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      onClick={handleCardClick}
      className="group flex flex-col justify-between bg-white rounded-2xl p-2 shadow-[0_4px_16px_-2px_rgba(61,44,46,0.06),0_2px_6px_-1px_rgba(214,102,138,0.06)] border border-[#dac0c5]/25 relative cursor-pointer select-none transition-shadow hover:shadow-[0_8px_24px_-4px_rgba(61,44,46,0.12)]"
    >
      {/* Botón Favorito (Corazón) */}
      <button
        onClick={handleFavClick}
        aria-label="Guardar en favoritos"
        className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-white/85 backdrop-blur-md flex items-center justify-center shadow-sm hover:scale-110 active:scale-90 transition-transform"
      >
        <span
          className={`material-symbols-outlined text-[19px] ${
            product.isFavorite ? 'text-[#9c385b]' : 'text-[#877176]'
          }`}
          style={{
            fontVariationSettings: product.isFavorite ? "'FILL' 1" : "'FILL' 0",
          }}
        >
          favorite
        </span>
      </button>

      {/* Imagen del Producto */}
      <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-[#fff0f1] relative flex items-center justify-center">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Información del Producto */}
      <div className="flex flex-col pt-2.5 pb-1 px-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-[10.5px] uppercase tracking-wider text-[#79542b] font-bold truncate max-w-[120px]">
            {product.brandName}
          </span>
          {product.reference && (
            <span className="text-[10px] text-[#877176] font-medium truncate max-w-[70px]">
              {product.reference}
            </span>
          )}
        </div>

        <h3 className="font-headline text-[15px] leading-tight text-[#261819] font-medium line-clamp-1">
          {product.name}
        </h3>

        <div className="flex flex-col gap-1 pt-1">
          {/* Swatch & Tono / Código (si existe) */}
          {(product.shadeName || product.shadeColor) && (
            <div className="flex items-center space-x-1.5 bg-[#fee1e4]/50 px-2 py-0.5 rounded-full max-w-[130px]">
              {product.shadeColor && (
                <span
                  className="w-3 h-3 rounded-full shadow-inner flex-shrink-0 border border-white/60"
                  style={{ backgroundColor: product.shadeColor }}
                ></span>
              )}
              <span className="text-[11px] text-[#261819] font-medium truncate">
                {product.shadeName || product.shadeColor}
              </span>
            </div>
          )}

          {/* Categoría siempre visible */}
          <span className="text-[10.5px] text-[#9c385b] font-bold uppercase tracking-wider">
            {product.category}
          </span>
        </div>
      </div>
    </motion.article>
  );
};
