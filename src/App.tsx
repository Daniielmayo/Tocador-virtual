import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { VanityProvider, useVanity } from './context/VanityContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { VanityHome } from './components/VanityHome';
import { BrandsView } from './components/BrandsView';
import { AddProductView } from './components/AddProductView';
import { WishlistView } from './components/WishlistView';
import { ProfileView } from './components/ProfileView';
import { LoginView } from './components/LoginView';
import { ProductDetailModal } from './components/ProductDetailModal';
import { NewBrandModal } from './components/NewBrandModal';
import { DailyRoutineModal } from './components/DailyRoutineModal';
import { Toast } from './components/Toast';

const VanityAppContent: React.FC = () => {
  const {
    user,
    loadingAuth,
    currentTab,
    setCurrentTab,
    selectedProductId,
    setSelectedProductId,
    isAddBrandModalOpen,
    setIsAddBrandModalOpen,
    setEditingProduct,
  } = useVanity();

  // 1. Splash Screen mientras se comprueba autenticación
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#fff8f7] flex flex-col items-center justify-center p-4">
        <div className="w-14 h-14 rounded-2xl bg-[#261819] flex items-center justify-center text-[#d4a574] shadow-md animate-pulse">
          <span className="font-headline font-bold text-[24px] italic">V</span>
        </div>
        <span className="mt-3 font-headline text-[18px] text-[#9c385b] font-medium">
          Cargando Tu Tocador...
        </span>
      </div>
    );
  }

  // 2. Control de Acceso: Si el usuario NO está autenticado, muestra únicamente la vista de Login
  if (!user) {
    return (
      <>
        <LoginView />
        <Toast />
      </>
    );
  }

  // 3. Usuario Autenticado: Acceso completo a la aplicación
  const getSubtitle = () => {
    switch (currentTab) {
      case 'marcas':
        return 'Marcas';
      case 'anadir':
        return 'Añadir Producto';
      case 'deseos':
        return 'Deseos & Reposición';
      case 'perfil':
        return 'Perfil & Seguridad';
      default:
        return 'Mi Tocador';
    }
  };

  const showBackButton = currentTab !== 'tocador';

  const handleBack = () => {
    if (currentTab === 'anadir') {
      setEditingProduct(null);
    }
    setCurrentTab('tocador');
  };

  return (
    <div className="min-h-screen bg-[#fff8f7] text-[#261819] flex flex-col items-center selection:bg-[#fee1e4] selection:text-[#9c385b]">
      {/* Header Fijo */}
      <Header
        subtitle={getSubtitle()}
        showBack={showBackButton}
        onBack={handleBack}
      />

      {/* Contenedor Principal */}
      <main className="w-full max-w-md px-4 pt-20 flex-1 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="w-full flex-1"
          >
            {currentTab === 'tocador' && <VanityHome />}
            {currentTab === 'marcas' && <BrandsView />}
            {currentTab === 'anadir' && <AddProductView />}
            {currentTab === 'deseos' && <WishlistView />}
            {currentTab === 'perfil' && <ProfileView />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Navegación Inferior Flotante */}
      <BottomNav />

      {/* Notificaciones Toast */}
      <Toast />

      {/* Modal Detalle de Producto */}
      <AnimatePresence>
        {selectedProductId && (
          <ProductDetailModal
            productId={selectedProductId}
            onClose={() => setSelectedProductId(null)}
          />
        )}
      </AnimatePresence>

      {/* Modal Registrar Marca */}
      <NewBrandModal
        isOpen={isAddBrandModalOpen}
        onClose={() => setIsAddBrandModalOpen(false)}
      />

      {/* Modal Rutina del Día */}
      <DailyRoutineModal />
    </div>
  );
};

export default function App() {
  return (
    <VanityProvider>
      <VanityAppContent />
    </VanityProvider>
  );
}
