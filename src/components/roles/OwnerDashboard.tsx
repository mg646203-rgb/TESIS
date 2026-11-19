import React, { useState } from 'react';
import { Complex, Court, WeatherCondition, Reservation, FinancialScenario } from '../../types';
import { DigitalTwinMap } from '../DigitalTwinMap';
import { calculateDynamicPrice } from '../../services/yieldEngine';
import { FINANCIAL_SCENARIOS } from '../../data/mockData';
import { 
  Building2, 
  TrendingUp, 
  Zap, 
  Sliders, 
  Calculator, 
  DollarSign, 
  BarChart3, 
  Percent, 
  CheckCircle2,
  Sparkles,
  HelpCircle,
  Clock,
  Power,
  Users,
  QrCode,
  Calendar,
  Share2,
  Phone,
  ShieldCheck,
  Check,
  AlertCircle
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend 
} from 'recharts';

interface OwnerDashboardProps {
  complex: Complex;
  courts: Court[];
  weather: WeatherCondition;
  onToggleCourtRelay: (courtId: string) => void;
  onUpdateYieldConfig: (newConfig: Complex['yieldConfig']) => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  complex,
  courts,
  weather,
  onToggleCourtRelay,
  onUpdateYieldConfig
}) => {
  const [activeTab, setActiveTab] = useState<'control' | 'agenda' | 'yield' | 'financial'>('control');
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('scen-baby-techado');

  // La cancha de Babyfútbol
  const court = courts[0];
  const isLightsOn = court?.iot?.relayState ?? false;

  // Escáner QR del dueño
  const [qrCodeInput, setQrCodeInput] = useState<string>('BABY-7789-SEC');
  const [qrScanFeedback, setQrScanFeedback] = useState<string | null>(null);

  const handleValidateQR = () => {
    if (qrCodeInput.trim()) {
      setQrScanFeedback(`✓ Pase ${qrCodeInput} Validado: Acceso autorizado. Portón desbloqueado.`);
      if (!isLightsOn && court) {
        onToggleCourtRelay(court.id);
      }
      setTimeout(() => setQrScanFeedback(null), 4000);
    }
  };

  // Simulación de curva de precios a lo largo del día para el Yield Management
  const hoursOfDay = [
    '10:00', '12:00', '15:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];

  const yieldSimulationData = hoursOfDay.map(hour => {
    const slot = `${hour} - ${parseInt(hour.split(':')[0]) + 1}:00`;
    const breakdown = calculateDynamicPrice(
      court ? court.basePricePerHour : 28000, 
      slot, 
      '2026-10-05', 
      0.75, 
      weather, 
      complex.yieldConfig
    );

    return {
      hour,
      tarifaBase: court ? court.basePricePerHour : 28000,
      tarifaDinamica: breakdown.finalPrice,
      porJugador: Math.round(breakdown.finalPrice / 10),
      multiplicador: breakdown.surgeMultiplier
    };
  });

  const selectedScenario = FINANCIAL_SCENARIOS.find(s => s.id === selectedScenarioId) || FINANCIAL_SCENARIOS[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* BANNER DE CABECERA DEL DUEÑO */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
              👑 Panel Exclusivo del Dueño
            </span>
            <span className="text-xs text-slate-400">
              Dueño: Marcelo Gutiérrez • {complex.name}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
            Gestión de Mi Cancha de Babyfútbol
          </h2>
          <p className="text-xs text-slate-400">
            Control de reflectores LED industriales, validación de pases QR en puerta, agenda de partidos y finanzas.
          </p>
        </div>

        {/* SELECTOR DE PESTAÑAS DEL DUEÑO */}
        <div className="flex flex-wrap bg-slate-950 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('control')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'control'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🏟️ Cancha & Luces IoT
          </button>
          <button
            onClick={() => setActiveTab('agenda')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'agenda'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📅 Agenda de Partidos
          </button>
          <button
            onClick={() => setActiveTab('yield')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'yield'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Tarificación Inteligente
          </button>
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer ${
              activeTab === 'financial'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📈 Finanzas & Mejoras
          </button>
        </div>
      </div>

      {/* TOP METRICS DEL NEGOCIO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ingresos del Mes</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            ${complex.financialMetrics.monthlyGrossRevenue.toLocaleString('es-CL')}
          </div>
          <div className="text-xs text-emerald-400 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3.5 h-3.5" /> +26.8% gracias a tarifa dinámica
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Gasto Eléctrico Luces LED</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            ${complex.financialMetrics.monthlyElectricityCost.toLocaleString('es-CL')}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Apagado automático ahorra ~$140.000/mes
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ocupación de Cancha</span>
            <Percent className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">
            {complex.financialMetrics.averageOccupancyRate}%
          </div>
          <div className="text-xs text-cyan-400 mt-1">
            Prime 19:00 a 23:00 con 95% de ocupación
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Partidos Agendados Hoy</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            4 Partidos
          </div>
          <div className="text-xs text-slate-400 mt-1">
            40 futbolistas jugando en total
          </div>
        </div>
      </div>

      {/* PESTAÑA 1: CONTROL DE CANCHA & ILUMINACIÓN IOT */}
      {activeTab === 'control' && (
        <div className="space-y-6">
          <DigitalTwinMap
            courts={courts}
            onToggleCourtRelay={onToggleCourtRelay}
          />

          {/* Consola de Acceso y Puerta para el Dueño */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  Control de Entrada & Escáner de Pases QR
                </h3>
                <p className="text-xs text-slate-400">
                  Valida la llegada del equipo en portería para abrir el torniquete y prender los reflectores.
                </p>
              </div>
            </div>

            {qrScanFeedback && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-in fade-in">
                {qrScanFeedback}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={qrCodeInput}
                onChange={(e) => setQrCodeInput(e.target.value)}
                placeholder="Código QR del pase (ej: BABY-7789-SEC)"
                className="flex-1 min-w-[240px] px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={handleValidateQR}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
              >
                Validar Entrada & Abrir Acceso
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: AGENDA DE PARTIDOS */}
      {activeTab === 'agenda' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-400" />
                Partidos Programados en tu Cancha
              </h3>
              <p className="text-xs text-slate-400">
                Horarios tomados por equipos locales para hoy y los próximos días.
              </p>
            </div>
            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
              Cancha Principal (5 vs 5)
            </span>
          </div>

          <div className="space-y-3">
            {[
              {
                time: '19:00 - 20:00',
                team: 'Los Amigos FC vs Chillán City',
                captain: 'Carlos Muñoz',
                phone: '+56 9 7845 1120',
                paid: true,
                total: 28000,
                status: 'Próximo partido'
              },
              {
                time: '20:00 - 21:00',
                team: 'Los Galácticos vs Real Baquedano',
                captain: 'Marcelo Gutiérrez',
                phone: '+56 9 8451 2230',
                paid: true,
                total: 33600,
                status: 'En Juego Ahora (Luces ON)'
              },
              {
                time: '21:00 - 22:00',
                team: 'Deportivo Chillán Viejo vs Los Cracks',
                captain: 'Fabián Ortega',
                phone: '+56 9 7612 9904',
                paid: true,
                total: 35000,
                status: 'Confirmado Webpay'
              },
              {
                time: '22:00 - 23:00',
                team: 'Tercer Tiempo FC (Asado en Quincho)',
                captain: 'Benjamín Escarez',
                phone: '+56 9 9341 5567',
                paid: true,
                total: 42200,
                status: 'Cancha + Quincho'
              }
            ].map((p, idx) => (
              <div 
                key={idx}
                className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      {p.time}
                    </span>
                    <span className="font-bold text-white text-sm">{p.team}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-3">
                    <span>Capitán: <strong className="text-slate-200">{p.captain}</strong></span>
                    <span>•</span>
                    <a 
                      href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {p.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Total Cobrado</span>
                    <span className="text-sm font-black text-white font-mono">${p.total.toLocaleString('es-CL')}</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PESTAÑA 3: TARIFICACIÓN INTELIGENTE (YIELD MANAGEMENT) */}
      {activeTab === 'yield' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-emerald-400" />
                Calibrador de Tarifa Dinámica para tu Cancha de Babyfútbol
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Ajusta cómo responde la tarifa según el horario prime nocturno con focos LED, fines de semana o lluvia en Chillán.
              </p>
            </div>

            {/* Curva de Precios Gráfica */}
            <div className="h-64 w-full bg-slate-950 p-4 rounded-2xl border border-slate-800">
              <span className="text-xs font-bold text-slate-400 block mb-2">
                Curva de Tarifa Estimada a lo Largo del Día ($ CLP / hora)
              </span>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={yieldSimulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="hour" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[18000, 38000]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tarifaDinamica" 
                    stroke="#10b981" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#10b981' }} 
                    name="Tarifa Dinámica ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="tarifaBase" 
                    stroke="#475569" 
                    strokeDasharray="4 4" 
                    name="Tarifa Base ($)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Controles y Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Ponderación Horario Prime Nocturno (Focos LED):</span>
                  <span className="text-emerald-400 font-mono">{(complex.yieldConfig.weightTimeSlot * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={complex.yieldConfig.weightTimeSlot}
                  onChange={(e) => onUpdateYieldConfig({ ...complex.yieldConfig, weightTimeSlot: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Aplica recargo automático de 19:00 a 23:00 hrs por uso de luminarias.
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Ponderación Descuento por Lluvia en Chillán:</span>
                  <span className="text-cyan-400 font-mono">{(complex.yieldConfig.weightWeatherÑuble * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={complex.yieldConfig.weightWeatherÑuble}
                  onChange={(e) => onUpdateYieldConfig({ ...complex.yieldConfig, weightWeatherÑuble: parseFloat(e.target.value) })}
                  className="w-full accent-cyan-500"
                />
                <span className="text-[11px] text-slate-500 block">
                  Aplica descuentos automáticos en días lluviosos para incentivar reservas.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 4: FINANZAS & SIMULADOR DE MEJORAS */}
      {activeTab === 'financial' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                Simulador de Inversiones para Tu Cancha de Babyfútbol
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Evalúa financieramente el impacto de techar la cancha o instalar paneles solares para reducir tu cuenta de luz.
              </p>
            </div>

            {/* Selector de Escenarios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {FINANCIAL_SCENARIOS.map((scen) => (
                <div
                  key={scen.id}
                  onClick={() => setSelectedScenarioId(scen.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 ${
                    selectedScenarioId === scen.id
                      ? 'border-emerald-500 bg-emerald-950/40 shadow-xl'
                      : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                  }`}
                >
                  <h4 className="font-bold text-sm text-white">{scen.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{scen.description}</p>
                  <div className="pt-2 border-t border-slate-800/80 flex justify-between text-xs font-mono font-bold">
                    <span className="text-slate-400">VAN 5 Años:</span>
                    <span className="text-emerald-400">${scen.financialOutputs.van5YearsCLP.toLocaleString('es-CL')}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Resultados del Escenario Seleccionado */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-mono">Inversión (CAPEX)</span>
                <span className="text-xl font-black text-white font-mono">
                  ${selectedScenario.capex.totalCapex.toLocaleString('es-CL')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-mono">VAN a 5 Años</span>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  ${selectedScenario.financialOutputs.van5YearsCLP.toLocaleString('es-CL')}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-mono">TIR Retorno</span>
                <span className="text-xl font-black text-cyan-400 font-mono">
                  {selectedScenario.financialOutputs.tirPercentage}%
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-mono">Recuperación Payback</span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {selectedScenario.financialOutputs.paybackYears} años
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
