import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  ShieldCheck, 
  FileText, 
  AlertTriangle, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  initialMode?: 'login' | 'register';
  onClose: () => void;
  onSuccess: (role: UserRole, userName: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [userRole, setUserRole] = useState<UserRole>('player');

  // Form states
  const [fullName, setFullName] = useState('Marcelo Gutiérrez');
  const [email, setEmail] = useState('marcelo.g@inacap.cl');
  const [phone, setPhone] = useState('+56 9 8451 2230');
  const [password, setPassword] = useState('********');
  const [confirmPassword, setConfirmPassword] = useState('********');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [showFullNormativas, setShowFullNormativas] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Debes aceptar las normativas del recinto deportivo antes de ingresar.');
      return;
    }

    onSuccess(userRole, fullName || (userRole === 'owner' ? 'Don Marcelo (Dueño)' : 'Capitán de Equipo'));
    onClose();
  };

  // Acceso Rápido con 1 clic (Demo Mode para INACAP)
  const handleQuickDemoLogin = (role: UserRole, name: string, mail: string) => {
    setUserRole(role);
    setFullName(name);
    setEmail(mail);
    onSuccess(role, name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      {/* Contenedor Principal */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl flex flex-col my-6 animate-in zoom-in-95 duration-200">
        
        {/* Cabecera con degradado */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-5 border-b border-slate-800 flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow">
              ⚽
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-lg text-white tracking-tight">
                  BabyFútbol<span className="text-emerald-400">Chillán</span>
                </span>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase font-mono border border-emerald-500/30">
                  Acceso
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Portal de Acceso para Clientes y Dueño
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 p-2 rounded-full transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CONTENIDO DEL FORMULARIO */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto max-h-[80vh]">
          
          {/* BOTONES DE ACCESO RÁPIDO DIRECTO (DEMO INACAP) */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              ⚡ Acceso Rápido con 1 Clic (Selecciona tu Perfil):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('owner', 'Marcelo Gutiérrez (Dueño)', 'marcelo.g@inacap.cl')}
                className="p-3 rounded-xl bg-gradient-to-r from-amber-500/20 to-slate-900 border border-amber-500/40 hover:border-amber-400 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-amber-300">👑 Acceso Dueño de Cancha</span>
                  <span className="text-[10px] text-amber-400 font-mono font-bold">Admin</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Control de luces LED, agenda y caja</p>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('player', 'Capitán de Equipo', 'jugador@chillan.cl')}
                className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/20 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-white group-hover:text-emerald-300">⚽ Acceso Jugador / Capitán</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">Cliente</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Reservar cancha y ver pases QR</p>
              </button>
            </div>
          </div>

          {/* SELECTOR DE PESTAÑAS: INICIAR SESIÓN O REGISTRO */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'login' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Iniciar Sesión (Ya tengo cuenta)</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2 ${
                mode === 'register' ? 'bg-emerald-500 text-slate-950 font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Crear Cuenta Nueva</span>
            </button>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'register' && (
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Nombre Completo del Capitán o Dueño</label>
                <input
                  type="text"
                  placeholder="Ej: Marcelo Gutiérrez"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Correo Electrónico</label>
              <input
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {mode === 'register' && (
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Teléfono / WhatsApp (Para enviar Pase QR)</label>
                <input
                  type="tel"
                  placeholder="+56 9 8451 2230"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            <div>
              <label className="font-semibold text-slate-300 block mb-1">Contraseña</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full bg-slate-950 text-white placeholder-slate-500 rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Selector de Rol si es registro */}
            {mode === 'register' && (
              <div>
                <label className="font-semibold text-slate-300 block mb-1">Tipo de Usuario</label>
                <select
                  value={userRole}
                  onChange={e => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 text-white rounded-xl px-3.5 py-2.5 border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="player">Jugador / Capitán de Equipo (Arrienda Cancha)</option>
                  <option value="owner">Dueño de la Cancha de Babyfútbol (Administrador)</option>
                </select>
              </div>
            )}

            {/* SECCIÓN DE NORMATIVAS DEL RECINTO ANTES DE ENTRAR */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  Normativas Oficiales del Recinto Deportivo (Obligatorio)
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullNormativas(prev => !prev)}
                  className="text-[11px] text-emerald-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{showFullNormativas ? 'Ocultar detalles' : 'Ver 6 normas'}</span>
                  {showFullNormativas ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              </div>

              {/* Lista Resumida de Normativas */}
              <ul className="space-y-1.5 text-[11px] text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">1.</span>
                  <span><strong>Calzado Permitido:</strong> Zapatillas de suela lisa o multitaco de goma (turf). <em>Prohibidos estoperoles de aluminio o fierro.</em></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">2.</span>
                  <span><strong>Tiempos:</strong> 55 min de partido + 5 min de despeje para el siguiente turno.</span>
                </li>
              </ul>

              {showFullNormativas && (
                <ul className="space-y-1.5 text-[11px] text-slate-300 pt-2 border-t border-slate-900 animate-in fade-in">
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">3.</span>
                    <span><strong>Tercer Tiempo:</strong> El consumo de bebidas y asados es exclusivo en el quincho techado, nunca sobre el pasto sintético.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">4.</span>
                    <span><strong>Camarines:</strong> Duchas de agua caliente continuas. Mantener orden y limpieza del recinto.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">5.</span>
                    <span><strong>Garantía Clima:</strong> Reprogramación sin costo en caso de temporal o lluvia torrencial en Chillán avisando con 2 horas.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">6.</span>
                    <span><strong>Privacidad:</strong> Tratamiento confidencial de datos conforme a la Ley Chilena N° 19.628.</span>
                  </li>
                </ul>
              )}

              {/* Casilla de Aceptación Obligatoria */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-slate-900">
                <input
                  type="checkbox"
                  id="modal-terms"
                  checked={acceptedTerms}
                  onChange={e => setAcceptedTerms(e.target.checked)}
                  className="mt-0.5 rounded accent-emerald-500 cursor-pointer w-4 h-4"
                />
                <label htmlFor="modal-terms" className="text-[11px] text-slate-300 leading-tight cursor-pointer">
                  Declaro haber leído y <strong>acepto cumplir las normativas del recinto deportivo</strong> y las políticas de reserva de BabyFútbol Chillán.
                </label>
              </div>
            </div>

            {/* BOTÓN SUBMIT */}
            <button
              type="submit"
              disabled={!acceptedTerms}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-40 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 transition-all cursor-pointer"
            >
              {mode === 'login' ? 'Iniciar Sesión y Acceder' : 'Completar Registro y Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
