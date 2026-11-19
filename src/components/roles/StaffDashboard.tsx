import React, { useState } from 'react';
import { Court, Reservation, ITILIncident } from '../../types';
import { validateQRAccess } from '../../services/iotGateway';
import { 
  Scan, 
  Lightbulb, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Zap, 
  Clock, 
  Wrench, 
  ShieldAlert,
  WifiOff,
  Radio
} from 'lucide-react';

interface StaffDashboardProps {
  courts: Court[];
  reservations: Reservation[];
  isOfflineMode: boolean;
  incidents: ITILIncident[];
  onToggleCourtRelay: (courtId: string) => void;
  onResolveIncident: (incidentId: string) => void;
  onManualQRValidated: (res: Reservation) => void;
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  courts,
  reservations,
  isOfflineMode,
  incidents,
  onToggleCourtRelay,
  onResolveIncident,
  onManualQRValidated
}) => {
  const [qrInput, setQrInput] = useState<string>('CCH-7789-Q4-SEC');
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    message: string;
    courtName?: string;
    playerName?: string;
  } | null>(null);

  const handleScanSubmit = (codeToScan: string) => {
    const res = validateQRAccess(codeToScan, reservations, isOfflineMode);

    if (res.success && res.reservation) {
      const c = courts.find(court => court.id === res.courtId);
      setScanResult({
        success: true,
        message: res.message,
        courtName: c?.name,
        playerName: res.reservation.playerName
      });

      // Si las luces no estaban encendidas, encenderlas automáticamente
      if (res.courtId && !c?.iot.relayState) {
        onToggleCourtRelay(res.courtId);
      }
      onManualQRValidated(res.reservation);
    } else {
      setScanResult({
        success: false,
        message: res.message
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Banner de Estado Operativo */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-brand-400 animate-pulse" />
            <h3 className="font-bold text-lg text-white">Consola de Operaciones de Terreno</h3>
            {isOfflineMode ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-mono">
                <WifiOff className="w-3 h-3" />
                Edge Autónomo ITIL
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                SEC Cloud Online
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Gestión rápida de torniquetes QR, conmutación forzada de luminarias y resolución de incidentes de recinto.
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">LUCES ACTIVAS</span>
            <span className="text-amber-400 font-bold text-sm">
              {courts.filter(c => c.iot.relayState).length} / {courts.length} Canchas
            </span>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <span className="text-slate-500 block text-[10px]">POTENCIA TOTAL</span>
            <span className="text-white font-bold text-sm">
              {courts.reduce((acc, c) => acc + (c.iot.relayState ? c.iot.activePowerKw : 0), 0).toFixed(1)} kW
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna Izquierda: Escáner QR de Acceso Peatonal */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="font-bold text-base text-white mb-2 flex items-center gap-2">
              <Scan className="w-4 h-4 text-brand-400" />
              Lector & Validador de Códigos QR (Torniquete Acceso)
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Simula la cámara lectora 2D instalada en el torniquete de acceso del complejo.
            </p>

            {/* Input Manual o Selección Rápida */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={qrInput}
                onChange={e => setQrInput(e.target.value)}
                placeholder="Ej: CCH-7789-Q4-SEC"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-brand-500 uppercase"
              />
              <button
                onClick={() => handleScanSubmit(qrInput)}
                className="px-4 py-2 bg-brand-500 hover:bg-brand-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                Validar QR
              </button>
            </div>

            {/* Pases recientes listos para probar con un clic */}
            <div className="space-y-1.5 mb-4">
              <span className="text-[11px] text-slate-500 font-semibold block">Pases QR disponibles para testeo:</span>
              <div className="flex flex-wrap gap-2">
                {reservations.map(res => (
                  <button
                    key={res.id}
                    onClick={() => {
                      setQrInput(res.qrAccessCode);
                      handleScanSubmit(res.qrAccessCode);
                    }}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono transition-colors"
                  >
                    {res.playerName.split(' ')[0]}: <strong className="text-brand-400">{res.qrAccessCode}</strong>
                  </button>
                ))}
              </div>
            </div>

            {/* Resultado del Escaneo */}
            {scanResult && (
              <div className={`p-4 rounded-xl border text-xs animate-in fade-in zoom-in-95 duration-200 ${
                scanResult.success 
                  ? 'bg-emerald-950/80 border-emerald-600/70 text-emerald-200' 
                  : 'bg-rose-950/80 border-rose-600/70 text-rose-200'
              }`}>
                <div className="flex items-start gap-3">
                  {scanResult.success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <strong className="block text-sm font-bold text-white mb-1">
                      {scanResult.success ? 'Torniquete Desbloqueado (Acceso Concedido)' : 'Acceso Denegado'}
                    </strong>
                    <p>{scanResult.message}</p>
                    {scanResult.courtName && (
                      <div className="mt-2 pt-2 border-t border-emerald-800/60 font-mono text-[11px]">
                        Jugador: <span className="font-bold text-white">{scanResult.playerName}</span> • Cancha Asignada: <span className="font-bold text-white">{scanResult.courtName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gestión de Incidentes ITIL v4 en Terreno */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <h4 className="font-bold text-base text-white mb-3 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Incidencias Operativas ITIL en Curso ({incidents.filter(i => i.status !== 'resolved').length})
            </h4>

            <div className="space-y-3">
              {incidents.map(inc => {
                const isInvestigating = inc.status === 'investigating';
                return (
                  <div key={inc.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-400">{inc.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        inc.status === 'resolved' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}>
                        {inc.status}
                      </span>
                    </div>
                    <div className="font-semibold text-white">{inc.title}</div>
                    <p className="text-slate-400 text-[11px]">{inc.resolutionNotes}</p>

                    {isInvestigating && (
                      <div className="pt-2 flex justify-end">
                        <button
                          onClick={() => onResolveIncident(inc.id)}
                          className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition-colors"
                        >
                          Marcar como Resuelto (SLA Cumplido)
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Columna Derecha: Panel de Control Manual de Relés Industriales (SEC) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-base text-white flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-brand-400" />
                Tablero de Conmutación de Luminarias (SEC NCh4)
              </h4>
              <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                Contactores 32A
              </span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Control de anulación manual (Override) con protección de arco eléctrico e histeresis de seguridad.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courts.map(court => {
                const isOn = court.iot.relayState;
                return (
                  <div
                    key={court.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isOn 
                        ? 'border-amber-500/70 bg-amber-950/20 shadow-md shadow-amber-500/5' 
                        : 'border-slate-800 bg-slate-950'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-xs text-white">{court.name}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${isOn ? 'bg-amber-400 animate-ping' : 'bg-slate-700'}`}></span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400 space-y-0.5 mb-3">
                      <div>Corriente: <span className="text-white font-bold">{court.iot.currentAmperes} A</span></div>
                      <div>Potencia: <span className="text-white font-bold">{court.iot.activePowerKw} kW</span></div>
                      <div>Disyuntor: <span className="text-emerald-400 font-bold">OK (Norma SEC)</span></div>
                    </div>

                    <button
                      onClick={() => onToggleCourtRelay(court.id)}
                      className={`w-full py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        isOn
                          ? 'bg-rose-600 hover:bg-rose-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                      }`}
                    >
                      <Lightbulb className="w-3.5 h-3.5" />
                      <span>{isOn ? 'Forzar Apagado' : 'Encender Manual'}</span>
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Atención Operativa:</strong> Las conmutaciones manuales quedan registradas en el log inmutable de auditoría para conciliar gastos eléctricos con la facturación del turno.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
