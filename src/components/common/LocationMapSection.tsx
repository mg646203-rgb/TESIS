import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Navigation, 
  ExternalLink, 
  Car, 
  Bus, 
  Clock, 
  Copy, 
  Check, 
  ShieldCheck, 
  Compass,
  Layers,
  Phone,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Star,
  Info,
  ChevronRight,
  Filter,
  Flame,
  CheckCircle2,
  Calendar
} from 'lucide-react';

interface ChillanCourt {
  id: string;
  name: string;
  category: 'oficial' | 'municipal' | 'privada' | 'universitaria';
  sector: 'oriente' | 'norte' | 'sur' | 'poniente';
  sectorLabel: string;
  address: string;
  surface: string;
  lighting: string;
  distanceFromCenter: string;
  coordinates: { lat: number; lng: number };
  svgPos: { x: number; y: number }; // Posición en plano SVG
  isOfficialSystem: boolean; // Nuestra cancha con reserva online
  rating: number;
  phone?: string;
  description: string;
}

const CHILLAN_COURTS: ChillanCourt[] = [
  {
    id: 'court-baby-oficial',
    name: 'Cancha BabyFútbol Chillán (Don Marcelo)',
    category: 'oficial',
    sector: 'oriente',
    sectorLabel: 'Sector Los Volcanes / Oriente',
    address: 'Av. Vicente Méndez 1420, Chillán',
    surface: 'Pasto Sintético FIFA Quality 50mm con caucho criogénico',
    lighting: '4 Torres LED 8x200W estándar industrial SEC (500 Lux)',
    distanceFromCenter: '7 min de Plaza de Armas (a 2 cuadras de INACAP)',
    coordinates: { lat: -36.6025, lng: -72.0850 },
    svgPos: { x: 530, y: 240 },
    isOfficialSystem: true,
    rating: 4.9,
    phone: '+56 9 8451 2230',
    description: 'Nuestra cancha oficial. Reserva online en vivo, torniquete con Pase QR, luces automáticas, camarines con agua caliente y quincho para asados.'
  },
  {
    id: 'court-quilamapu',
    name: 'Complejo Deportivo Quilamapu',
    category: 'municipal',
    sector: 'norte',
    sectorLabel: 'Sector Norte / Quilamapu',
    address: 'Av. Paul Harris s/n (Cruce Flores Millán), Chillán',
    surface: 'Canchas sintéticas y pista atlética municipal',
    lighting: 'Iluminación halógena municipal',
    distanceFromCenter: '12 min del centro',
    coordinates: { lat: -36.5920, lng: -72.0910 },
    svgPos: { x: 440, y: 120 },
    isOfficialSystem: false,
    rating: 4.6,
    phone: '+56 42 243 3700',
    description: 'Polideportivo municipal de Chillán con múltiples canchas de fútbol, babyfútbol y atletismo.'
  },
  {
    id: 'court-rio-viejo',
    name: 'Complejo Deportivo Río Viejo',
    category: 'privada',
    sector: 'sur',
    sectorLabel: 'Sector Sur / Río Viejo',
    address: 'Av. Bernardo O\'Higgins 2150 Sur, Chillán',
    surface: 'Pasto sintético 45mm para fútbol 7 y babyfútbol',
    lighting: 'Torres LED perimetrales',
    distanceFromCenter: '10 min del centro',
    coordinates: { lat: -36.6210, lng: -72.1150 },
    svgPos: { x: 260, y: 410 },
    isOfficialSystem: false,
    rating: 4.4,
    description: 'Canchas tradicionales del sector sur de Chillán concurrida por ligas de fines de semana.'
  },
  {
    id: 'court-mariposas',
    name: 'Canchas Sintéticas Las Mariposas',
    category: 'privada',
    sector: 'oriente',
    sectorLabel: 'Sector Mariposas / Cordillera',
    address: 'Camino a Las Mariposas Km 2.1, Chillán',
    surface: 'Césped sintético monofilamento',
    lighting: 'Reflectores LED 400W',
    distanceFromCenter: '14 min del centro',
    coordinates: { lat: -36.6110, lng: -72.0680 },
    svgPos: { x: 670, y: 300 },
    isOfficialSystem: false,
    rating: 4.3,
    description: 'Recinto campestre en el acceso oriente a Chillán con canchas para arriendo nocturno.'
  },
  {
    id: 'court-anfa',
    name: 'Canchas ANFA Chillán (Sepúlveda Bustos)',
    category: 'municipal',
    sector: 'poniente',
    sectorLabel: 'Sector Poniente / Ultraestación',
    address: 'Sepúlveda Bustos con Av. Brasil, Chillán',
    surface: 'Canchas de tierra compactada y pasto sintético ANFA',
    lighting: 'Luminarias tradicionales',
    distanceFromCenter: '6 min de Plaza de Armas',
    coordinates: { lat: -36.6080, lng: -72.1220 },
    svgPos: { x: 180, y: 260 },
    isOfficialSystem: false,
    rating: 4.2,
    description: 'Sede de torneos federados ANFA de la Región de Ñuble y campeonatos barriales.'
  },
  {
    id: 'court-ubb',
    name: 'Cancha Sintética Universidad del Bío-Bío',
    category: 'universitaria',
    sector: 'oriente',
    sectorLabel: 'Sector Campus Fernando May',
    address: 'Av. Andrés Bello 720, Chillán',
    surface: 'Cancha sintética polideportiva UBB',
    lighting: 'Focos LED universitarios',
    distanceFromCenter: '8 min del centro',
    coordinates: { lat: -36.6005, lng: -72.0780 },
    svgPos: { x: 600, y: 190 },
    isOfficialSystem: false,
    rating: 4.5,
    description: 'Complejo universitario para estudiantes, selección UBB y eventos deportivos autorizados.'
  },
  {
    id: 'court-volcanes-sur',
    name: 'Canchas Los Volcanes Sur (Alonso de Ercilla)',
    category: 'privada',
    sector: 'oriente',
    sectorLabel: 'Sector Los Volcanes Sur',
    address: 'Av. Alonso de Ercilla con Las Rosas, Chillán',
    surface: 'Pasto sintético 40mm',
    lighting: 'Iluminación nocturna',
    distanceFromCenter: '9 min del centro',
    coordinates: { lat: -36.6180, lng: -72.0890 },
    svgPos: { x: 480, y: 380 },
    isOfficialSystem: false,
    rating: 4.1,
    description: 'Canchas comunitarias para pichangas de babyfútbol en el sector oriente de la ciudad.'
  }
];

