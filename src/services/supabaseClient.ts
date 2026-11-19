import { createClient } from '@supabase/supabase-js';
import { Complex, Court, Reservation, ITILIncident } from '../types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://xibgdzpzluihnaoaefrc.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_vExSxNqPDojITJOEtoARZA_1H9D7SIx';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================================
// SERVICIOS DE COMPLEJOS Y CANCHAS
// ============================================================================

export async function fetchComplexesFromSupabase(): Promise<Complex[]> {
  try {
    const { data: complexesData, error: compError } = await supabase
      .from('complexes')
      .select('*, yield_configs(*)');

    if (compError) throw compError;
    if (!complexesData || complexesData.length === 0) return [];

    const { data: courtsData, error: courtError } = await supabase
      .from('courts')
      .select('*, iot_devices(*)');

    if (courtError) throw courtError;

    return complexesData.map((comp: any) => {
      const relatedCourts: Court[] = (courtsData || [])
        .filter((c: any) => c.complex_id === comp.id)
        .map((c: any) => {
          const iot = c.iot_devices?.[0] || c.iot_devices || {
            deviceId: 'ESP32-BABY1-SEC01',
            relayState: false,
            contactorEngaged: false,
            turnstileUnlocked: false,
            currentAmperes: 0,
            activePowerKw: 0,
            energyConsumedKwh: 0,
            ambientTempC: 20,
            firmwareVersion: 'v2.4.1-SEC-NCh4',
            lastHeartbeat: 'Recién',
            isEdgeAutonomous: true
          };

          return {
            id: c.id,
            complexId: c.complex_id,
            name: c.name,
            sport: c.sport,
            surfaceAreaM2: Number(c.surface_area_m2) || 600,
            surfaceType: c.surface_type,
            indoor: c.indoor,
            basePricePerHour: Number(c.base_price_per_hour) || 28000,
            status: c.status,
            currentReservationId: c.current_reservation_id,
            iot: {
              deviceId: iot.device_id || iot.deviceId,
              relayState: iot.relay_state ?? iot.relayState ?? false,
              contactorEngaged: iot.contactor_engaged ?? iot.contactorEngaged ?? false,
              turnstileUnlocked: iot.turnstile_unlocked ?? iot.turnstileUnlocked ?? false,
              currentAmperes: Number(iot.current_amperes ?? iot.currentAmperes ?? 0),
              activePowerKw: Number(iot.active_power_kw ?? iot.activePowerKw ?? 0),
              energyConsumedKwh: Number(iot.energy_consumed_kwh ?? iot.energyConsumedKwh ?? 0),
              ambientTempC: Number(iot.ambient_temp_c ?? iot.ambientTempC ?? 20),
              firmwareVersion: iot.firmware_version || iot.firmwareVersion || 'v2.4.1',
              lastHeartbeat: iot.last_heartbeat ? new Date(iot.last_heartbeat).toLocaleTimeString() : 'Hace 2 seg',
              isEdgeAutonomous: iot.is_edge_autonomous ?? iot.isEdgeAutonomous ?? true
            },
            metrics: {
              monthlyUtilizationRate: 78.0,
              revenuePerM2Month: 6850,
              revPASH: 48.2
            },
            coordinates: c.coordinates || { x: 20, y: 15, w: 60, h: 70 }
          };
        });

      const yieldCfg = comp.yield_configs?.[0] || comp.yield_configs || {};

      return {
        id: comp.id,
        name: comp.name,
        corporateName: comp.corporate_name || comp.name,
        rut: comp.rut || '',
        commune: comp.commune || 'Chillán',
        address: comp.address || '',
        totalLandAreaM2: Number(comp.total_land_area_m2) || 1200,
        usableSportAreaM2: Number(comp.usable_sport_area_m2) || 600,
        yieldConfig: {
          enabled: yieldCfg.enabled ?? true,
          weightTimeSlot: Number(yieldCfg.weight_time_slot ?? 0.85),
          weightWeekend: Number(yieldCfg.weight_weekend ?? 0.70),
          weightRealtimeOccupancy: Number(yieldCfg.weight_realtime_occupancy ?? 0.90),
          weightWeatherÑuble: Number(yieldCfg.weight_weather_nuble ?? 0.60),
          maxPriceMultiplier: Number(yieldCfg.max_price_multiplier ?? 1.30),
          minPriceMultiplier: Number(yieldCfg.min_price_multiplier ?? 0.75)
        },
        financialMetrics: {
          monthlyGrossRevenue: 4350000,
          monthlyElectricityCost: 260000,
          averageOccupancyRate: 76.5,
          averageRevenuePerM2: 7250
        },
        courts: relatedCourts
      };
    });
  } catch (err) {
    console.error('[Supabase] Error cargando complejos:', err);
    throw err;
  }
}

