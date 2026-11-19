import React, { useState, useEffect } from 'react';
import { UserRole, Complex, Court, WeatherCondition, Reservation, ITILIncident } from './types';
import { MOCK_COMPLEXES, INITIAL_WEATHER, INITIAL_RESERVATIONS, MOCK_ITIL_INCIDENTS } from './data/mockData';
import { simulateCourtTelemetry } from './services/iotGateway';
import { 
  fetchComplexesFromSupabase, 
  fetchReservationsFromSupabase, 
  createReservationInSupabase, 
  updateIoTRelayInSupabase,
  supabase 
} from './services/supabaseClient';
import { Navbar } from './components/Navbar';
import { ExploreCourtsView } from './components/views/ExploreCourtsView';
import { ReelsView } from './components/views/ReelsView';
import { PlayerPortal } from './components/roles/PlayerPortal';
import { OwnerDashboard } from './components/roles/OwnerDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { Footer } from './components/common/Footer';
import { AIAssistantWidget } from './components/ai/AIAssistantWidget';

export const App: React.FC = () => {
  // Navegación de vistas para el cliente
  const [activeView, setActiveView] = useState<'home' | 'reels' | 'booking'>('home');

  // Estado de Rol Activo: 'player' (cliente) u 'owner' (dueño de la cancha)
  const [currentRole, setCurrentRole] = useState<UserRole>('player');

  // Estado de Autenticación con Login propio y Normativas
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<string | null>('Marcelo Gutiérrez');

  // Estado de conexión a Supabase
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);

  // El complejo y la cancha única de Babyfútbol
  const [complexes, setComplexes] = useState<Complex[]>(MOCK_COMPLEXES);
  const activeComplex = complexes[0];
  const courts = activeComplex.courts;
  const babyCourt = courts[0];

  // Estado del Clima de Chillán
  const [weather, setWeather] = useState<WeatherCondition>(INITIAL_WEATHER);

  // Modo Offline Edge (Tolerancia a cortes de internet en Ñuble)
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // Reservas de la Cancha de Babyfútbol
  const [reservations, setReservations] = useState<Reservation[]>(INITIAL_RESERVATIONS);

  // Notificación flotante
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  // Carga inicial y sincronización con Supabase
  useEffect(() => {
    let isMounted = true;

    async function syncWithSupabase() {
      try {
        const [dbComplexes, dbReservations] = await Promise.all([
          fetchComplexesFromSupabase(),
          fetchReservationsFromSupabase()
        ]);

        if (isMounted) {
          if (dbComplexes && dbComplexes.length > 0) {
            setComplexes(dbComplexes);
          }
          if (dbReservations && dbReservations.length > 0) {
            setReservations(dbReservations);
          }
          setIsSupabaseConnected(true);
          showNotification('🟢 Conectado exitosamente a Supabase en la nube.');
        }
      } catch (err) {
        console.warn('[Supabase] Usando datos locales de respaldo:', err);
      }
    }

    syncWithSupabase();

    // Suscripción Realtime a cambios en reservas
    const channel = supabase
      .channel('supabase-realtime-reservations')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        async () => {
          try {
            const updated = await fetchReservationsFromSupabase();
            if (isMounted && updated.length > 0) {
              setReservations(updated);
            }
          } catch (e) {
            console.error('Error actualizando reservas en tiempo real:', e);
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  // Conmutar relé de luces LED de la cancha de babyfútbol
  const handleToggleCourtRelay = (courtId: string) => {
    setComplexes(prevComplexes => {
      return prevComplexes.map(comp => {
        const updatedCourts = comp.courts.map(court => {
          if (court.id !== courtId) return court;
          const nextState = !court.iot.relayState;
          const updated = simulateCourtTelemetry(court, nextState);
          
          // Sincronizar estado en Supabase
          updateIoTRelayInSupabase(courtId, nextState);

          showNotification(
            nextState 
              ? `[IoT SEC] 4 Torres LED encendidas (Potencia: ${updated.iot.activePowerKw} kW). Sincronizado en Supabase.`
              : `[IoT SEC] Relé desactivado. Luminarias apagadas. Sincronizado en Supabase.`
          );
          return updated;
        });
        return { ...comp, courts: updatedCourts };
      });
    });
  };

  // Actualizar configuración de Yield Management
  const handleUpdateYieldConfig = (newConfig: Complex['yieldConfig']) => {
    setComplexes(prev => prev.map(c => ({ ...c, yieldConfig: newConfig })));
    showNotification('Parámetros de Tarifa Dinámica actualizados correctamente.');
  };

  // Simular cambio climático en Chillán
  const handleToggleWeather = () => {
    setWeather(prev => {
      if (prev.condition === 'nublado') {
        showNotification('Simulación: Lluvia moderada en Chillán (El algoritmo ofrece descuentos promocionales).');
        return {
          city: 'Chillán (Región de Ñuble)',
          temperatureC: 13,
          condition: 'lluvia_fuerte',
          precipitationProbability: 85,
          description: 'Lluvia en Chillán. Tarificación dinámica activa incentivo de descuento para partidos diurnos.',
          updatedAt: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        };
      } else if (prev.condition === 'lluvia_fuerte') {
        showNotification('Simulación: Tarde despejada en Chillán (Condiciones estándar).');
        return {
          city: 'Chillán (Región de Ñuble)',
          temperatureC: 22,
          condition: 'soleado',
          precipitationProbability: 0,
          description: 'Cielo despejado en Chillán. Alta demanda para partidos nocturnos.',
          updatedAt: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
        };
      } else {
        showNotification('Simulación: Tiempo templado en Chillán.');
        return INITIAL_WEATHER;
      }
    });
  };

  // Manejo de Auth
  const handleAuthSuccess = (role: UserRole, name: string) => {
    setCurrentUser(name);
    setCurrentRole(role);
    if (role === 'owner') {
      showNotification(`¡Bienvenido ${name}! Has iniciado sesión en el Panel del Dueño.`);
    } else {
      showNotification(`¡Bienvenido ${name}! Has ingresado como Capitán/Jugador.`);
      setActiveView('booking');
    }
  };

  // Desplazarse al mapa
  const handleScrollToMap = () => {
    if (currentRole !== 'player' || activeView !== 'home') {
      setCurrentRole('player');
      setActiveView('home');
    }
    setTimeout(() => {
      document.getElementById('mapa-ubicacion')?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans selection:bg-[#22c55e] selection:text-slate-950 relative">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-20 sm:bottom-6 left-6 z-50 bg-[#0f172a] border border-[#22c55e]/60 text-slate-100 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-200">
          <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e] animate-ping"></div>
          <span className="text-xs font-semibold">{notification}</span>
        </div>
      )}

      {/* Navbar Superior */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={(role) => {
          setCurrentRole(role);
          if (role === 'player') setActiveView('booking');
        }}
        activeView={activeView}
        onViewChange={setActiveView}
        isOfflineMode={isOfflineMode}
        onToggleOffline={() => {
          setIsOfflineMode(prev => !prev);
          showNotification(!isOfflineMode 
            ? 'Modo Edge Autónomo activado: Simulación de corte de fibra en Chillán. El sistema valida pases con caché local.' 
            : 'Conectividad restablecida. Sincronización en la nube completada.'
          );
        }}
        weather={weather}
        onToggleWeather={handleToggleWeather}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setIsAuthModalOpen(true);
        }}
        currentUser={currentUser}
        isSupabaseConnected={isSupabaseConnected}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* VISTA CLIENTE / JUGADORES */}
        {currentRole === 'player' && (
          <>
            {activeView === 'home' && (
              <ExploreCourtsView
                onSelectCategory={() => setActiveView('booking')}
                onOpenAuth={(mode) => {
                  setAuthMode(mode);
                  setIsAuthModalOpen(true);
                }}
              />
            )}

            {activeView === 'reels' && (
              <ReelsView
                onNavigateToCourts={() => setActiveView('booking')}
              />
            )}

            {activeView === 'booking' && (
              <PlayerPortal
                complex={activeComplex}
                courts={courts}
                weather={weather}
                reservations={reservations}
                onNewReservation={async (newRes) => {
                  setReservations(prev => [newRes, ...prev]);
                  showNotification(`¡Reserva confirmada para ${newRes.playerName}! Pase QR: ${newRes.qrAccessCode}`);
                  try {
                    await createReservationInSupabase(newRes);
                    showNotification(`✅ Reserva guardada y sincronizada en Supabase.`);
                  } catch (err) {
                    console.error('Error guardando en Supabase:', err);
                  }
                }}
                onSimulateQRScan={(qrCode) => {
                  setCurrentRole('owner');
                  showNotification(`Pase ${qrCode} cargado en el panel del dueño para validar acceso.`);
                }}
              />
            )}
          </>
        )}

        {/* VISTA DEL DUEÑO DE LA CANCHA */}
        {currentRole === 'owner' && (
          <OwnerDashboard
            complex={activeComplex}
            courts={courts}
            weather={weather}
            onToggleCourtRelay={handleToggleCourtRelay}
            onUpdateYieldConfig={handleUpdateYieldConfig}
          />
        )}
      </main>

      {/* WIDGET DEL AGENTE DE IA (CANCHABOT IA FLOTANTE) */}
      <AIAssistantWidget
        court={babyCourt}
        reservations={reservations}
        weather={weather}
        onNavigateToBooking={() => {
          setCurrentRole('player');
          setActiveView('booking');
        }}
        onOpenMap={handleScrollToMap}
      />

      {/* Modal de Autenticación con Login propio y Normativas */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* FOOTER PERMANENTE EN CADA PÁGINA CON REDES SOCIALES Y CONTACTO */}
      <Footer
        onOpenNormativas={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
        onOpenMap={handleScrollToMap}
        onOpenAI={() => {
          // El botón del widget IA flotante se enfoca o se activa
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default App;
