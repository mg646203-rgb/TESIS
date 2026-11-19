import React, { useState } from 'react';
import { Court } from '../types';
import { 
  Zap, 
  Lightbulb, 
  CheckCircle2, 
  Activity, 
  Radio, 
  Clock, 
  Sparkles,
  ShieldCheck,
  Power
} from 'lucide-react';

interface DigitalTwinMapProps {
  courts: Court[];
  onToggleCourtRelay?: (courtId: string) => void;
  selectedCourtId?: string;
  onSelectCourt?: (court: Court) => void;
}

export const DigitalTwinMap: React.FC<DigitalTwinMapProps> = ({
  courts,
  onToggleCourtRelay,
  onSelectCourt
}) => {
  const [viewMode, setViewMode] = useState<'operational' | 'telemetry'>('operational');

  // La cancha única de babyfútbol
  const court = courts[0];
  const isLightsOn = court?.iot?.relayState ?? false;
  const isDoorUnlocked = court?.iot?.turnstileUnlocked ?? false;

  return (
    <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 shadow-2xl relative overflow-hidden space-y-5">
      {/* Cabecera del Plano Digital */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <h3 className="font-black text-xl text-white tracking-tight">
              Gemelo Digital Cancha de Babyfútbol (30 × 18 m)
            </h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-mono font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              IoT SEC NCh4 Online
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Plano interactivo en tiempo real con 4 torres de iluminación LED, torniquete de acceso y telemetría de potencia.
          </p>
        </div>

        {/* Switch de Modo */}
        <div className="flex items-center bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setViewMode('operational')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'operational'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Modo Operativo (Luces)</span>
          </button>
          <button
            onClick={() => setViewMode('telemetry')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
              viewMode === 'telemetry'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Telemetría SEC (kW / A)</span>
          </button>
        </div>
      </div>

      {/* CONTROLES DIRECTOS RÁPIDOS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block">4 Torres Reflectores</span>
            <span className={`text-xs font-bold ${isLightsOn ? 'text-emerald-400' : 'text-slate-500'}`}>
              {isLightsOn ? 'ENCENDIDAS (8x200W)' : 'APAGADAS (Ahorro)'}
            </span>
          </div>
          {onToggleCourtRelay && court && (
            <button
              onClick={() => onToggleCourtRelay(court.id)}
              className={`p-2 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
                isLightsOn 
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
              title="Conmutar relé trifásico de las torres de focos LED"
            >
              <Power className="w-3.5 h-3.5" />
              <span>{isLightsOn ? 'Apagar' : 'Encender'}</span>
            </button>
          )}
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Potencia Activa (Sensor CT)</span>
          <span className="text-sm font-black text-white font-mono">
            {isLightsOn ? `${court?.iot.activePowerKw} kW` : '0.02 kW'}
          </span>
          <span className="text-[10px] text-slate-400 ml-1">({isLightsOn ? `${court?.iot.currentAmperes} A` : '0.1 A'})</span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Acceso / Torniquete</span>
          <span className={`text-xs font-bold ${isDoorUnlocked ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {isDoorUnlocked ? 'Acceso Libre (QR OK)' : 'Control Torniquete QR'}
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Partidos Jugados Hoy</span>
          <span className="text-sm font-black text-emerald-400 font-mono">
            4 Partidos (4.0 hrs)
          </span>
        </div>
      </div>

      {/* PLANO SVG INTERACTIVO DE LA CANCHA */}
      <div className="relative w-full aspect-[16/9] max-h-[500px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
        {/* Efecto de Iluminación Ambiental */}
        <div 
          className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
            isLightsOn 
              ? 'opacity-100 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-400/10 via-emerald-500/10 to-transparent' 
              : 'opacity-40 bg-black/60'
          }`}
        ></div>

        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full select-none"
        >
          {/* Fondo del recinto (Suelo y circulaciones) */}
          <rect x="0" y="0" width="1000" height="600" fill="#090d16" />

          {/* Zona de Estacionamiento y Acceso */}
          <g transform="translate(30, 40)">
            <rect x="0" y="0" width="100" height="150" rx="8" fill="#111827" stroke="#1f2937" strokeWidth="2" />
            <text x="50" y="30" textAnchor="middle" fill="#9ca3af" fontSize="11" fontWeight="bold">ACCESO</text>
            <text x="50" y="50" textAnchor="middle" fill="#6b7280" fontSize="9">Portón & Autos</text>
            <path d="M 15 80 L 85 80 M 15 110 L 85 110" stroke="#374151" strokeDasharray="4,4" />
          </g>

          {/* Torniquete Peatonal con Escáner QR */}
          <g transform="translate(145, 80)">
            <rect 
              x="0" 
              y="0" 
              width="35" 
              height="70" 
              rx="6" 
              fill={isDoorUnlocked ? '#064e3b' : '#1e1b4b'} 
              stroke={isDoorUnlocked ? '#10b981' : '#6366f1'} 
              strokeWidth="2" 
            />
            <text x="17.5" y="30" textAnchor="middle" fill="#e2e8f0" fontSize="8" fontWeight="bold">QR</text>
            <circle cx="17.5" cy="48" r="5" fill={isDoorUnlocked ? '#22c55e' : '#818cf8'} className="animate-pulse" />
          </g>

          {/* Camarines & Duchas */}
          <g transform="translate(30, 240)">
            <rect x="0" y="0" width="120" height="150" rx="8" fill="#0f172a" stroke="#1e2937" strokeWidth="2" />
            <text x="60" y="35" textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="bold">🚿 CAMARINES</text>
            <text x="60" y="60" textAnchor="middle" fill="#94a3b8" fontSize="10">Duchas & Baños</text>
            <text x="60" y="80" textAnchor="middle" fill="#64748b" fontSize="9">Agua Caliente OK</text>
            <rect x="20" y="105" width="80" height="25" rx="4" fill="#020617" stroke="#334155" />
            <text x="60" y="122" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">Local & Visita</text>
          </g>

          {/* Quincho & Tercer Tiempo */}
          <g transform="translate(30, 430)">
            <rect x="0" y="0" width="120" height="130" rx="8" fill="#1e1b18" stroke="#78350f" strokeWidth="2" />
            <text x="60" y="35" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">🥩 QUINCHO</text>
            <text x="60" y="58" textAnchor="middle" fill="#d97706" fontSize="10">Tercer Tiempo</text>
            <text x="60" y="80" textAnchor="middle" fill="#92400e" fontSize="9">Parrilla & Mesas</text>
            <rect x="25" y="95" width="70" height="20" rx="4" fill="#292524" />
            <text x="60" y="109" textAnchor="middle" fill="#fef08a" fontSize="8">Asado Post-Partido</text>
          </g>

          {/* LA CANCHA PRINCIPAL DE BABYFÚTBOL (30 x 18m) */}
          <g transform="translate(200, 50)">
            {/* Césped Sintético Base */}
            <rect 
              x="0" 
              y="0" 
              width="750" 
              height="500" 
              rx="12" 
              fill="#064e3b" 
              stroke="#047857" 
              strokeWidth="4" 
            />

            {/* Franjas de corte de pasto sintético */}
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect 
                key={i} 
                x={i * 93.75} 
                y="0" 
                width="46.8" 
                height="500" 
                fill="#047857" 
                opacity="0.25" 
              />
            ))}

            {/* Borde exterior reglamentario (Líneas blancas) */}
            <rect 
              x="25" 
              y="25" 
              width="700" 
              height="450" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3" 
              opacity="0.9" 
            />

            {/* Línea de mitad de cancha */}
            <line 
              x1="375" 
              y1="25" 
              x2="375" 
              y2="475" 
              stroke="#ffffff" 
              strokeWidth="3" 
              opacity="0.9" 
            />

            {/* Círculo central */}
            <circle 
              cx="375" 
              cy="250" 
              r="60" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3" 
              opacity="0.9" 
            />
            <circle cx="375" cy="250" r="5" fill="#ffffff" />

            {/* Área Penal Izquierda (Arco A) */}
            <path 
              d="M 25 150 L 125 150 A 60 60 0 0 1 125 350 L 25 350" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3" 
              opacity="0.9" 
            />
            <circle cx="95" cy="250" r="4" fill="#ffffff" />

            {/* Arco Izquierdo (Malla) */}
            <rect 
              x="5" 
              y="200" 
              width="20" 
              height="100" 
              fill="#1e293b" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
            />
            <line x1="5" y1="225" x2="25" y2="225" stroke="#94a3b8" strokeDasharray="2,2" />
            <line x1="5" y1="250" x2="25" y2="250" stroke="#94a3b8" strokeDasharray="2,2" />
            <line x1="5" y1="275" x2="25" y2="275" stroke="#94a3b8" strokeDasharray="2,2" />

            {/* Área Penal Derecha (Arco B) */}
            <path 
              d="M 725 150 L 625 150 A 60 60 0 0 0 625 350 L 725 350" 
              fill="none" 
              stroke="#ffffff" 
              strokeWidth="3" 
              opacity="0.9" 
            />
            <circle cx="655" cy="250" r="4" fill="#ffffff" />

            {/* Arco Derecho (Malla) */}
            <rect 
              x="725" 
              y="200" 
              width="20" 
              height="100" 
              fill="#1e293b" 
              stroke="#ffffff" 
              strokeWidth="2.5" 
            />
            <line x1="725" y1="225" x2="745" y2="225" stroke="#94a3b8" strokeDasharray="2,2" />
            <line x1="725" y1="250" x2="745" y2="250" stroke="#94a3b8" strokeDasharray="2,2" />
            <line x1="725" y1="275" x2="745" y2="275" stroke="#94a3b8" strokeDasharray="2,2" />

            {/* Letrero Central en la Cancha */}
            <text 
              x="375" 
              y="120" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="16" 
              fontWeight="900" 
              opacity="0.8" 
              letterSpacing="2"
            >
              CANCHA DE BABYFÚTBOL CHILLÁN
            </text>
            <text 
              x="375" 
              y="140" 
              textAnchor="middle" 
              fill="#a7f3d0" 
              fontSize="11" 
              fontWeight="bold" 
              opacity="0.7"
            >
              Pasto Sintético FIFA Quality • 5 vs 5
            </text>

            {/* Bancas de Suplentes techadas (Superior e Inferior) */}
            <g transform="translate(250, 2)">
              <rect x="0" y="0" width="100" height="18" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="50" y="12" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="bold">Banca Local</text>
            </g>
            <g transform="translate(400, 2)">
              <rect x="0" y="0" width="100" height="18" rx="4" fill="#1e293b" stroke="#334155" />
              <text x="50" y="12" textAnchor="middle" fill="#cbd5e1" fontSize="8" fontWeight="bold">Banca Visita</text>
            </g>

            {/* 4 TORRES DE ILUMINACIÓN LED ESQUINERA (SEC) */}
            {/* Torre 1: Nororiente */}
            <g transform="translate(10, 10)">
              <circle cx="10" cy="10" r="14" fill="#0f172a" stroke={isLightsOn ? '#fbbf24' : '#475569'} strokeWidth="2" />
              <circle cx="10" cy="10" r="6" fill={isLightsOn ? '#fbbf24' : '#334155'} />
              {isLightsOn && (
                <path d="M 10 10 L 140 180 A 80 80 0 0 1 180 140 Z" fill="#fef08a" opacity="0.15" />
              )}
            </g>

            {/* Torre 2: Suroriente */}
            <g transform="translate(10, 470)">
              <circle cx="10" cy="10" r="14" fill="#0f172a" stroke={isLightsOn ? '#fbbf24' : '#475569'} strokeWidth="2" />
              <circle cx="10" cy="10" r="6" fill={isLightsOn ? '#fbbf24' : '#334155'} />
              {isLightsOn && (
                <path d="M 10 10 L 140 -160 A 80 80 0 0 0 180 -120 Z" fill="#fef08a" opacity="0.15" />
              )}
            </g>

            {/* Torre 3: Norponiente */}
            <g transform="translate(720, 10)">
              <circle cx="10" cy="10" r="14" fill="#0f172a" stroke={isLightsOn ? '#fbbf24' : '#475569'} strokeWidth="2" />
              <circle cx="10" cy="10" r="6" fill={isLightsOn ? '#fbbf24' : '#334155'} />
              {isLightsOn && (
                <path d="M 10 10 L -120 180 A 80 80 0 0 0 -160 140 Z" fill="#fef08a" opacity="0.15" />
              )}
            </g>

            {/* Torre 4: Surponiente */}
            <g transform="translate(720, 470)">
              <circle cx="10" cy="10" r="14" fill="#0f172a" stroke={isLightsOn ? '#fbbf24' : '#475569'} strokeWidth="2" />
              <circle cx="10" cy="10" r="6" fill={isLightsOn ? '#fbbf24' : '#334155'} />
              {isLightsOn && (
                <path d="M 10 10 L -120 -160 A 80 80 0 0 1 -160 -120 Z" fill="#fef08a" opacity="0.15" />
              )}
            </g>

            {/* Indicador de Estado del Partido Actual */}
            <g transform="translate(250, 440)">
              <rect x="0" y="0" width="250" height="30" rx="15" fill="#020617" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="20" cy="15" r="5" fill="#22c55e" className="animate-ping" />
              <circle cx="20" cy="15" r="5" fill="#22c55e" />
              <text x="35" y="19" fill="#e2e8f0" fontSize="10" fontWeight="bold">
                EN JUEGO: Los Galácticos vs Baquedano
              </text>
            </g>
          </g>
        </svg>
      </div>

      {/* PIE DEL GEMELO DIGITAL */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            4 Torres LED (8 proyectores x 200W)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            Pasto sintético 50mm con caucho amortiguador
          </span>
        </div>

        <div className="font-mono text-[11px] text-slate-500">
          Tablero Eléctrico: Contactor Schneider LC1D25 • Sensor CT SCT-013 (0-30A)
        </div>
      </div>
    </div>
  );
};
