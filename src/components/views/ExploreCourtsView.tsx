import React from 'react';
import { 
  ArrowRight, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Clock, 
  Users, 
  Trophy, 
  Phone, 
  Calendar,
  Flame,
  Award,
  CircleDollarSign,
  Mail,
  Bot,
  ExternalLink,
  Sliders,
  Check
} from 'lucide-react';
import { LocationMapSection } from '../common/LocationMapSection';

interface ExploreCourtsViewProps {
  onSelectCategory: () => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenAI?: () => void;
}

export const ExploreCourtsView: React.FC<ExploreCourtsViewProps> = ({
  onSelectCategory,
  onOpenAuth,
  onOpenAI
}) => {
  const highlights = [
    {
      title: 'Pasto Sintético FIFA Quality 50mm',
      description: 'Césped monofilamento de última generación con relleno de caucho criogénico. Amortiguación superior para cuidar rodillas y tobillos.',
      icon: '🌿'
    },
    {
      title: 'Iluminación LED Industrial (SEC)',
      description: '4 torres esquineras con 8 proyectores LED de 200W. Visibilidad diurna perfecta en partidos nocturnos sin deslumbramiento ni sombras.',
      icon: '💡'
    },
    {
      title: 'Balón & Petos Incluidos',
      description: 'Te facilitamos sin costo adicional balón oficial de babyfútbol N°4 (medio pique) y 10 petos limpios bicolores para distinguir los equipos.',
      icon: '⚽'
    },
    {
      title: 'Quincho & Tercer Tiempo',
      description: 'Zona techada exclusiva con parrilla para asados, mesas rústicas y refrigerador para disfrutar el post partido con tus amigos.',
      icon: '🥩'
    },
    {
      title: 'Camarines con Agua Caliente',
      description: 'Vestidores amplios con duchas de agua caliente continua, casilleros seguros y enchufes para la comodidad de ambos planteles.',
      icon: '🚿'
    },
    {
      title: 'Acceso Automatizado con Pase QR',
      description: 'Reserva online y recibe tu código QR encriptado para ingresar por el torniquete inteligente. Las luces se encienden solas a la hora de tu partido.',
      icon: '📱'
    }
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      {/* HERO PRINCIPAL: Cancha de Babyfútbol */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900/90 to-[#020617] p-8 sm:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            Cancha Exclusiva de Babyfútbol en Chillán • Reserva Directa con su Dueño
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            El Mejor Partido de <span className="text-emerald-400 underline decoration-emerald-500/50">Babyfútbol 5 vs 5</span> se Juega Aquí
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Bienvenido a nuestra cancha oficial de babyfútbol en Chillán. Pasto sintético de alto impacto, 
            iluminación LED nocturna de estándar SEC, camarines con agua caliente y quincho de tercer tiempo. 
            ¡Arrienda tu hora online en 1 minuto!
          </p>

          {/* Tarjeta de Especificaciones Rápidas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block">Medidas</span>
              <span className="text-lg font-black text-white">30 × 18 m</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block">Modalidad</span>
              <span className="text-lg font-black text-emerald-400">5 vs 5 (10 pers.)</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block">Iluminación</span>
              <span className="text-lg font-black text-amber-400">4 Torres LED</span>
            </div>
            <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-center">
              <span className="text-xs text-slate-400 block">Por Jugador</span>
              <span className="text-lg font-black text-emerald-400">Desde $2.800</span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button
              onClick={onSelectCategory}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-3 cursor-pointer"
            >
              <Calendar className="w-5 h-5 text-slate-950" />
              <span>Ver Horarios Disponibles y Reservar</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {onOpenAI && (
              <button
                onClick={onOpenAI}
                className="px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 border border-emerald-500/40 text-emerald-300 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Bot className="w-4 h-4 text-emerald-400" />
                <span>Preguntar al Asistente IA</span>
              </button>
            )}

            <a
              href="https://wa.me/56984512230?text=Hola,%20quisiera%20consultar%20por%20arriendo%20de%20la%20cancha%20de%20babyfútbol"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp Directo Dueño</span>
            </a>
          </div>
        </div>
      </section>

      {/* SECCIÓN: ESPECIFICACIONES TÉCNICAS OFICIALES DE LA CANCHA */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-1">
              <Sliders className="w-4 h-4" />
              Ficha Técnica de Infraestructura
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Especificaciones Oficiales de la Cancha de Babyfútbol
            </h3>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
            Reglamento Babyfútbol Chile
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block">Superficie de Juego</span>
            <div className="text-lg font-black text-white">Pasto Sintético 50mm</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monofilamento de polietileno de alta densidad con 6 kg/m² de caucho criogénico. Amortigua caídas y evita abrasiones.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider block">Dimensiones de Pista</span>
            <div className="text-lg font-black text-white">30 × 18 Metros</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Medida reglamentaria para partidos de 5 contra 5 (10 jugadores). Área penal con radio de 6 metros y punto penal a 6m.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">Iluminación Nocturna</span>
            <div className="text-lg font-black text-white">4 Torres LED (8x200W)</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Potencia lumínica de 500 Lux uniforme sobre el campo. Cumple norma eléctrica chilena SEC NCh Elec. 4/2003 con relé industrial.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-blue-400 font-bold text-xs uppercase tracking-wider block">Arcos & Seguridad</span>
            <div className="text-lg font-black text-white">Arcos 3 × 2 Metros</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Estructura de acero reforzado con mallas de polietileno trenzado de 4mm. Red perimetral de 6 metros de altura en contracanchas.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-wider block">Equipamiento Incluido</span>
            <div className="text-lg font-black text-white">Balón N°4 + 10 Petos</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Balón oficial de babyfútbol de medio pique para juego rasante y juego de 10 petos numerados bicolores recién lavados.
            </p>
          </div>

          <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
            <span className="text-purple-400 font-bold text-xs uppercase tracking-wider block">Comodidades Anexas</span>
            <div className="text-lg font-black text-white">Camarines & Quincho</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vestuarios con duchas individuales y agua caliente continua. Quincho techado para asados con parrilla y refrigerador.
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN: CONTACTO DIRECTO DEL DUEÑO DON MARCELO */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950/60 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-3xl sm:text-4xl text-slate-950 shadow-xl flex-shrink-0">
              👨‍💼
            </div>
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                Dueño & Administrador Directo
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Don Marcelo Gutiérrez
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Atención personalizada para reservas, arriendos mensuales de empresas, torneos y campeonatos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <a
              href="https://wa.me/56984512230?text=Hola%20Don%20Marcelo,%20le%20escribo%20desde%20la%20página%20web%20para%20consultar%20por%20la%20cancha%20de%20babyfútbol"
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer"
            >
              <Phone className="w-4 h-4 text-slate-950" />
              <span>Chatear por WhatsApp (+56 9 8451 2230)</span>
            </a>

            <button
              onClick={() => onOpenAuth('login')}
              className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Acceso Propietario
            </button>
          </div>
        </div>
      </section>

      {/* DETALLES DE LA CANCHA Y SERVICIOS INCLUIDOS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            Todo Equipado para tu Pichanga
          </h2>
          <p className="text-sm text-slate-400">
            Cada reserva en nuestra cancha de babyfútbol incluye infraestructura deportiva y comodidades de primer nivel.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {highlights.map((item, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 hover:border-emerald-500/40 hover:bg-slate-900 transition-all space-y-3 group"
            >
              <div className="text-3xl p-3 bg-slate-950 rounded-2xl w-fit border border-slate-800 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="font-bold text-lg text-white group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* COMPARATIVA DE TARIFAS Y HORARIOS */}
      <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Tarifas Transparentes de Arriendo
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Sin cobros sorpresas. El precio se divide entre 10 jugadores (5 por equipo).
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
            <CircleDollarSign className="w-4 h-4" />
            Transbank Webpay Plus integrado
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Horario Valle */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Horario Valle Diurno
            </div>
            <div>
              <span className="text-3xl font-black text-white">$21.000</span>
              <span className="text-xs text-slate-400"> / hora cancha</span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              Solo $2.100 por jugador
            </div>
            <p className="text-xs text-slate-400">
              Lunes a Viernes de 09:00 a 18:00 hrs. Ideal para estudiantes, entrenamientos y partidos diurnos.
            </p>
            <button 
              onClick={onSelectCategory}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Ver Bloques Diurnos
            </button>
          </div>

          {/* Horario Nocturno Prime */}
          <div className="bg-gradient-to-b from-emerald-950/40 to-slate-950 border border-emerald-500/40 rounded-2xl p-6 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 uppercase">
              Más Popular
            </div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Horario Nocturno Prime
            </div>
            <div>
              <span className="text-3xl font-black text-white">$28.000 - $33.600</span>
              <span className="text-xs text-slate-400"> / hora cancha</span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              Aprox. $2.800 a $3.360 por jugador
            </div>
            <p className="text-xs text-slate-300">
              19:00 a 23:00 hrs. Incluye las 4 torres LED de reflectores de alta potencia activadas automáticamente.
            </p>
            <button 
              onClick={onSelectCategory}
              className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
            >
              Reservar Horario Nocturno
            </button>
          </div>

          {/* Fines de Semana */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-4 hover:border-slate-700 transition-all">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Viernes & Fines de Semana
            </div>
            <div>
              <span className="text-3xl font-black text-white">$32.000 - $35.000</span>
              <span className="text-xs text-slate-400"> / hora cancha</span>
            </div>
            <div className="text-xs text-emerald-400 font-semibold">
              Aprox. $3.200 a $3.500 por jugador
            </div>
            <p className="text-xs text-slate-400">
              Viernes tarde, sábados y domingos. Puedes añadir el quincho para tu asado de tercer tiempo.
            </p>
            <button 
              onClick={onSelectCategory}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer"
            >
              Ver Bloques Fin de Semana
            </button>
          </div>
        </div>
      </section>

      {/* SECCIÓN COMPLETA DE MAPA DE GEOLOCALIZACIÓN Y CÓMO LLEGAR */}
      <LocationMapSection onSelectBooking={onSelectCategory} />
    </div>
  );
};
