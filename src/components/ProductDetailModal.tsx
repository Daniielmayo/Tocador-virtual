import React from 'react';
import { motion } from 'motion/react';
import { useVanity } from '../context/VanityContext';

interface ProductDetailModalProps {
  productId: string;
  onClose: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  productId,
  onClose,
}) => {
  const {
    products,
    deleteProduct,
    updateProduct,
    toggleFavorite,
    setEditingProduct,
    setCurrentTab,
    showToast,
    user,
  } = useVanity();

  const product = products.find((p) => p.id === productId);

  if (!product) return null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.brandName} - ${product.name}`,
          text: `Mira este producto en mi tocador Vanity: ${product.name} (${product.shadeName})`,
          url: window.location.href,
        });
      } catch {
        // Ignored
      }
    } else {
      navigator.clipboard?.writeText(
        `${product.brandName} - ${product.name} (${product.shadeName})`
      );
      showToast('Detalles copiados al portapapeles');
    }
  };

  const handleDelete = () => {
    if (confirm(`¿Deseas eliminar "${product.name}" de tu tocador?`)) {
      deleteProduct(product.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#261819]/50 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop click listener */}
      <div className="absolute inset-0" onClick={onClose}></div>

      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="relative w-full max-w-md bg-[#fff8f7] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden h-[92vh] sm:h-[90vh] max-h-[100dvh] flex flex-col z-10"
      >
        {/* Header Superior del Detalle */}
        <div className="flex-shrink-0 bg-[#fff8f7]/95 backdrop-blur-md border-b border-[#dac0c5]/25 px-4 h-16 flex items-center justify-between z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-10 h-10 -ml-2 rounded-full flex items-center justify-center text-[#554246] hover:text-[#9c385b] active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[24px]">arrow_back_ios_new</span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-md bg-[#261819] flex items-center justify-center text-[#d4a574]">
                <span className="font-headline font-bold text-[13px] italic">V</span>
              </div>
              <span className="font-headline text-[18px] text-[#261819] font-medium">
                Detalle Producto
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full flex items-center justify-center text-[#554246] hover:bg-[#ffe9ea] active:scale-90 transition-all"
              title="Compartir"
            >
              <span className="material-symbols-outlined text-[20px]">share</span>
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden ml-1 ring-1 ring-[#79542b]/40">
              <img
                src={
                  user?.photoURL ||
                  'https://lh3.googleusercontent.com/aida-public/AB6AXuBqmhkchV3JUBDu8vFUodavOCCVHNymhhfU4aSG3QQOGXjE-8mwTcs8z0FOccTE4eeiyeBvRhqYigj5E8vMWMkOMhjUfeO12nEBW_Mh3FLufFy3_1idNvAmgowIiXULR73udPHz9dn3mpqGwfTJrQiLHqGgAWJc7HxbEMViD2g6mrnTj83s56T2cn7vEdADLuBLmIo-1rJgrAaXaM6J6ggw6Zu6d1bpA7cxfacYsbcM3b8lFCAeGzVrYA'
                }
                alt="Usuario"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>

        {/* Contenido Principal Limpio */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-16">
          {/* Imagen del Producto */}
          <div className="relative w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-md border border-[#dac0c5]/30">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Información Principal: Marca, Nombre, Referencia */}
          <div className="p-4 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-bold text-[#79542b] uppercase tracking-wider">
                {product.brandName}
              </span>
              {product.reference && (
                <span className="text-[12px] text-[#877176] font-medium">
                  Ref: {product.reference}
                </span>
              )}
            </div>

            <h1 className="font-headline text-[26px] font-semibold text-[#261819] leading-tight">
              {product.name}
            </h1>

            <div className="pt-1 flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#fee1e4] text-[#9c385b] text-[12px] font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
          </div>

          {/* Sección de Tono / Shade (Si existe) */}
          {(product.shadeName || product.shadeColor) && (
            <div className="p-4 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                {product.shadeColor && (
                  <div
                    className="w-9 h-9 rounded-full shadow-inner border-2 border-white ring-1 ring-[#dac0c5]"
                    style={{ backgroundColor: product.shadeColor }}
                  ></div>
                )}
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-[#877176] uppercase tracking-wider">
                    TONO / CÓDIGO
                  </span>
                  <span className="font-bold text-[15px] text-[#261819]">
                    {product.shadeName || product.shadeColor}
                  </span>
                </div>
              </div>

              {product.shadeColor && (
                <span className="text-[12px] font-mono text-[#554246] bg-[#fff0f1] px-2.5 py-1 rounded-lg border border-[#dac0c5]/30">
                  {product.shadeColor}
                </span>
              )}
            </div>
          )}

          {/* Selector de Estado */}
          <div className="p-4 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm space-y-3">
            <span className="text-[12px] font-bold text-[#877176] uppercase tracking-wider">
              Estado del Producto
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'nuevo', label: 'Nuevo', icon: 'new_releases' },
                { id: 'en_uso', label: 'En Uso', icon: 'check_circle' },
                { id: 'agotado', label: 'Agotado', icon: 'block' }
              ].map(status => (
                <button
                  key={status.id}
                  onClick={() => {
                    updateProduct(product.id, { status: status.id as any });
                    showToast(`Estado cambiado a ${status.label}`);
                  }}
                  className={`flex flex-col items-center justify-center gap-1 p-2 rounded-xl border text-[11px] font-bold transition-all active:scale-95 ${
                    product.status === status.id
                      ? 'bg-[#9c385b] border-[#9c385b] text-white shadow-sm'
                      : 'bg-[#fff0f1] border-[#dac0c5]/30 text-[#554246] hover:bg-[#ffe9ea]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {status.icon}
                  </span>
                  <span>{status.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Detalles de Compra */}
          <div className="p-4 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm space-y-2">
            <span className="text-[12px] font-bold text-[#877176] uppercase tracking-wider">
              Detalles de Compra
            </span>
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-2 text-[#261819]">
                <span className="material-symbols-outlined text-[16px] text-[#9c385b]">sell</span>
                <span className={`text-[14px] ${product.purchasePrice ? 'font-medium' : 'text-[#877176] italic'}`}>
                  {product.purchasePrice || 'Precio no especificado'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[#261819]">
                <span className="material-symbols-outlined text-[16px] text-[#9c385b]">store</span>
                <span className={`text-[14px] ${product.store ? 'font-medium' : 'text-[#877176] italic'}`}>
                  {product.store || 'Tienda no especificada'}
                </span>
              </div>
            </div>
          </div>

          {/* Botón Favorito */}
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`w-full h-12 rounded-2xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 ${
              product.isFavorite
                ? 'bg-[#fda7b0] text-[#3a0813] hover:bg-[#f895a0]'
                : 'bg-[#fee1e4] text-[#9c385b] hover:bg-[#f8dcde]'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: product.isFavorite ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              favorite
            </span>
            <span>
              {product.isFavorite
                ? 'En mis favoritos del tocador'
                : 'Añadir a mis favoritos'}
            </span>
          </button>

          {/* Acciones Finales: Editar / Eliminar */}
          <div className="pt-2 space-y-2.5">
            <button
              onClick={() => {
                setEditingProduct(product);
                setCurrentTab('anadir');
                onClose();
              }}
              className="w-full h-12 rounded-2xl bg-[#9c385b] hover:bg-[#852a4a] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">edit</span>
              <span>Editar producto</span>
            </button>

            <button
              onClick={handleDelete}
              className="w-full h-12 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] text-[#ba1a1a] font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">delete_outline</span>
              <span>Eliminar de mi tocador</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
