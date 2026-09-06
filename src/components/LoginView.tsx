import React from 'react';
import { useVanity } from '../context/VanityContext';

export const LoginView: React.FC = () => {
  const { loginWithGoogle } = useVanity();

  return (
    <div className="min-h-screen w-full bg-[#fff8f7] text-[#261819] flex flex-col items-center justify-center p-4 selection:bg-[#fee1e4] selection:text-[#9c385b]">
      {/* Contenedor Principal de Login */}
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_30px_rgba(61,44,46,0.08)] border border-[#dac0c5]/30 flex flex-col items-center space-y-6">
        {/* Logo e Identidad Visual */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#261819] flex items-center justify-center text-[#d4a574] shadow-md ring-4 ring-[#fee1e4]">
            <span className="font-headline font-bold text-[28px] italic">V</span>
          </div>

          <div className="flex flex-col items-center pt-1">
            <h1 className="font-headline text-[34px] font-semibold text-[#9c385b] tracking-tight leading-none">
              Vanity
            </h1>
            <span className="text-[12px] font-bold text-[#79542b] tracking-widest uppercase mt-1">
              Mi Tocador Personal
            </span>
          </div>

          <p className="text-[13px] text-[#554246] max-w-xs pt-1">
            Inicia sesión con tu cuenta de Google para acceder a tu colección y productos de tocador.
          </p>
        </div>

        {/* Botón de Acceso con Google */}
        <div className="w-full pt-4 pb-2">
          <button
            onClick={loginWithGoogle}
            className="w-full h-13 rounded-2xl bg-white border border-[#dac0c5] hover:bg-[#fff0f1] text-[#261819] font-bold text-[15px] flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-all"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Acceder con Google</span>
          </button>
        </div>

        {/* Pie de página con seguridad */}
        <div className="flex items-center gap-1.5 text-[11.5px] text-[#79542b] pt-1">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Autenticación segura vía Google & Firebase</span>
        </div>
      </div>
    </div>
  );
};
