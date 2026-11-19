import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  MessageSquare, 
  Clock, 
  DollarSign, 
  Calendar, 
  Phone, 
  MapPin, 
  ShieldAlert, 
  ChevronRight,
  Flame,
  CheckCircle2,
  HelpCircle,
  Minimize2,
  Maximize2
} from 'lucide-react';
import { Reservation, Court, WeatherCondition } from '../../types';

interface AIAssistantWidgetProps {
  court: Court;
  reservations: Reservation[];
  weather: WeatherCondition;
  onNavigateToBooking: () => void;
  onOpenMap: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const AIAssistantWidget: React.FC<AIAssistantWidgetProps> = ({
  court,
  reservations,
  weather,
  onNavigateToBooking,
  onOpenMap
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const initialMessages: ChatMessage[] = [
    {
      id: 'm-1',
      sender: 'ai',
      text: '¡Hola! ⚽ Soy **CanchaBot IA**, el asistente virtual de la Cancha de Babyfútbol en Chillán. ¿En qué te puedo ayudar hoy? Pregúntame por horarios disponibles, tarifas, el quincho de tercer tiempo, ubicación o normativas.',
      timestamp: 'Ahora'
    }
  ];

  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Preguntas sugeridas rápidas
  const suggestedQuestions = [
    { label: '⚽ Horarios disponibles hoy', query: '¿Qué horarios están disponibles para jugar hoy?' },
    { label: '💰 Precios y división', query: '¿Cuánto cuesta la cancha y cuánto paga cada jugador?' },
    { label: '🥩 ¿Cómo funciona el quincho?', query: '¿Cómo funciona el quincho para el asado de tercer tiempo?' },
    { label: '👟 Zapatillas permitidas', query: '¿Qué tipo de zapatillas se pueden usar en el pasto sintético?' },
    { label: '📍 ¿Dónde queda la cancha?', query: '¿Cuál es la dirección exacta y cómo llegar?' },
    { label: '📞 Contactar a Don Marcelo', query: '¿Cuál es el contacto del dueño de la cancha?' }
  ];

  // Motor de respuestas inteligentes locales para la cancha de babyfútbol
  const generateAIResponse = (userQuery: string): { text: string; actionButton?: { label: string; onClick: () => void } } => {
    const q = userQuery.toLowerCase();

    // 1. Disponibilidad de horarios
    if (q.includes('disponib') || q.includes('horario') || q.includes('hora') || q.includes('turno') || q.includes('cuándo')) {
      const takenSlots = reservations.map(r => r.timeSlot);
      const allSlots = ['10:00 - 11:00', '12:00 - 13:00', '15:00 - 16:00', '17:00 - 18:00', '18:00 - 19:00', '19:00 - 20:00', '20:00 - 21:00', '21:00 - 22:00', '22:00 - 23:00'];
      const freeSlots = allSlots.filter(s => !takenSlots.includes(s));

      return {
        text: `📅 **Estado de Cancha para Hoy:**\n\n- Horarios ocupados: **${takenSlots.join(', ')}**\n- 🟢 **Horarios libres disponibles:** **${freeSlots.slice(0, 5).join(', ')}**\n\n*Recuerda que los turnos nocturnos (19:00 a 23:00) incluyen las 4 torres de focos LED activadas automáticamente.*`,
        actionButton: {
          label: '📅 Ver Horarios y Reservar Ahora',
          onClick: () => {
            setIsOpen(false);
            onNavigateToBooking();
          }
        }
      };
    }

    // 2. Precios, tarifas y cuánto paga cada jugador
    if (q.includes('precio') || q.includes('cuanto') || q.includes('cuánto') || q.includes('valor') || q.includes('costo') || q.includes('tarifa') || q.includes('pagar') || q.includes('persona') || q.includes('jugador')) {
      return {
        text: `💰 **Tarifas de Arriendo (5 vs 5 / 10 Jugadores):**\n\n- **Horario Valle Diurno (09:00 a 18:00):** Desde **$21.000 / hora** (Solo **$2.100 por jugador**).\n- **Horario Nocturno Prime (19:00 a 23:00):** Entre **$28.000 y $33.600 / hora** (Aprox. **$2.800 a $3.360 por jugador**), incluye las 4 torres LED industriales.\n\n*Incluye balón oficial N°4 medio pique y 10 petos limpios.* Se cancela directo con Webpay Plus o transferencia.`,
        actionButton: {
          label: '⚡ Cotizar Horario en Vivo',
          onClick: () => {
            setIsOpen(false);
            onNavigateToBooking();
          }
        }
      };
    }

    // 3. Quincho y Tercer Tiempo
    if (q.includes('quincho') || q.includes('asado') || q.includes('tercer tiempo') || q.includes('parrilla') || q.includes('comer') || q.includes('cerveza')) {
      return {
        text: `🥩 **Quincho & Tercer Tiempo Don Marcelo:**\n\nContamos con un sector techado rústico equipado con **parrilla para asados, mesas grandes y refrigerador industrial** para tus bebidas y carnes.\n\n- **Costo adicional:** Solo **+$10.000** al reservar tu cancha.\n- **Capacidad:** Hasta 20 personas (para compartir ambos planteles post partido).\n\n*Normativa:* El consumo de alimentos y bebidas se realiza exclusivamente en el quincho, nunca dentro del césped sintético.`,
        actionButton: {
          label: '⚽ Reservar Cancha con Quincho',
          onClick: () => {
            setIsOpen(false);
            onNavigateToBooking();
          }
        }
      };
    }

    // 4. Zapatillas, indumentaria y calzado
    if (q.includes('zapatilla') || q.includes('calzado') || q.includes('estoperol') || q.includes('zapato') || q.includes('pasto') || q.includes('suela') || q.includes('puedo usar')) {
      return {
        text: `👟 **Normativa de Calzado para la Cancha:**\n\n- 🟢 **PERMITIDO:** Zapatillas de suela lisa (fútbol sala/indoor) o zapatillas multitaco de goma (turf/babyfútbol).\n- 🔴 **ESTRICTAMENTE PROHIBIDO:** Zapatos con estoperoles de aluminio, fierro o tapones altos de fútbol 11 campo natural, ya que desgarran la base del césped sintético y dañan las articulaciones de los jugadores.\n\n¡Cuidemos la cancha entre todos para tener siempre el pasto impecable!`
      };
    }

    // 5. Ubicación, mapa y cómo llegar
    if (q.includes('donde') || q.includes('dónde') || q.includes('ubicac') || q.includes('llegar') || q.includes('direccion') || q.includes('dirección') || q.includes('queda') || q.includes('mapa')) {
      return {
        text: `📍 **Ubicación en Chillán:**\n\n- **Dirección:** Av. Vicente Méndez 1420, Chillán (Sector Los Volcanes, a 2 cuadras del Campus INACAP Chillán).\n- **En auto:** A 7 minutos de la Plaza de Armas por Av. Vicente Méndez. Estacionamiento privado cerrado y vigilado gratuito.\n- **En micro:** Línea 7 y Línea 2 tienen paradero a 50 metros del portón.\n- **Waze / Maps:** Busca "BabyFútbol Chillán Don Marcelo".`,
        actionButton: {
          label: '🗺️ Ver Mapa y Cómo Llegar',
          onClick: () => {
            setIsOpen(false);
            onOpenMap();
          }
        }
      };
    }

    // 6. Contacto del dueño Don Marcelo
    if (q.includes('contacto') || q.includes('dueño') || q.includes('marcelo') || q.includes('telefono') || q.includes('teléfono') || q.includes('whatsapp') || q.includes('llamar') || q.includes('hablar')) {
      return {
        text: `📞 **Contacto Directo con el Dueño:**\n\n- **Administrador:** Marcelo Gutiérrez\n- **WhatsApp / Celular:** +56 9 8451 2230\n- **Correo:** contacto@babyfutbolchillan.cl\n- **Horario de Atención:** Lunes a Domingo de 09:00 a 23:30 hrs.\n\n¿Quieres consultar por torneos de empresas, arriendos mensuales fijos o campeonatos? Escríbele directo a Don Marcelo por WhatsApp:`,
        actionButton: {
          label: '📲 Abrir WhatsApp de Don Marcelo',
          onClick: () => {
            window.open('https://wa.me/56984512230?text=Hola%20Don%20Marcelo,%20le%20escribo%20desde%20la%20página%20web%20para%20consultar%20por%20la%20cancha%20de%20babyfútbol', '_blank');
          }
        }
      };
    }

    // 7. Clima y lluvia
    if (q.includes('lluvia') || q.includes('clima') || q.includes('frio') || q.includes('frío') || q.includes('moja') || q.includes('temperatura')) {
      return {
        text: `🌧️ **Condiciones Climáticas y Lluvia en Chillán:**\n\nActualmente en Chillán hay **${weather.temperatureC}°C** (${weather.condition.replace('_', ' ')}).\n\n- Si hay pronóstico de lluvia, nuestro algoritmo de **Tarificación Dinámica aplica descuentos automáticos** de hasta -20% en horarios diurnos.\n- El drenaje de la cancha cuenta con base de grava y arena sílice de absorción rápida para evitar charcos.\n- **Garantía:** Si hay temporal severo, puedes reprogramar tu partido sin costo avisando con 2 horas de anticipación.`
      };
    }

    // 8. Especificaciones de la cancha
    if (q.includes('medida') || q.includes('dimension') || q.includes('especifica') || q.includes('cancha') || q.includes('foco') || q.includes('luz') || q.includes('balon') || q.includes('balón') || q.includes('peto')) {
      return {
        text: `🏟️ **Ficha Técnica de la Cancha:**\n\n- **Dimensiones:** 30 × 18 metros oficiales de babyfútbol (5 vs 5).\n- **Césped:** Pasto sintético monofilamento FIFA Quality 50mm con caucho criogénico amortiguador.\n- **Iluminación:** 4 torres esquineras con 8 proyectores LED industriales de 200W (Norma SEC).\n- **Equipamiento:** Balón oficial N°4 medio pique incluido + 10 petos bicolores lavados.\n- **Servicios:** Camarines con duchas y agua caliente continua + estacionamiento vigilado.`
      };
    }

    // Respuesta por defecto orientadora
    return {
      text: `⚽ Comprendo tu consulta sobre "${userQuery}".\n\nPuedo ayudarte con:\n1. **Ver horarios libres** para hoy y reservar tu partido.\n2. **Tarifas y precios por persona** (desde $2.100 a $3.360 c/u).\n3. **Uso del quincho** para el asado de tercer tiempo.\n4. **Normativas de calzado** (zapatillas permitidas).\n5. **Contacto de Don Marcelo** (WhatsApp +56 9 8451 2230).\n\n¿Qué te gustaría revisar?`,
      actionButton: {
        label: '📅 Ir al Calendario de Reservas',
        onClick: () => {
          setIsOpen(false);
          onNavigateToBooking();
        }
      }
    };
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(query);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.text,
        timestamp: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
        actionButton: response.actionButton
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 600);
  };

  return (
    <>
      {/* BOTÓN FLOTANTE PERMANENTE EN LA ESQUINA INFERIOR DERECHA */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-slate-950 font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white/20 group cursor-pointer animate-in slide-in-from-bottom-5"
          title="Abrir Asistente Virtual IA"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center text-emerald-400">
              <Bot className="w-5 h-5" />
            </div>
            <span className="w-3 h-3 rounded-full bg-amber-400 border-2 border-slate-900 absolute -top-0.5 -right-0.5 animate-pulse"></span>
          </div>

          <div className="text-left hidden sm:block">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-950/80 leading-none">
              Asistente IA Chillán
            </div>
            <div className="text-xs font-black text-slate-950 leading-tight">
              ¿Canchas disponibles?
            </div>
          </div>
        </button>
      )}

      {/* VENTANA DEL CHATBOT IA */}
      {isOpen && (
        <div 
          className={`fixed bottom-6 right-4 sm:right-6 z-50 w-[94vw] sm:w-[420px] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 animate-in zoom-in-95 ${
            isMinimized ? 'h-16' : 'h-[600px] max-h-[85vh]'
          }`}
        >
          {/* Header del Chat */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
                  <Bot className="w-6 h-6" />
                </div>
                <span className="w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 absolute -bottom-0.5 -right-0.5"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-white">CanchaBot IA</h4>
                  <span className="text-[9px] font-black px-1.5 py-0.2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full font-mono uppercase">
                    En Vivo
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Asistente Virtual • Cancha de Babyfútbol Chillán
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setIsMinimized(prev => !prev)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title={isMinimized ? 'Maximizar' : 'Minimizar'}
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Cerrar Asistente"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Área de Mensajes */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-950/70 text-xs">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-3.5 space-y-2 leading-relaxed shadow-md ${
                        m.sender === 'user'
                          ? 'bg-emerald-600 text-white rounded-br-none'
                          : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">
                        {m.text.split('**').map((part, i) => (
                          i % 2 === 1 ? <strong key={i} className="text-emerald-300 font-bold">{part}</strong> : part
                        ))}
                      </div>

                      {m.actionButton && (
                        <button
                          onClick={m.actionButton.onClick}
                          className="w-full mt-2 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-[11px] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                        >
                          <span>{m.actionButton.label}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{m.timestamp}</span>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-3 bg-slate-900 border border-slate-800 rounded-2xl rounded-bl-none w-fit text-slate-400 text-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[11px] ml-1 text-slate-400">Consultando estado de cancha...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Sugerencias Rápidas */}
              <div className="p-2.5 bg-slate-900/90 border-t border-slate-800 overflow-x-auto flex gap-1.5 no-scrollbar">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(q.query)}
                    className="whitespace-nowrap px-3 py-1.5 rounded-full bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors cursor-pointer flex-shrink-0"
                  >
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Formulario de Envío */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Pregúntale a CanchaBot IA (ej: ¿Hay hora hoy a las 20:00?)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 transition-colors cursor-pointer"
                  title="Enviar mensaje"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
