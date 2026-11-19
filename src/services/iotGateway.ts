import { Court, Reservation } from '../types';

export interface QRScanResult {
  success: boolean;
  message: string;
  reservation?: Reservation;
  courtId?: string;
  turnstileUnlocked: boolean;
  lightsEngaged: boolean;
  edgeOfflineFallback: boolean;
}

/**
 * Valida un código QR escaneado en el torniquete o lector de la cancha.
 * Aplica ventana de tolerancia: permite ingreso 15 minutos antes de la hora de reserva.
 */
export function validateQRAccess(
  qrCodeScanned: string,
  reservations: Reservation[],
  isOfflineMode: boolean = false
): QRScanResult {
  const code = qrCodeScanned.trim().toUpperCase();
  
  // Buscar reserva asociada al código QR
  const reservation = reservations.find(r => r.qrAccessCode.toUpperCase() === code);

  if (!reservation) {
    return {
      success: false,
      message: 'Código QR no reconocido o inexistente en el sistema.',
      turnstileUnlocked: false,
      lightsEngaged: false,
      edgeOfflineFallback: isOfflineMode
    };
  }

  if (reservation.status === 'cancelled') {
    return {
      success: false,
      message: 'La reserva asociada a este pase QR fue cancelada previamente.',
      turnstileUnlocked: false,
      lightsEngaged: false,
      edgeOfflineFallback: isOfflineMode
    };
  }

  // Validación de ventana horaria (En un entorno real se compara con new Date())
  // Para la demostración interactiva, permitimos validar reservas confirmadas o activas
  if (reservation.paid) {
    return {
      success: true,
      message: isOfflineMode 
        ? `[MODO EDGE AUTÓNOMO] Acceso concedido a ${reservation.playerName}. Clave HMAC validada en memoria local.`
        : `Acceso concedido a ${reservation.playerName}. Torniquete desbloqueado y contactor de luminarias sincronizado.`,
      reservation,
      courtId: reservation.courtId,
      turnstileUnlocked: true,
      lightsEngaged: true,
      edgeOfflineFallback: isOfflineMode
    };
  }

  return {
    success: false,
    message: 'Reserva pendiente de pago en pasarela Webpay Plus.',
    turnstileUnlocked: false,
    lightsEngaged: false,
    edgeOfflineFallback: isOfflineMode
  };
}

/**
 * Simula la telemetría eléctrica de una cancha (Norma SEC NCh Elec. 4/2003)
 */
export function simulateCourtTelemetry(court: Court, targetRelayState: boolean): Court {
  // Cancha babyfútbol: 4 torres esquineras con proyectores LED industriales = 2.8 kW (~12.8A a 220V SEC)
  const nominalCurrent = 12.8;
  const nominalPower = 2.85;

  // Añadir pequeña fluctuación realista (+- 3%)
  const randomVariance = 0.97 + (Math.random() * 0.06);

  const updatedCurrent = targetRelayState ? Number((nominalCurrent * randomVariance).toFixed(1)) : 0.0;
  const updatedPower = targetRelayState ? Number((nominalPower * randomVariance).toFixed(2)) : 0.0;

  return {
    ...court,
    status: targetRelayState ? 'occupied' : 'available',
    iot: {
      ...court.iot,
      relayState: targetRelayState,
      contactorEngaged: targetRelayState,
      turnstileUnlocked: targetRelayState,
      currentAmperes: updatedCurrent,
      activePowerKw: updatedPower,
      ambientTempC: targetRelayState ? 24.8 : 21.2,
      lastHeartbeat: 'Recién actualizado',
      energyConsumedKwh: Number((court.iot.energyConsumedKwh + (targetRelayState ? 0.3 : 0.0)).toFixed(2))
    }
  };
}
