import React, { useState } from 'react';
import { useVanity } from '../context/VanityContext';

export const ProfileView: React.FC = () => {
  const {
    user,
    loginWithEmail,
    loginWithGoogle,
    loginWithDefaultUser,
    logout,
    products,
    brands,
    showToast,
  } = useVanity();

  const [emailInput, setEmailInput] = useState('yulitzahernandezherrera@gmail.com');
  const [passInput, setPassInput] = useState('Yulisa123*');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalProducts = products.length;
  const favoriteCount = products.filter((p) => p.isFavorite).length;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passInput) {
      showToast('Introduce correo y contraseña');
      return;
    }
    setIsSubmitting(true);
    await loginWithEmail(emailInput, passInput);
    setIsSubmitting(false);
  };

  const handleExportData = () => {
    const backup = {
      exportedAt: new Date().toISOString(),
      products,
      brands,
    };
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `vanity_backup_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Copia de seguridad descargada exitosamente');
  };

  return (
    <div className="flex flex-col w-full pb-28 space-y-5">
      {/* Encabezado */}
      <div className="flex flex-col space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fee1e4] text-[#9c385b] text-[11px] font-bold w-fit shadow-sm uppercase tracking-wider">
          <span className="material-symbols-outlined text-[14px]">person</span>
          <span>MI ESPACIO & SEGURIDAD</span>
        </div>

        <h1 className="font-headline text-[30px] font-semibold text-[#261819] leading-tight">
          Perfil & Autenticación
        </h1>
        <p className="text-[13.5px] text-[#554246]">
          Configuración de usuario y sincronización con Firebase Cloud.
        </p>
      </div>

      {/* Tarjeta de Usuario Actual */}
      <div className="p-5 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={
                user?.photoURL ||
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBqmhkchV3JUBDu8vFUodavOCCVHNymhhfU4aSG3QQOGXjE-8mwTcs8z0FOccTE4eeiyeBvRhqYigj5E8vMWMkOMhjUfeO12nEBW_Mh3FLufFy3_1idNvAmgowIiXULR73udPHz9dn3mpqGwfTJrQiLHqGgAWJc7HxbEMViD2g6mrnTj83s56T2cn7vEdADLuBLmIo-1rJgrAaXaM6J6ggw6Zu6d1bpA7cxfacYsbcM3b8lFCAeGzVrYA'
              }
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover ring-2 ring-[#9c385b]/30 shadow-md"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-[#9c385b] text-white flex items-center justify-center text-[10px] shadow-sm">
              <span className="material-symbols-outlined text-[12px]">verified</span>
            </span>
          </div>

          <div className="flex flex-col flex-1">
            <h2 className="font-headline text-[20px] font-semibold text-[#261819] leading-tight">
              {user?.displayName || 'Yulitza Hernández'}
            </h2>
            <span className="text-[12px] text-[#554246]">
              {user?.email || 'yulitzahernandezherrera@gmail.com'}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  user ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                }`}
              ></span>
              <span className="text-[11.5px] font-bold text-[#79542b]">
                {user ? 'Conectado a Firebase Cloud' : 'Conectando usuario por defecto...'}
              </span>
            </div>
          </div>
        </div>

        {user ? (
          <div className="pt-3 flex items-center justify-between border-t border-[#dac0c5]/25">
            <span className="text-[12px] text-[#554246] font-medium">
              Sincronización activa con Firebase
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full bg-[#fee1e4] hover:bg-[#f8dcde] text-[#ba1a1a] text-[12px] font-bold transition-all active:scale-95"
            >
              Cerrar Sesión
            </button>
          </div>
        ) : (
          <div className="pt-2 border-t border-[#dac0c5]/25">
            <button
              onClick={loginWithDefaultUser}
              className="w-full h-11 rounded-2xl bg-[#9c385b] hover:bg-[#852a4a] text-white font-bold text-[13px] shadow-sm active:scale-95 transition-all"
            >
              Iniciar Sesión con Usuario por Defecto
            </button>
          </div>
        )}
      </div>

      {/* Formulario de Autenticación con Correo por Defecto */}
      <div className="p-5 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#9c385b] text-[22px]">
            lock
          </span>
          <h3 className="font-headline text-[18px] font-semibold text-[#261819]">
            Autenticación Firebase
          </h3>
        </div>

        <p className="text-[12.5px] text-[#554246]">
          Credenciales de tu cuenta de Firebase asignada por defecto:
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-3 pt-1">
          <div className="space-y-1">
            <label className="text-[11.5px] font-bold text-[#261819] uppercase">
              Correo Electrónico
            </label>
            <div className="h-11 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/30 flex items-center">
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-transparent text-[13px] text-[#261819] font-medium outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11.5px] font-bold text-[#261819] uppercase">
              Contraseña
            </label>
            <div className="h-11 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/30 flex items-center">
              <input
                type="password"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full bg-transparent text-[13px] text-[#261819] font-medium outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 rounded-2xl bg-[#8e4a53] hover:bg-[#793942] text-white font-bold text-[14px] flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">vpn_key</span>
            <span>
              {isSubmitting ? 'Conectando...' : 'Autenticar en Firebase'}
            </span>
          </button>
        </form>
      </div>

      {/* Resumen de tu Colección */}
      <div className="space-y-2">
        <h3 className="font-headline text-[18px] font-semibold text-[#261819] px-1">
          Resumen de tu Tocador
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm flex flex-col gap-1 text-center">
            <span className="text-[10.5px] font-bold text-[#9c385b] uppercase">
              PRODUCTOS
            </span>
            <span className="font-headline text-[24px] font-bold text-[#261819] leading-tight">
              {totalProducts}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm flex flex-col gap-1 text-center">
            <span className="text-[10.5px] font-bold text-[#79542b] uppercase">MARCAS</span>
            <span className="font-headline text-[24px] font-bold text-[#261819] leading-tight">
              {brands.length}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white border border-[#dac0c5]/25 shadow-sm flex flex-col gap-1 text-center">
            <span className="text-[10.5px] font-bold text-[#9c385b] uppercase">FAVORITOS</span>
            <span className="font-headline text-[24px] font-bold text-[#261819] leading-tight">
              {favoriteCount}
            </span>
          </div>
        </div>
      </div>

      {/* Copia de Seguridad JSON */}
      <div className="p-4 rounded-3xl bg-white border border-[#dac0c5]/30 shadow-sm space-y-3">
        <div className="flex items-center gap-2 text-[#79542b]">
          <span className="material-symbols-outlined text-[20px]">cloud_done</span>
          <span className="font-bold text-[13px]">Respaldo de Seguridad</span>
        </div>
        <p className="text-[12px] text-[#554246]">
          Tus datos se guardan directamente en Firebase Cloud. También puedes descargar una copia local JSON.
        </p>

        <button
          onClick={handleExportData}
          className="w-full h-11 rounded-2xl bg-[#fee1e4] hover:bg-[#f8dcde] text-[#261819] font-bold text-[13px] flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
        >
          <span className="material-symbols-outlined text-[#9c385b] text-[18px]">
            download
          </span>
          <span>Descargar Copia JSON</span>
        </button>
      </div>
    </div>
  );
};
