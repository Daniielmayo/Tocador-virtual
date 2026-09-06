import React, { useState } from 'react';
import { useVanity } from '../context/VanityContext';

export const LoginView: React.FC = () => {
  const { loginWithEmail, showToast } = useVanity();

  const [email, setEmail] = useState('yulitzahernandezherrera@gmail.com');
  const [password, setPassword] = useState('Yulisa123*');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      showToast('Por favor ingresa tu correo y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      await loginWithEmail(email.trim(), password.trim());
    } catch {
      // Toast handles error display
    } finally {
      setIsLoading(false);
    }
  };

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
            Ingresa tus credenciales para acceder a tu colección y productos de tocador.
          </p>
        </div>

        {/* Formulario de Inicio de Sesión */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="space-y-1.5">
            <label className="text-[11.5px] font-bold text-[#261819] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#9c385b]">
                mail
              </span>
              <span>Correo Electrónico</span>
            </label>
            <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/35 flex items-center transition-all focus-within:border-[#9c385b] focus-within:bg-white">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none placeholder:text-[#877176]/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11.5px] font-bold text-[#261819] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#9c385b]">
                lock
              </span>
              <span>Contraseña</span>
            </label>
            <div className="h-12 px-3.5 rounded-2xl bg-[#fff0f1] border border-[#dac0c5]/35 flex items-center transition-all focus-within:border-[#9c385b] focus-within:bg-white">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-[14px] text-[#261819] font-medium outline-none placeholder:text-[#877176]/60"
              />
            </div>
          </div>

          {/* Botón de Acceso */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 rounded-2xl bg-[#8e4a53] hover:bg-[#793942] text-white font-bold text-[15px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all disabled:opacity-75"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]">
                  login
                </span>
                <span>Acceder a mi Tocador</span>
              </>
            )}
          </button>
        </form>

        {/* Pie de página con seguridad */}
        <div className="flex items-center gap-1.5 text-[11.5px] text-[#79542b] pt-1">
          <span className="material-symbols-outlined text-[16px]">verified_user</span>
          <span>Autenticación segura vía Firebase Cloud</span>
        </div>
      </div>
    </div>
  );
};
