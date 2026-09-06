import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useVanity } from '../context/VanityContext';

export const DailyRoutineModal: React.FC = () => {
  const { isDailyRoutineOpen, setIsDailyRoutineOpen, setSelectedProductId, showToast } =
    useVanity();

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  if (!isDailyRoutineOpen) return null;

  const toggleStep = (index: number) => {
    if (completedSteps.includes(index)) {
      setCompletedSteps(completedSteps.filter((i) => i !== index));
    } else {
      setCompletedSteps([...completedSteps, index]);
      showToast(`¡Paso ${index + 1} completado! ✨`);
    }
  };

  const STEPS = [
    {
      title: 'Paso 1: Preparación & Base Iluminadora',
      desc: 'Aplica 2 puntos de Charlotte Tilbury Flawless Filter en pómulos, tabique y arco de cupido. Difumina con brocha densa.',
      productId: 'prod-tilbury-flawless',
      productName: 'Hollywood Flawless Filter',
      brand: 'Charlotte Tilbury',
    },
    {
      title: 'Paso 2: Color Radiante & Rubor Líquido',
      desc: 'Coloca exactamente 1 punto de Rare Beauty Soft Pinch (Tono Happy) en la manzana de cada mejilla. Difumina rápidamente hacia la sien para un efecto lifting natural.',
      productId: 'prod-rare-blush',
      productName: 'Soft Pinch Liquid Blush',
      brand: 'Rare Beauty',
    },
    {
      title: 'Paso 3: Mirada Despierta & Definida',
      desc: 'Aplica dos capas de Maybelline Lash Sensational Sky High en zig-zag desde la raíz hasta las puntas para longitud panorámica.',
      productId: 'prod-maybelline-lash',
      productName: 'Lash Sensational Sky High',
      brand: 'Maybelline',
    },
    {
      title: 'Paso 4: Labios Jugosos & Nutridos',
      desc: 'Sella el look con una generosa capa de Dior Addict Lip Glow Oil (001 Pink) para brillo espejo y nutrición profunda con aceite de cereza.',
      productId: 'prod-dior-lip-oil',
      productName: 'Addict Lip Glow Oil',
      brand: 'Dior Backstage',
    },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#261819]/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div
          className="absolute inset-0"
          onClick={() => setIsDailyRoutineOpen(false)}
        ></div>

        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="relative w-full max-w-md bg-[#fff8f7] rounded-t-[32px] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col z-10"
        >
          {/* Header */}
          <div className="p-4 border-b border-[#dac0c5]/25 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#9c385b] text-[22px]">
                routine
              </span>
              <div>
                <h2 className="font-headline text-[18px] font-semibold text-[#261819]">
                  Rutina del Día: Glow Natural
                </h2>
                <span className="text-[11px] text-[#79542b] font-medium">
                  {completedSteps.length} de {STEPS.length} pasos completados
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsDailyRoutineOpen(false)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#554246] hover:bg-[#ffe9ea]"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Lista de Pasos */}
          <div className="p-5 space-y-4 overflow-y-auto">
            {STEPS.map((step, idx) => {
              const isDone = completedSteps.includes(idx);
              return (
                <div
                  key={idx}
                  onClick={() => toggleStep(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 ${
                    isDone
                      ? 'bg-[#fee1e4]/40 border-[#9c385b]/40 opacity-75'
                      : 'bg-white border-[#dac0c5]/30 shadow-sm hover:border-[#9c385b]'
                  }`}
                >
                  <div className="pt-0.5">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                        isDone
                          ? 'bg-[#9c385b] text-white'
                          : 'border-2 border-[#dac0c5] text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 flex-1">
                    <span
                      className={`font-headline text-[15px] font-semibold ${
                        isDone ? 'line-through text-[#877176]' : 'text-[#261819]'
                      }`}
                    >
                      {step.title}
                    </span>
                    <p className="text-[12px] text-[#554246] leading-relaxed">
                      {step.desc}
                    </p>

                    <div className="flex items-center justify-between pt-1.5 mt-1 border-t border-[#dac0c5]/20">
                      <span className="text-[11px] font-bold text-[#79542b]">
                        {step.brand} • {step.productName}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProductId(step.productId);
                          setIsDailyRoutineOpen(false);
                        }}
                        className="text-[11px] font-bold text-[#9c385b] hover:underline flex items-center gap-0.5"
                      >
                        <span>Ver en tocador</span>
                        <span className="material-symbols-outlined text-[12px]">
                          arrow_forward
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-[#dac0c5]/25 bg-white">
            <button
              onClick={() => {
                if (completedSteps.length === STEPS.length) {
                  showToast('¡Rutina completada! Luces radiante hoy ✨');
                } else {
                  setCompletedSteps([0, 1, 2, 3]);
                  showToast('¡Todos los pasos completados! ✨');
                }
              }}
              className="w-full h-11 rounded-2xl bg-[#9c385b] hover:bg-[#852a4a] text-white font-bold text-[13px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">done_all</span>
              <span>
                {completedSteps.length === STEPS.length
                  ? '¡Rutina lista!'
                  : 'Marcar todos los pasos como completados'}
              </span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
