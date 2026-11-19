import React from 'react';
import { Complex } from '../../types';
import { INITIAL_AUDIT_LOGS, CURRENT_SLA_METRICS } from '../../services/itilService';
import { 
  ShieldCheck, 
  Server, 
  Database, 
  Radio, 
  CreditCard, 
  Activity, 
  CheckCircle, 
  Lock, 
  Users, 
  Building, 
  TrendingUp, 
  Terminal,
  Cpu
} from 'lucide-react';

interface SuperAdminDashboardProps {
  complexes: Complex[];
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ complexes }) => {
  const microservices = [
    { name: 'Yield Dynamic Pricing Core', status: 'healthy', latency: '35 ms', uptime: '99.98%' },
    { name: 'MQTT Broker Industrial (SEC NCh4)', status: 'healthy', latency: '18 ms', uptime: '99.99%' },
    { name: 'Transbank Webpay Plus Gateway', status: 'healthy', latency: '140 ms', uptime: '99.92%' },
    { name: 'PostgreSQL Multi-Tenant DB', status: 'healthy', latency: '6 ms', uptime: '99.99%' },
    { name: 'Edge Sync Gateway (Chillán Local Hub)', status: 'healthy', latency: '22 ms', uptime: '99.95%' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner de Métricas SaaS Globales */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-brand-500/20 text-brand-300 border border-brand-500/30">
                SuperAdmin SaaS • Control Tower Ñuble
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                ITIL v4 & OWASP Compliant
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white mt-2">
              Gestión Global de la Plataforma CanCha Smart-Complex
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Supervisión de infraestructura cloud, salud de la flota IoT y modelo de negocio SaaS para recintos deportivos.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">MRR Plataforma</span>
              <span className="text-xl font-black text-emerald-400 font-mono">$14.850.000 <span className="text-xs text-slate-400 font-normal">CLP</span></span>
            </div>
            <div className="bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800 text-right">
              <span className="text-[10px] text-slate-500 block uppercase font-mono">ARR Anualizado</span>
              <span className="text-xl font-black text-brand-300 font-mono">$178.200.000 <span className="text-xs text-slate-400 font-normal">CLP</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Tarjetas de SLAs ITIL v4 y Seguridad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Uptime Cloud SLA (ITIL v4)</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {CURRENT_SLA_METRICS.systemUptimePercentage}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Meta contractural: &gt; 99.90%</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Latencia Conmutación IoT SEC</span>
            <Radio className="w-4 h-4 text-brand-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {CURRENT_SLA_METRICS.iotRelaySwitchLatencyMs} <span className="text-xs font-normal text-slate-400">ms</span>
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">Sub-segundo garantizado</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Transacciones Concurrencia OWASP</span>
            <Lock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            {CURRENT_SLA_METRICS.preventedDoubleBookings} <span className="text-xs font-normal text-slate-400">mitigadas</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cero dobles reservas registradas</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
          <div className="flex justify-between items-center text-xs text-slate-400">
            <span>Complejos Activos en Ñuble</span>
            <Building className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {complexes.length} <span className="text-xs font-normal text-slate-400">recintos</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Chillán & San Carlos</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Health Check de Microservicios */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-brand-400" />
              Arquitectura de Microservicios Cloud
            </h4>
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle className="w-3.5 h-3.5" /> All Systems Operational
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {microservices.map((ms, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-white block">{ms.name}</span>
                  <span className="text-[11px] text-slate-500 font-mono">Uptime: {ms.uptime}</span>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {ms.latency}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Tenants Activos en Ñuble */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <h5 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
              Recintos Deportivos Conectados (Tenants)
            </h5>
            <div className="space-y-2">
              {complexes.map(c => (
                <div key={c.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{c.name}</span>
                    <span className="text-[11px] text-slate-400">{c.commune} • {c.courts.length} Canchas Conectadas</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">
                    ${c.financialMetrics.monthlyGrossRevenue.toLocaleString('es-CL')} /m
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Logs de Auditoría Inmutables (OWASP & SEC) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-base text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              Consola de Auditoría Inmutable (OWASP & SEC)
            </h4>
            <span className="text-xs text-slate-400 font-mono">Live Audit Stream</span>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 p-3 max-h-[380px] overflow-y-auto space-y-2 font-mono text-xs">
            {INITIAL_AUDIT_LOGS.map(log => {
              const isWarning = log.severity === 'WARNING';
              return (
                <div 
                  key={log.id} 
                  className={`p-2.5 rounded-lg border ${
                    isWarning 
                      ? 'bg-amber-950/20 border-amber-800/40 text-amber-200' 
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px] text-slate-500 mb-1">
                    <span>{log.timestamp} • Fuente: <strong className="text-slate-300">{log.source}</strong></span>
                    <span className={`px-1.5 py-0.2 rounded font-bold ${
                      isWarning ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                    }`}>
                      {log.eventType}
                    </span>
                  </div>
                  <p className="text-[11px]">{log.details}</p>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
            <span>Firma Criptográfica SHA-256 en registros de relé</span>
            <span className="font-mono text-brand-400 text-[11px]">Validación HMAC: ACTIVA</span>
          </div>
        </div>
      </div>
    </div>
  );
};
