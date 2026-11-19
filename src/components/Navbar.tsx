import React from 'react';
import { UserRole, WeatherCondition } from '../types';
import { 
  Building2, 
  ShieldCheck, 
  UserCheck, 
  Smartphone, 
  Wifi, 
  WifiOff, 
  CloudRain, 
  Sun, 
  Cloud, 
  Flame,
  Activity,
  Trophy,
  Video,
  Layers,
  CheckCircle2,
  LogIn,
  UserPlus,
  Calendar,
  Sparkles,
  MapPin,
  Bot
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  activeView: 'home' | 'reels' | 'booking';
  onViewChange: (view: 'home' | 'reels' | 'booking') => void;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
  weather: WeatherCondition;
  onToggleWeather: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  currentUser: string | null;
  onOpenAI?: () => void;
  isSupabaseConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeView,
  onViewChange,
  isOfflineMode,
  onToggleOffline,
  weather,
  onToggleWeather,
  onOpenAuth,
  currentUser,
  onOpenAI,
  isSupabaseConnected
}) => {
  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
      {/* Barra superior de estado regional deportivo */}
      <div className="bg-[#020617] px-4 py-1.5 text-xs border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-slate-400">
          <span className="inline-flex items-center gap-1.5 font-bold text-[#22c55e]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
            INACAP Sede Chillán • Proyecto de Título 2026
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-300 text-[11px]">
            Cancha de Babyfútbol • Dueño: Marcelo Gutiérrez
          </span>
        </div>

        {/* Simulación Clima Chillán y Tolerancia Offline */}
        <div className="flex items-center gap-2">
          {/* Toggle Clima Chillán */}
          <button
            onClick={onToggleWeather}
            title="Simular clima en Chillán (impacta la tarifa de la cancha)"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-200 transition-colors border border-slate-700/80 text-xs font-semibold cursor-pointer"
          >
            {weather.condition === 'lluvia_fuerte' ? (
              <CloudRain className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            ) : weather.condition === 'soleado' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Cloud className="w-3.5 h-3.5 text-slate-400" />
            )}
            <span className="font-mono text-[#22c55e]">{weather.temperatureC}°C</span>
            <span className="hidden sm:inline capitalize text-slate-300 font-normal">
              ({weather.condition.replace('_', ' ')})
            </span>
            <span className="text-[10px] text-cyan-400 ml-1 underline font-mono">Simular Clima</span>
          </button>

          {/* Toggle Offline Edge Resilience */}
          <button
            onClick={onToggleOffline}
            title="Simular corte de internet en Chillán para probar tolerancia a fallos"
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-all text-xs font-bold border cursor-pointer ${
              isOfflineMode
                ? 'bg-amber-950/90 text-amber-300 border-amber-500 shadow-md shadow-amber-500/20'
                : 'bg-emerald-950/90 text-emerald-300 border-emerald-600/70'
            }`}
          >
            {isOfflineMode ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Edge Autónomo (Offline)</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>IoT SEC Online</span>
              </>
            )}
          </button>

          {/* Indicador de Conexión Supabase */}
          <div
            title={isSupabaseConnected ? 'Sincronizado en tiempo real con Supabase PostgreSQL' : 'Modo caché local'}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
              isSupabaseConnected
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isSupabaseConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
            <span>{isSupabaseConnected ? 'Supabase Live' : 'Local Mode'}</span>
          </div>
        </div>
      </div>

      {/* Barra Principal: BabyFútbol Chillán */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo de la Cancha de Babyfútbol */}
        <div 
          onClick={() => {
            onRoleChange('player');
            onViewChange('home');
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-xl">⚽</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black text-xl tracking-tight text-white">
              BabyFútbol<span className="text-[#22c55e]">Chillán</span>
            </span>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-[#22c55e] text-slate-950 uppercase font-mono">
              Oficial
            </span>
          </div>
        </div>

        {/* Navegación para Clientes / Jugadores */}
        <div className="hidden md:flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => {
              onRoleChange('player');
              onViewChange('home');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'home' && currentRole === 'player'
                ? 'bg-slate-800 text-[#22c55e]'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            La Cancha & Servicios
          </button>

          <button
            onClick={() => {
              onRoleChange('player');
              onViewChange('booking');
            }}
            className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'booking' && currentRole === 'player'
                ? 'bg-slate-800 text-[#22c55e]'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            ⚽ Arrendar Horario (5 vs 5)
          </button>

          <button
            onClick={() => {
              onRoleChange('player');
              onViewChange('home');
              setTimeout(() => {
                document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="px-3.5 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-850 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Ubicación</span>
          </button>

          <button
            onClick={() => {
              onRoleChange('player');
              onViewChange('reels');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all cursor-pointer ${
              activeView === 'reels' && currentRole === 'player'
                ? 'bg-[#22c55e]/20 text-[#22c55e] border border-[#22c55e]/40'
                : 'text-slate-300 hover:text-white hover:bg-slate-850'
            }`}
          >
            <Video className="w-3.5 h-3.5 text-[#22c55e]" />
            <span>Reels & Goles</span>
          </button>
        </div>

        {/* Acciones de Cabecera: Asistente IA, Conmutador y Login */}
        <div className="flex items-center gap-2.5">
          {/* Botón Asistente IA */}
          {onOpenAI && (
            <button
              onClick={onOpenAI}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Preguntar a CanchaBot IA"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Asistente IA</span>
            </button>
          )}

          {/* Selector de Modo: Jugador vs Dueño */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => {
                onRoleChange('player');
                onViewChange('booking');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'player'
                  ? 'bg-emerald-500 text-slate-950 shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>⚽</span>
              <span className="hidden sm:inline">Cliente</span>
            </button>

            <button
              onClick={() => onRoleChange('owner')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRole === 'owner'
                  ? 'bg-emerald-500 text-slate-950 shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>👑</span>
              <span className="hidden sm:inline">Dueño</span>
            </button>
          </div>

          {/* Botón Ingresar / Login Propio con Normativas */}
          <button
            onClick={() => onOpenAuth('login')}
            className="px-3.5 py-1.5 rounded-xl border border-emerald-500/40 bg-slate-900 hover:bg-slate-800 text-emerald-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Ingresar</span>
          </button>
        </div>
      </div>
    </header>
  );
};
