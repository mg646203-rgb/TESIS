import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  MessageSquare, 
  FileText, 
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';

interface FooterProps {
  onOpenNormativas: () => void;
  onOpenMap: () => void;
  onOpenAI: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenNormativas,
  onOpenMap,
  onOpenAI
}) => {
  return (
    <footer className="bg-[#020617] border-t border-slate-900 text-slate-400 text-xs">
      {/* SECCIÓN PRINCIPAL DEL FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* COLUMNA 1: MARCA Y REDES SOCIALES */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-lg shadow-lg">
                ⚽
              </div>
              <span className="font-black text-xl text-white tracking-tight">
                BabyFútbol<span className="text-emerald-400">Chillán</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              La cancha oficial de babyfútbol 5 vs 5 en Chillán. Pasto sintético FIFA Quality, 
              4 torres de focos LED industriales, camarines con agua caliente y quincho de tercer tiempo.
            </p>

            {/* REDES SOCIALES OFICIALES */}
            <div className="space-y-2 pt-1">
              <span className="text-[11px] font-bold text-white uppercase tracking-wider block">
                Síguenos en Redes Sociales:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-600 to-amber-500 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="Instagram @babyfutbolchillan"
                >
                  <span className="text-xs font-bold">📸</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="TikTok @canchachillan5vs5"
                >
                  <span className="text-xs font-bold">🎵</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="Facebook /BabyFutbolChillanOficial"
                >
                  <span className="text-xs font-bold">📘</span>
                </a>

                {/* WhatsApp */}
                <a
                  href="https://wa.me/56984512230?text=Hola%20Don%20Marcelo,%20le%20escribo%20desde%20la%20página%20web%20para%20consultar%20por%20la%20cancha"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="WhatsApp Directo +56 9 8451 2230"
                >
                  <span className="text-xs font-bold">💬</span>
                </a>

                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center hover:scale-110 transition-transform shadow"
                  title="YouTube BabyFútbol Chillán TV"
                >
                  <span className="text-xs font-bold">▶️</span>
                </a>
              </div>
            </div>
          </div>

          {/* COLUMNA 2: CONTACTO DIRECTO DEL DUEÑO */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>👤</span> Contacto del Dueño
            </h4>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-2.5">
              <div className="font-bold text-white text-sm">
                Don Marcelo Gutiérrez
              </div>
              <p className="text-[11px] text-slate-400">
                Propietario & Administrador del Recinto Deportivo
              </p>

              <div className="space-y-1.5 pt-1 text-xs">
                <a 
                  href="https://wa.me/56984512230" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 text-emerald-400 hover:underline"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+56 9 8451 2230 (WhatsApp)</span>
                </a>

                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>contacto@babyfutbolchillan.cl</span>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Lunes a Domingo: 09:00 - 23:30</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMNA 3: ESPECIFICACIONES TÉCNICAS DE LA CANCHA */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>🏟️</span> Ficha de la Cancha
            </h4>

            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Dimensiones:</strong> 30 × 18 m (5 vs 5)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Césped:</strong> Sintético FIFA Quality 50mm</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Luces:</strong> 4 Torres LED industriales (SEC)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Incluye:</strong> Balón N°4 + 10 Petos</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span><strong>Camarines:</strong> Duchas con agua caliente</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span><strong>Quincho:</strong> Asados post-partido (+$10.000)</span>
              </li>
            </ul>
          </div>

          {/* COLUMNA 4: ACCESOS DIRECTOS Y NORMATIVAS */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-1.5">
              <span>📋</span> Enlaces y Normativas
            </h4>

            <div className="space-y-2">
              <button
                onClick={onOpenNormativas}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>📜 Normativas del Recinto</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenMap}
                className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>📍 Ver Mapa y Ubicación</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenAI}
                className="w-full text-left p-2.5 rounded-xl bg-gradient-to-r from-emerald-950 to-slate-950 hover:from-emerald-900 border border-emerald-500/30 text-xs font-bold text-emerald-400 transition-colors flex items-center justify-between cursor-pointer"
              >
                <span>🤖 Preguntar al Asistente IA</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* BARRA INFERIOR DE DERECHOS Y CRÉDITOS ACADÉMICOS */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 <strong>BabyFútbol Chillán</strong> • Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-2">
            <span>Desarrollado para</span>
            <span className="font-bold text-emerald-400">INACAP Sede Chillán</span>
            <span>• Ingeniería en Informática 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