// ============================================================================
// SERVICIOS DE RESERVAS
// ============================================================================

export async function fetchReservationsFromSupabase(): Promise<Reservation[]> {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: false })
      .order('time_slot', { ascending: true });

    if (error) throw error;
    if (!data) return [];

    return data.map((r: any) => ({
      id: r.id,
      courtId: r.court_id,
      complexId: r.complex_id,
      playerName: r.player_name,
      playerEmail: r.player_email,
      playerPhone: r.player_phone,
      date: r.reservation_date,
      timeSlot: r.time_slot,
      basePrice: Number(r.base_price),
      finalPrice: Number(r.final_price),
      status: r.status,
      paid: r.paid,
      paymentMethod: r.payment_method,
      qrAccessCode: r.qr_access_code,
      qrValidFrom: r.qr_valid_from,
      qrValidUntil: r.qr_valid_until,
      lightsAutoEngaged: r.lights_auto_engaged,
      turnstilePassed: r.turnstile_passed,
      createdAt: r.created_at
    }));
  } catch (err) {
    console.error('[Supabase] Error cargando reservas:', err);
    throw err;
  }
}

export async function createReservationInSupabase(res: Omit<Reservation, 'id'> & { id?: string }): Promise<Reservation> {
  const insertPayload = {
    court_id: res.courtId,
    complex_id: res.complexId,
    player_name: res.playerName,
    player_email: res.playerEmail,
    player_phone: res.playerPhone,
    reservation_date: res.date,
    time_slot: res.timeSlot,
    base_price: res.basePrice,
    final_price: res.finalPrice,
    status: res.status,
    paid: res.paid,
    payment_method: res.paymentMethod,
    qr_access_code: res.qrAccessCode,
    qr_valid_from: res.qrValidFrom,
    qr_valid_until: res.qrValidUntil,
    lights_auto_engaged: res.lightsAutoEngaged,
    turnstile_passed: res.turnstilePassed
  };

  const { data, error } = await supabase
    .from('reservations')
    .insert(insertPayload)
    .select()
    .single();

  if (error) {
    console.error('[Supabase] Error creando reserva:', error);
    throw error;
  }

  return {
    id: data.id,
    courtId: data.court_id,
    complexId: data.complex_id,
    playerName: data.player_name,
    playerEmail: data.player_email,
    playerPhone: data.player_phone,
    date: data.reservation_date,
    timeSlot: data.time_slot,
    basePrice: Number(data.base_price),
    finalPrice: Number(data.final_price),
    status: data.status,
    paid: data.paid,
    paymentMethod: data.payment_method,
    qrAccessCode: data.qr_access_code,
    qrValidFrom: data.qr_valid_from,
    qrValidUntil: data.qr_valid_until,
    lightsAutoEngaged: data.lights_auto_engaged,
    turnstilePassed: data.turnstile_passed,
    createdAt: data.created_at
  };
}

// ============================================================================
// SERVICIOS DE TELEMETRÍA IOT
// ============================================================================

export async function updateIoTRelayInSupabase(courtId: string, relayState: boolean): Promise<void> {
  try {
    const { error } = await supabase
      .from('iot_devices')
      .update({
        relay_state: relayState,
        contactor_engaged: relayState,
        active_power_kw: relayState ? 2.85 : 0.0,
        current_amperes: relayState ? 12.8 : 0.0,
        updated_at: new Date().toISOString()
      })
      .eq('court_id', courtId);

    if (error) console.warn('[Supabase] Error actualizando relé IoT:', error);
  } catch (err) {
    console.error('[Supabase] Fallo en IoT Relay update:', err);
  }
}

// ============================================================================
// SERVICIOS DE INCIDENCIAS ITIL
// ============================================================================

export async function fetchIncidentsFromSupabase(): Promise<ITILIncident[]> {
  try {
    const { data, error } = await supabase
      .from('itil_incidents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    if (!data) return [];

    return data.map((inc: any) => ({
      id: inc.id,
      code: inc.code,
      title: inc.title,
      category: inc.category,
      severity: inc.severity,
      status: inc.status,
      slaTargetHours: inc.sla_target_hours,
      createdAt: inc.created_at,
      resolvedAt: inc.resolved_at,
      courtName: inc.court_name,
      resolutionNotes: inc.resolution_notes
    }));
  } catch (err) {
    console.error('[Supabase] Error cargando incidentes ITIL:', err);
    throw err;
  }
}
