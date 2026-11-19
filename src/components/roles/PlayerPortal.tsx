import React, { useState } from 'react';
import { Complex, Court, WeatherCondition, Reservation } from '../../types';
import { calculateDynamicPrice } from '../../services/yieldEngine';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  QrCode, 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  Flame, 
  Zap, 
  Users, 
  Trophy, 
  Share2, 
  Copy, 
  Check, 
  Award,
  CircleDollarSign,
  ChevronRight,
  Sun,
  CloudRain,
  Timer,
  Phone,
  CheckSquare,
  Square
} from 'lucide-react';

interface PlayerPortalProps {
  complex: Complex;
  courts: Court[];
  weather: WeatherCondition;
  reservations: Reservation[];
  onNewReservation: (res: Reservation) => void;
  onSimulateQRScan: (qrCode: string) => void;
}

export const PlayerPortal: React.FC<PlayerPortalProps> = ({
  complex,
  courts,
  weather,
  reservations,
  onNewReservation,
  onSimulateQRScan
}) => {
  const [activeTab, setActiveTab] = useState<'book' | 'my-passes'>('book');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-05');
  const [selectedSlot, setSelectedSlot] = useState<string | null>('20:00 - 21:00');
  const [includeBarbecue, setIncludeBarbecue] = useState<boolean>(false);

  // Formulario del Capitán
  const [playerName, setPlayerName] = useState<string>('Marcelo Gutiérrez');
  const [playerEmail, setPlayerEmail] = useState<string>('marcelo.g@inacap.cl');
  const [playerPhone, setPlayerPhone] = useState<string>('+56 9 8451 2230');

  // Estado de checkout y feedback
  const [isCheckingOut, setIsCheckingOut] = useState<boolean>(false);
  const [bookingSuccessModal, setBookingSuccessModal] = useState<Reservation | null>(null);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // La cancha única de Babyfútbol
  const activeCourt = courts[0];

  // Horarios de juego de 1 hora
  const timeSlots = [
    { slot: '10:00 - 11:00', label: 'Mañana Diurna (Valle)' },
    { slot: '12:00 - 13:00', label: 'Mediodía (Valle)' },
    { slot: '15:00 - 16:00', label: 'Tarde Temprana' },
    { slot: '17:00 - 18:00', label: 'Tarde / After Work' },
    { slot: '18:00 - 19:00', label: 'Inicio Jornada Tarde' },
    { slot: '19:00 - 20:00', label: 'Match Prime 1 (Luces LED)' },
    { slot: '20:00 - 21:00', label: 'Match Prime 2 (Estelar)' },
    { slot: '21:00 - 22:00', label: 'Match Nocturno' },
    { slot: '22:00 - 23:00', label: 'Cierre Nocturno' },
  ];

  // Cálculo de precio dinámico para el slot activo
  const activeBreakdown = activeCourt && selectedSlot ? calculateDynamicPrice(
    activeCourt.basePricePerHour,
    selectedSlot,
    selectedDate,
    0.75,
    weather,
    complex.yieldConfig
  ) : null;

  // Precio final considerando adicionales
  const barbecueExtra = includeBarbecue ? 10000 : 0;
  const rawFinalPrice = (activeBreakdown?.finalPrice || activeCourt?.basePricePerHour || 28000) + barbecueExtra;
  
  // 10 Jugadores en babyfútbol (5 vs 5)
  const pricePerPlayer = Math.round(rawFinalPrice / 10);

  // Confirmar reserva
  const handleConfirmBooking = () => {
    if (!activeCourt || !selectedSlot) return;

    setIsCheckingOut(true);

    setTimeout(() => {
      const randomCode = `BABY-${Math.floor(1000 + Math.random() * 9000)}-SEC`;
      const newRes: Reservation = {
        id: `res-${Date.now()}`,
        courtId: activeCourt.id,
        complexId: complex.id,
        playerName,
        playerEmail,
        playerPhone,
        date: selectedDate,
        timeSlot: selectedSlot,
        basePrice: activeCourt.basePricePerHour,
        finalPrice: rawFinalPrice,
        status: 'confirmed',
        paid: true,
        paymentMethod: 'webpay_plus',
        qrAccessCode: randomCode,
        qrValidFrom: `${selectedDate}T19:45:00`,
        qrValidUntil: `${selectedDate}T21:15:00`,
        lightsAutoEngaged: false,
        turnstilePassed: false,
        createdAt: new Date().toISOString()
      };

      onNewReservation(newRes);
      setIsCheckingOut(false);
      setBookingSuccessModal(newRes);
    }, 1200);
  };

  // Copiar mensaje para WhatsApp
  const handleCopyWhatsapp = () => {
    const text = `⚽ ¡Tenemos cancha de Babyfútbol confirmada en Chillán!\n📅 Fecha: ${selectedDate}\n⏰ Horario: ${selectedSlot}\n🏟️ Cancha: ${activeCourt?.name}\n💰 Total: $${rawFinalPrice.toLocaleString('es-CL')} (¡Solo $${pricePerPlayer.toLocaleString('es-CL')} cada uno!)\n📱 Entramos con el Pase QR inteligente y las luces se encienden solas. ¡Lleven zapatillas de baby!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* HERO DEPORTIVO */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/80 p-6 sm:p-8">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold tracking-wide uppercase">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              MATCHDAY • RESERVA TU CANCHA DE BABYFÚTBOL 5 VS 5
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Arrienda tu hora <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">online y entra con tu QR.</span>
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Elige tu horario, divide la cuenta entre los 10 jugadores ($ por persona) y desbloquea el torniquete al llegar con reflectores LED automáticos.
            </p>

            {/* Condiciones en Chillán */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-200">
                {weather.condition === 'lluvia_fuerte' ? (
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
                <span>Clima en Chillán: <strong>{weather.temperatureC}°C</strong> ({weather.condition.replace('_', ' ')})</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Pasto sintético FIFA Quality 50mm</span>
              </div>
            </div>
          </div>

          {/* Selector de Pestañas */}
          <div className="flex bg-slate-950/90 p-1.5 rounded-2xl border border-slate-800 shadow-xl">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'book'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Arrendar Cancha</span>
            </button>
            <button
              onClick={() => setActiveTab('my-passes')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'my-passes'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-lg shadow-emerald-500/25'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-4 h-4" />
              <span>Mis Pases QR ({reservations.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* PESTAÑA 1: ARRIENDO DE CANCHA */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* COLUMNA IZQUIERDA: CONFIGURACIÓN DEL PARTIDO */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Ficha de la Cancha de Babyfútbol */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-black">1</span>
                  Cancha Oficial de Babyfútbol
                </h3>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  5 vs 5 (10 Jugadores)
                </span>
              </div>

              <div className="p-4 rounded-2xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/40 via-slate-950 to-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚽</span>
                    <h4 className="font-black text-lg text-white">
                      {activeCourt ? activeCourt.name : 'Cancha Principal de Babyfútbol'}
                    </h4>
                  </div>
                  <p className="text-xs text-slate-300">
                    Pasto sintético 50mm con amortiguador criogénico • Medidas 30 × 18 metros • 4 Torres LED de 200W
                  </p>
                  <div className="flex flex-wrap items-center gap-2 pt-2 text-[11px] text-slate-400">
                    <span className="text-emerald-400 font-semibold">✓ Balón N°4 incluido</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">✓ 10 Petos lavados</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-semibold">✓ Camarines con agua caliente</span>
                  </div>
                </div>

                <div className="text-center sm:text-right bg-slate-950/80 px-4 py-2.5 rounded-xl border border-slate-800 whitespace-nowrap">
                  <span className="text-[10px] uppercase font-mono text-slate-400 block">Tarifa Base</span>
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ${activeCourt ? activeCourt.basePricePerHour.toLocaleString('es-CL') : '28.000'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">/ hora</span>
                </div>
              </div>
            </div>

            {/* 2. Selector de Fecha */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-black">2</span>
                Fecha del Partido
              </h3>

              <div className="flex flex-wrap items-center gap-3">
                {['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10'].map(d => {
                  const isSelected = selectedDate === d;
                  const dateObj = new Date(d + 'T12:00:00');
                  const dayName = dateObj.toLocaleDateString('es-CL', { weekday: 'short' });
                  const dayNum = dateObj.getDate();

                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDate(d)}
                      className={`px-4 py-3 rounded-2xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                          : 'border-slate-800 bg-slate-950 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="text-[10px] uppercase tracking-wider opacity-80">{dayName}</div>
                      <div className="text-lg font-bold font-mono">{dayNum}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Selector de Horarios de 1 hora con Tarifa Dinámica */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-black">3</span>
                  Horario de Partido (1 Hora)
                </h3>
                <span className="text-[11px] text-brand-400 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tarificación Inteligente
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {timeSlots.map(t => {
                  const isSelected = selectedSlot === t.slot;
                  const bd = calculateDynamicPrice(
                    activeCourt ? activeCourt.basePricePerHour : 28000,
                    t.slot,
                    selectedDate,
                    0.75,
                    weather,
                    complex.yieldConfig
                  );

                  const isDiscount = bd.finalPrice < bd.basePrice;
                  const isPeak = bd.finalPrice > bd.basePrice;

                  return (
                    <button
                      key={t.slot}
                      onClick={() => setSelectedSlot(t.slot)}
                      className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${
                        isSelected
                          ? 'border-emerald-500 bg-gradient-to-b from-emerald-950/80 to-slate-900 text-white ring-2 ring-emerald-500/40 shadow-lg shadow-emerald-500/10'
                          : 'border-slate-800 bg-slate-950/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-black text-sm">{t.slot.split(' - ')[0]}</span>
                        {isDiscount && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-black tracking-wide">
                            VALLE
                          </span>
                        )}
                        {isPeak && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-black tracking-wide flex items-center gap-0.5">
                            <Flame className="w-2.5 h-2.5" /> PRIME
                          </span>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 truncate">{t.label}</div>

                      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-baseline justify-between">
                        <span className="text-base font-black font-mono text-white">
                          ${bd.finalPrice.toLocaleString('es-CL')}
                        </span>
                        <span className="text-[10px] text-slate-500 line-through">
                          ${bd.basePrice.toLocaleString('es-CL')}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Comodidades adicionales */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-mono font-black">4</span>
                Servicios Adicionales Opcionales
              </h3>

              <div 
                onClick={() => setIncludeBarbecue(prev => !prev)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                  includeBarbecue 
                    ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500' 
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🥩</div>
                  <div>
                    <h5 className="font-bold text-sm text-white">Quincho & Parrilla para Tercer Tiempo</h5>
                    <p className="text-xs text-slate-400">
                      Uso de la zona techada de asados post-partido con mesas, parrilla y refrigerador para bebidas.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400 font-mono">+$10.000</span>
                  <div className="mt-1 flex justify-end">
                    {includeBarbecue ? (
                      <CheckSquare className="w-5 h-5 text-amber-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-600" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA DERECHA: RESUMEN, DIVISIÓN DE CUENTA Y PAGO */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-6 shadow-2xl sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Trophy className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-black text-white text-base">Ticket de Reserva</h4>
                    <span className="text-[11px] text-slate-400">Pase QR con encendido automático de luces</span>
                  </div>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {selectedDate}
                </span>
              </div>

              {selectedSlot ? (
                <div className="space-y-4 text-xs">
                  {/* Ficha Resumen */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Cancha:</span>
                      <strong className="text-white text-sm">Cancha de Babyfútbol</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Horario Seleccionado:</span>
                      <strong className="text-emerald-400 font-mono text-sm">{selectedSlot}</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Luminarias LED SEC:</span>
                      <span className="text-amber-400 font-medium">Encendido automático (T - 2 min)</span>
                    </div>
                    {includeBarbecue && (
                      <div className="flex justify-between items-center text-amber-300 pt-1 border-t border-slate-800">
                        <span>Quincho Tercer Tiempo:</span>
                        <span>Incluido (+$10.000)</span>
                      </div>
                    )}
                  </div>

                  {/* DIVISIÓN DEL COSTO ENTRE LOS 10 JUGADORES */}
                  <div className="bg-gradient-to-br from-emerald-950/60 to-slate-950 p-4 rounded-2xl border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-emerald-400" />
                        División entre 10 Jugadores (5 vs 5):
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">10 pers.</span>
                    </div>

                    <div className="flex items-baseline justify-between pt-1">
                      <div>
                        <span className="text-2xl font-black text-emerald-400 font-mono">
                          ${pricePerPlayer.toLocaleString('es-CL')}
                        </span>
                        <span className="text-[11px] text-slate-400 ml-1">por jugador</span>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs text-slate-400 block">Total Cancha:</span>
                        <span className="text-base font-bold text-white">${rawFinalPrice.toLocaleString('es-CL')}</span>
                      </div>
                    </div>
                  </div>

                  {/* FORMULARIO DEL CAPITÁN */}
                  <div className="space-y-3 pt-2">
                    <h5 className="font-bold text-slate-300 text-xs">Datos del Capitán (Titular de Reserva):</h5>
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Nombre completo del capitán"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="tel"
                        value={playerPhone}
                        onChange={(e) => setPlayerPhone(e.target.value)}
                        placeholder="Teléfono / WhatsApp (+56 9...)"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                      <input
                        type="email"
                        value={playerEmail}
                        onChange={(e) => setPlayerEmail(e.target.value)}
                        placeholder="Correo electrónico para enviar voucher"
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  {/* BOTÓN DE CHECKOUT WEBPAY */}
                  <button
                    onClick={handleConfirmBooking}
                    disabled={isCheckingOut}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-emerald-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isCheckingOut ? (
                      <>
                        <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando con Transbank Webpay Plus...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4 text-slate-950" />
                        <span>Pagar ${rawFinalPrice.toLocaleString('es-CL')} con Webpay Plus</span>
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Pago seguro Transbank • Generación inmediata de Pase QR</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500 text-xs">
                  Selecciona un horario para ver el desglose y confirmar tu reserva.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PESTAÑA 2: MIS PASES QR ACTIVOS */}
      {activeTab === 'my-passes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-xl text-white">Tus Pases QR de Acceso a la Cancha</h3>
            <span className="text-xs text-slate-400">Presenta el código en el torniquete al llegar</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {reservations.map((res) => (
              <div 
                key={res.id}
                className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 hover:border-emerald-500/40 transition-all relative overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">
                      CANCHA DE BABYFÚTBOL
                    </span>
                    <h4 className="font-bold text-white text-base">{res.playerName}</h4>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold">
                    PAGADO
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Fecha:</span>
                    <strong className="text-white font-mono">{res.date}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Horario:</span>
                    <strong className="text-emerald-400 font-mono">{res.timeSlot}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Monto:</span>
                    <strong className="text-white font-mono">${res.finalPrice.toLocaleString('es-CL')}</strong>
                  </div>
                </div>

                {/* Código QR Ilustrado */}
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
                  <div className="w-32 h-32 bg-white rounded-xl p-2 flex items-center justify-center shadow">
                    {/* QR Vectorial Simplificado */}
                    <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950 fill-current">
                      <rect x="10" y="10" width="25" height="25" />
                      <rect x="15" y="15" width="15" height="15" fill="white" />
                      <rect x="18" y="18" width="9" height="9" />
                      <rect x="65" y="10" width="25" height="25" />
                      <rect x="70" y="15" width="15" height="15" fill="white" />
                      <rect x="73" y="18" width="9" height="9" />
                      <rect x="10" y="65" width="25" height="25" />
                      <rect x="15" y="70" width="15" height="15" fill="white" />
                      <rect x="18" y="73" width="9" height="9" />
                      <rect x="42" y="15" width="16" height="8" />
                      <rect x="42" y="30" width="10" height="16" />
                      <rect x="42" y="55" width="16" height="10" />
                      <rect x="65" y="45" width="20" height="8" />
                      <rect x="65" y="65" width="12" height="15" />
                      <rect x="80" y="80" width="10" height="10" />
                    </svg>
                  </div>
                  <span className="font-mono text-xs font-black text-emerald-400 tracking-wider">
                    {res.qrAccessCode}
                  </span>
                  <span className="text-[10px] text-slate-500">Válido 15 min antes del partido</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => onSimulateQRScan(res.qrAccessCode)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Probar en Torniquete
                  </button>
                  <button
                    onClick={handleCopyWhatsapp}
                    className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
                    title="Compartir por WhatsApp con el equipo"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL DE ÉXITO DE RESERVA (COMPROBANTE WEBPAY) */}
      {bookingSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-2xl">
                ✓
              </div>
              <h3 className="text-xl font-black text-white">¡Reserva de Cancha Exitosa!</h3>
              <p className="text-xs text-slate-400">
                Pago procesado correctamente por Transbank Webpay Plus.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Capitán:</span>
                <strong className="text-white">{bookingSuccessModal.playerName}</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Fecha & Horario:</span>
                <strong className="text-emerald-400 font-mono">
                  {bookingSuccessModal.date} | {bookingSuccessModal.timeSlot}
                </strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Total Cancelado:</span>
                <strong className="text-white font-mono">
                  ${bookingSuccessModal.finalPrice.toLocaleString('es-CL')} CLP
                </strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Por Jugador (10 pers.):</span>
                <strong className="text-emerald-400 font-mono">
                  ${Math.round(bookingSuccessModal.finalPrice / 10).toLocaleString('es-CL')} c/u
                </strong>
              </div>
            </div>

            {/* Pase QR */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
              <span className="text-[11px] font-bold text-slate-400">Pase QR para el Torniquete:</span>
              <div className="w-28 h-28 bg-white rounded-xl p-2 flex items-center justify-center shadow">
                <QrCode className="w-full h-full text-slate-950" />
              </div>
              <span className="font-mono text-sm font-black text-emerald-400">
                {bookingSuccessModal.qrAccessCode}
              </span>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleCopyWhatsapp}
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copiedLink ? '¡Copiado para WhatsApp!' : 'Compartir con el Equipo por WhatsApp'}</span>
              </button>

              <button
                onClick={() => {
                  setBookingSuccessModal(null);
                  setActiveTab('my-passes');
                }}
                className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                Ver en Mis Pases
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