interface LocationMapSectionProps {
  onSelectBooking?: () => void;
}

export const LocationMapSection: React.FC<LocationMapSectionProps> = ({ onSelectBooking }) => {
  const [selectedCourtId, setSelectedCourtId] = useState<string>('court-baby-oficial');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sectorFilter, setSectorFilter] = useState<'todos' | 'oriente' | 'norte' | 'sur' | 'poniente'>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estados de Paneo y Zoom Interactivos
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Modo de Mapa: "Deportivo Interactivo" vs "Google Maps Real en Vivo"
  const [mapMode, setMapMode] = useState<'interactive' | 'google_live'>('interactive');

  const selectedCourt = CHILLAN_COURTS.find(c => c.id === selectedCourtId) || CHILLAN_COURTS[0];

  // Filtrado de Canchas
  const filteredCourts = CHILLAN_COURTS.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.sectorLabel.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === 'todos' || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const handleCopyAddress = (court: ChillanCourt) => {
    navigator.clipboard.writeText(court.address);
    setCopiedId(court.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Controles de Paneo (Arrastrar el mapa)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetMap = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Centrar mapa en una cancha al seleccionarla
  const handleSelectCourt = (court: ChillanCourt) => {
    setSelectedCourtId(court.id);
    // Calcular pan para centrar
    const targetX = (400 - court.svgPos.x) * (zoom - 1) * 0.4;
    const targetY = (250 - court.svgPos.y) * (zoom - 1) * 0.4;
    setPan({ x: targetX, y: targetY });
  };

  const getGoogleMapsDirUrl = (court: ChillanCourt) => 
    `https://www.google.com/maps/dir/?api=1&destination=${court.coordinates.lat},${court.coordinates.lng}`;

  const getWazeUrl = (court: ChillanCourt) => 
    `https://www.waze.com/ul?ll=${court.coordinates.lat},${court.coordinates.lng}&navigate=yes`;

  const getAppleMapsUrl = (court: ChillanCourt) => 
    `https://maps.apple.com/?daddr=${court.coordinates.lat},${court.coordinates.lng}`;

  return (
    <section id="mapa-ubicacion" className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8 animate-in fade-in duration-300">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold mb-2">
            <Compass className="w-3.5 h-3.5 animate-spin [animation-duration:8s]" />
            MAPA GEOGRÁFICO DEPORTIVO • TODAS LAS CANCHAS DE CHILLÁN
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Encuentra y Compara las Canchas en Chillán
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            Explora las canchas de babyfútbol y fútbol de la ciudad. Arrastra el mapa, haz zoom, presiona en cualquier marcador o abre la ruta GPS directa en Google Maps y Waze.
          </p>
        </div>

        {/* SELECTOR DE VISTA: MAPA INTERACTIVO VS GOOGLE MAPS EMBED */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800 self-start lg:self-auto text-xs font-bold">
          <button
            onClick={() => setMapMode('interactive')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              mapMode === 'interactive'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🏟️</span>
            <span>Mapa Deportivo Interactivo</span>
          </button>

          <button
            onClick={() => setMapMode('google_live')}
            className={`px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              mapMode === 'google_live'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>🛰️</span>
            <span>Google Maps Satélite Live</span>
          </button>
        </div>
      </div>

      {/* BARRA DE BÚSQUEDA Y FILTROS POR SECTOR */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        {/* Buscador de canchas */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, sector o calle (ej: Los Volcanes, Vicente Méndez, Quilamapu, Río Viejo)..."
            className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs font-bold"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Filtros rápidos por sector */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold no-scrollbar">
          {[
            { id: 'todos', label: 'Todas (7)' },
            { id: 'oriente', label: 'Los Volcanes / Oriente' },
            { id: 'norte', label: 'Quilamapu / Norte' },
            { id: 'sur', label: 'Río Viejo / Sur' },
            { id: 'poniente', label: 'Ultraestación / Poniente' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setSectorFilter(f.id as any)}
              className={`whitespace-nowrap px-3 py-2 rounded-xl transition-all cursor-pointer ${
                sectorFilter === f.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 border border-slate-800 text-slate-300 hover:text-white'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ÁREA PRINCIPAL: MAPA + FICHA TÉCNICA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* COLUMNA IZQUIERDA: EL MAPA INTERACTIVO */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-slate-950 rounded-3xl border border-slate-800 overflow-hidden relative shadow-2xl">
            
            {/* Controles Flotantes de Zoom y Paneo */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-2xl border border-slate-800 shadow-xl">
              <button
                onClick={handleZoomIn}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Acercar mapa (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Alejar mapa (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={handleResetMap}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                title="Restablecer posición inicial"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Banner de Instrucciones */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-slate-800 text-[11px] text-slate-300 shadow-lg pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span><strong>Mueve el mapa:</strong> Arrastra y haz clic en las canchas</span>
            </div>

            {/* VISTA 1: MAPA DEPORTIVO VECTORIAL INTERACTIVO CON DRAG & ZOOM */}
            {mapMode === 'interactive' ? (
              <div 
                className="w-full aspect-[16/10] min-h-[420px] relative overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#090e17]"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <div 
                  className="w-full h-full transition-transform duration-75 origin-center"
                  style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                  }}
                >
                  <svg 
                    viewBox="0 0 800 500" 
                    className="w-full h-full"
                  >
                    {/* Fondo del plano urbano */}
                    <rect x="0" y="0" width="800" height="500" fill="#090e17" />

                    {/* Manzanas urbanas de Chillán */}
                    <g opacity="0.3">
                      {[...Array(9)].map((_, i) => (
                        <rect key={`grid-h-${i}`} x="30" y={i * 55 + 15} width="740" height="34" rx="4" fill="#131c2e" />
                      ))}
                    </g>

                    {/* Red Vial de Chillán */}
                    {/* Av. Paul Harris / O'Higgins */}
                    <path d="M 40 460 L 760 120" stroke="#1e293b" strokeWidth="22" strokeLinecap="round" />
                    <path d="M 40 460 L 760 120" stroke="#334155" strokeWidth="16" strokeLinecap="round" />
                    <text x="210" y="375" fill="#94a3b8" fontSize="9" transform="rotate(-23 210 375)">Av. Paul Harris</text>

                    {/* Av. Vicente Méndez (Acceso a Cancha Don Marcelo) */}
                    <path d="M 120 70 L 720 430" stroke="#10b981" strokeWidth="26" strokeLinecap="round" opacity="0.35" />
                    <path d="M 120 70 L 720 430" stroke="#047857" strokeWidth="16" strokeLinecap="round" />
                    <path d="M 120 70 L 720 430" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8,8" />
                    <text x="350" y="210" fill="#ffffff" fontWeight="bold" fontSize="11" transform="rotate(31 350 210)">
                      AV. VICENTE MÉNDEZ
                    </text>

                    {/* Av. Alonso de Ercilla */}
                    <path d="M 60 280 L 750 360" stroke="#334155" strokeWidth="14" strokeLinecap="round" />
                    <text x="560" y="340" fill="#94a3b8" fontSize="9">Av. Alonso de Ercilla</text>

                    {/* Río Chillán */}
                    <path d="M 20 480 Q 250 430 500 480 T 800 460" fill="none" stroke="#0369a1" strokeWidth="18" opacity="0.4" />
                    <text x="520" y="470" fill="#38bdf8" fontSize="10">Río Chillán</text>

                    {/* Hito: Plaza de Armas de Chillán */}
                    <g transform="translate(180, 140)">
                      <rect x="-18" y="-18" width="36" height="36" rx="6" fill="#0284c7" opacity="0.3" />
                      <rect x="-10" y="-10" width="20" height="20" rx="3" fill="#38bdf8" />
                      <text x="18" y="4" fill="#bae6fd" fontSize="10" fontWeight="bold">🏛️ Plaza de Armas</text>
                    </g>

                    {/* Hito: Campus INACAP Sede Chillán */}
                    <g transform="translate(470, 180)">
                      <circle cx="0" cy="0" r="14" fill="#ef4444" opacity="0.3" />
                      <circle cx="0" cy="0" r="7" fill="#f87171" />
                      <text x="12" y="4" fill="#fecaca" fontSize="9" fontWeight="bold">🎓 INACAP Chillán</text>
                    </g>

                    {/* RENDERIZADO DE LAS 7 CANCHAS DE CHILLÁN */}
                    {filteredCourts.map((court) => {
                      const isSelected = selectedCourtId === court.id;
                      const isOfficial = court.isOfficialSystem;

                      return (
                        <g 
                          key={court.id}
                          transform={`translate(${court.svgPos.x}, ${court.svgPos.y})`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectCourt(court);
                          }}
                          className="cursor-pointer group"
                        >
                          {/* Pulso de radar para la cancha oficial */}
                          {isOfficial && (
                            <>
                              <circle cx="0" cy="0" r="32" fill="#10b981" opacity="0.2" className="animate-ping" />
                              <circle cx="0" cy="0" r="22" fill="#10b981" opacity="0.3" />
                            </>
                          )}

                          {/* Aura de selección */}
                          {isSelected && (
                            <circle cx="0" cy="0" r="26" fill="none" stroke={isOfficial ? '#22c55e' : '#38bdf8'} strokeWidth="2.5" strokeDasharray="4,4" className="animate-spin [animation-duration:10s]" />
                          )}

                          {/* Base Pin */}
                          <g transform="translate(0, -22)">
                            <path 
                              d="M 0 0 L -12 -22 A 13 13 0 1 1 12 -22 Z" 
                              fill={isOfficial ? '#10b981' : isSelected ? '#38bdf8' : '#334155'} 
                              stroke="#ffffff" 
                              strokeWidth="2" 
                              className="group-hover:scale-110 transition-transform"
                            />
                            {isOfficial ? (
                              <text x="0" y="-18" textAnchor="middle" fill="#ffffff" fontSize="12">⭐</text>
                            ) : (
                              <circle cx="0" cy="-22" r="5" fill="#ffffff" />
                            )}
                          </g>

                          {/* Etiqueta de la Cancha */}
                          <g transform="translate(0, 16)">
                            <rect 
                              x="-75" 
                              y="0" 
                              width="150" 
                              height="24" 
                              rx="6" 
                              fill={isSelected ? '#020617' : '#0f172a'} 
                              stroke={isOfficial ? '#22c55e' : isSelected ? '#38bdf8' : '#334155'} 
                              strokeWidth={isSelected ? '2' : '1'} 
                            />
                            <text 
                              x="0" 
                              y="14" 
                              textAnchor="middle" 
                              fill={isOfficial ? '#a7f3d0' : '#ffffff'} 
                              fontSize="9" 
                              fontWeight="bold"
                            >
                              {court.name.length > 22 ? court.name.substring(0, 22) + '...' : court.name}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>
            ) : (
              /* VISTA 2: GOOGLE MAPS REAL EN VIVO (IFRAME INTERACTIVO) */
              <div className="w-full aspect-[16/10] min-h-[420px] relative bg-slate-950">
                <iframe
                  title="Google Maps Chillán Canchas"
                  src="https://maps.google.com/maps?q=-36.6025,-72.0850&hl=es&z=14&output=embed"
                  className="w-full h-full border-0 rounded-3xl"
                  loading="lazy"
                  allowFullScreen
                ></iframe>
              </div>
            )}
          </div>

          {/* LISTA HORIZONTAL RÁPIDA DE CANCHAS DE CHILLÁN */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 no-scrollbar">
            {CHILLAN_COURTS.map(c => {
              const isSelected = selectedCourtId === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => handleSelectCourt(c)}
                  className={`p-3 rounded-2xl border text-left min-w-[210px] max-w-[240px] flex-shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-950/40 shadow-lg ring-1 ring-emerald-500'
                      : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {c.isOfficialSystem ? '⭐ OFICIAL' : c.category.toUpperCase()}
                    </span>
                    <span className="text-amber-400 font-bold text-[10px] flex items-center gap-0.5">
                      ★ {c.rating}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-white truncate">{c.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{c.address}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* COLUMNA DERECHA: FICHA DETALLADA DE LA CANCHA SELECCIONADA */}
        <div className="lg:col-span-4 bg-slate-950 p-6 rounded-3xl border border-slate-800 space-y-5 shadow-2xl sticky top-24">
          
          {/* Header de la Cancha */}
          <div className="space-y-1.5 pb-4 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase ${
                selectedCourt.isOfficialSystem 
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                  : 'bg-slate-800 text-slate-300'
              }`}>
                {selectedCourt.isOfficialSystem ? '⭐ Cancha Oficial Sistema' : selectedCourt.sectorLabel}
              </span>
              <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                ★ {selectedCourt.rating}
              </span>
            </div>

            <h3 className="text-lg font-black text-white leading-snug">
              {selectedCourt.name}
            </h3>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{selectedCourt.address}</span>
            </div>
          </div>

          {/* Características Técnicas */}
          <div className="space-y-2 text-xs">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Superficie</span>
              <strong className="text-white text-[11px] block">{selectedCourt.surface}</strong>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Iluminación Nocturna</span>
              <span className="text-emerald-400 font-bold text-[11px] block">{selectedCourt.lighting}</span>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 space-y-1">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Distancia y Conectividad</span>
              <span className="text-slate-300 text-[11px] block">{selectedCourt.distanceFromCenter}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
              {selectedCourt.description}
            </p>
          </div>

          {/* ACCIÓN PRINCIPAL: SI ES LA CANCHA OFICIAL, PERMITE RESERVAR ONLINE */}
          {selectedCourt.isOfficialSystem && onSelectBooking && (
            <button
              onClick={onSelectBooking}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs shadow-xl shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-950" />
              <span>Reservar en Vivo en Esta Cancha</span>
            </button>
          )}

          {/* BOTONES DE INTEGRACIÓN CON APPS DE MAPAS Y NAVEGACIÓN */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Abrir Ruta Directa en tu App Favorita:
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* Google Maps */}
              <a
                href={getGoogleMapsDirUrl(selectedCourt)}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Maps</span>
              </a>

              {/* Waze */}
              <a
                href={getWazeUrl(selectedCourt)}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5 text-cyan-400" />
                <span>Waze</span>
              </a>
            </div>

            {/* Apple Maps y Copiar Dirección */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <a
                href={getAppleMapsUrl(selectedCourt)}
                target="_blank"
                rel="noreferrer"
                className="py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 text-[11px]"
              >
                <span>Apple Maps</span>
              </a>

              <button
                onClick={() => handleCopyAddress(selectedCourt)}
                className="py-2 px-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors flex items-center justify-center gap-1.5 text-[11px] cursor-pointer"
              >
                {copiedId === selectedCourt.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>Copiar Dirección</span>
                  </>
                )}
              </button>
            </div>

            {/* Enlace general de búsqueda de canchas en Chillán */}
            <a
              href="https://www.google.com/maps/search/canchas+babyfutbol+chillan"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 rounded-xl bg-slate-900/40 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80 text-[11px] flex items-center justify-center gap-1.5 transition-colors block text-center"
            >
              <span>Buscar todas las canchas en la app de Google Maps</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
