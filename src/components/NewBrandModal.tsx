import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVanity } from '../context/VanityContext';

interface NewBrandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewBrandModal: React.FC<NewBrandModalProps> = ({ isOpen, onClose }) => {
  const { addBrand, showToast } = useVanity();

  const [brandName, setBrandName] = useState('');
  const [creator, setCreator] = useState('');
  const [quote, setQuote] = useState('');
  const [specialty, setSpecialty] = useState('Color & Swatches');
  const [logoUrl, setLogoUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuA9_lgi2LjyXi-ymSiO1MSgSbCeYPp8NRdiZFGJW6ImP0YlVz14vOBFkcEx8ug-JTyMQBOOHfOLe2jKEA32APvoKr_dlhI363n9PNrgAIVVd6x1e9s5ukhPp6su5j8Uazxifevdj9K55weMhh6aBUDIB0kALTcivKxeUIEcJ3RVyalF164to9_TIW0rWUQDwxBQ-iJjDr25d1ZsUZJ870932ICEgGA290NVulndEks_-JO765p8eli7Cg'
  );
  const [bannerUrl, setBannerUrl] = useState(
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCExTy1_pWmgqvksHvIB-h-fRdZgELHk4IDRN6aI50NNODA0f2SU9lWh4O2vdDur1iHRLClrIeGOxoNXtKpxwsdZkrIxc9hTBHlgGncmPhi0d-osUj9_NdkVpH4c8r26QrGUUgKFmMK4oVAMhIDEfJsb9KcNK5z4U0hxcA4j19Wx0eQI-UJSOLJKs5r_CldNxukdMsKAO0NVDekI8JeSfj5jOGUYPLTZd2Zc7dNJi2Zqsjf05wMP5Ty2g'
  );

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brandName.trim()) {
      showToast('Introduce el nombre de la marca');
      return;
    }

    await addBrand({
      name: brandName.trim(),
      creator: creator.trim() || undefined,
      quote: quote.trim() || 'Cosmética exclusiva pensada para sublimar la belleza natural.',
      logoUrl,
      bannerUrl,
      specialty,
    });

    onClose();
  };

  const SPECIALTIES = [
    'Color & Swatches',
    'Skincare Luminoso',
    'Cruelty Free & Vegano',
    'Alta Gama & Lujo',
    'K-Beauty',
    'Dermocosmética',
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#261819]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        {/* Backdrop click */}
        <div className="absolute inset-0" onClick={onClose}></div>

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#fff8f7] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Header del Modal */}
          <div className="p-4 border-b border-[#dac0c5]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9c385b] text-[22px]">
                add_business
              </span>
              <h2 className="font-headline text-[20px] font-semibold text-[#261819]">
                Registrar Marca
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#554246] hover:bg-[#ffe9ea]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
            {/* Logo Preview y Selección */}
            <div className="flex items-center gap-4 p-3 bg-white rounded-2xl border border-[#dac0c5]/25 shadow-sm">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#fee1e4] p-1 shadow-inner flex-shrink-0">
                <img
                  src={logoUrl}
                  alt="Logo preview"
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex flex-col gap-1 flex-1">
                <span className="text-[12px] font-bold text-[#261819]">
                  Insignia / Logotipo
                </span>
                <span className="text-[11px] text-[#554246]">
                  Selecciona una imagen representativa
                </span>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      const url = prompt('Introduce la URL de la imagen del logo:', logoUrl);
                      if (url) setLogoUrl(url);
                    }}
                    className="px-2.5 py-1 rounded-full bg-[#fee1e4] text-[#9c385b] text-[11px] font-bold hover:bg-[#f8dcde]"
                  >
                    Cambiar URL
                  </button>
                </div>
              </div>
            </div>

            {/* Nombre de la Marca */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#261819] flex items-center justify-between">
                <span>Nombre de la Marca</span>
                <span className="text-[#9c385b] text-[10px] uppercase">Obligatorio</span>
              </label>
              <input
                required
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="Ej. Charlotte Tilbury, Rhode, Dior..."
                className="w-full h-11 px-3.5 rounded-2xl bg-white border border-[#dac0c5]/30 text-[13px] text-[#261819] font-medium outline-none focus:border-[#9c385b]"
              />
            </div>

            {/* Fundador(a) / Creador */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#261819]">
                Fundador(a) o Embajadora
              </label>
              <input
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                placeholder="Ej. Charlotte Tilbury MBE, Hailey Bieber..."
                className="w-full h-11 px-3.5 rounded-2xl bg-white border border-[#dac0c5]/30 text-[13px] text-[#261819] font-medium outline-none focus:border-[#9c385b]"
              />
            </div>

            {/* Lema o Filosofía */}
            <div className="space-y-1">
              <label className="text-[12px] font-bold text-[#261819]">
                Filosofía de la Firma
              </label>
              <textarea
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={2}
                placeholder="Frase célebre, filosofía de formulación o inspiración..."
                className="w-full p-3 rounded-2xl bg-white border border-[#dac0c5]/30 text-[13px] text-[#261819] outline-none focus:border-[#9c385b] resize-none"
              ></textarea>
            </div>

            {/* Especialidad */}
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold text-[#261819]">
                Especialidad Principal
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SPECIALTIES.map((spec) => {
                  const isSelected = specialty === spec;
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => setSpecialty(spec)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                        isSelected
                          ? 'bg-[#9c385b] text-white shadow-sm'
                          : 'bg-white text-[#554246] border border-[#dac0c5]/30 hover:bg-[#ffe9ea]'
                      }`}
                    >
                      {spec}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="pt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-11 rounded-2xl border border-[#dac0c5]/40 text-[#554246] font-bold text-[13px] hover:bg-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="h-11 rounded-2xl bg-[#9c385b] text-white font-bold text-[13px] shadow-sm hover:bg-[#852a4a] active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">check</span>
                <span>Guardar Marca</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
