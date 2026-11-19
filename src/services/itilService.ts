import { ITILIncident } from '../types';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  source: string;
  eventType: 'SEC_CONTACTOR_ENGAGED' | 'QR_ACCESS_GRANTED' | 'QR_ACCESS_DENIED' | 'DOUBLE_BOOKING_PREVENTED' | 'EDGE_OFFLINE_SYNC';
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  details: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-001',
    timestamp: '2026-10-05 20:00:03',
    source: 'IoT-Hub-ESP32-PD1',
    eventType: 'SEC_CONTACTOR_ENGAGED',
    severity: 'INFO',
    details: 'Relé de luminarias Pádel 1 activado. Soft-start delay: 800ms. Corriente nominal: 8.4A conforme a SEC NCh Elec. 4/2003.'
  },
  {
    id: 'log-002',
    timestamp: '2026-10-05 19:48:15',
    source: 'Turnstile-Scanner-P1',
    eventType: 'QR_ACCESS_GRANTED',
    severity: 'INFO',
    details: 'Pase QR CCH-7789-Q4-SEC validado para Marcelo Gutiérrez. Ventana de ingreso anticipado: 12 min antes.'
  },
  {
    id: 'log-003',
    timestamp: '2026-10-05 17:30:22',
    source: 'Yield-Booking-Engine',
    eventType: 'DOUBLE_BOOKING_PREVENTED',
    severity: 'WARNING',
    details: 'OWASP Concurrency Lock activado: Dos usuarios intentaron pagar el slot 21:00 simultáneamente. Transacción duplicada abortada de forma segura.'
  },
  {
    id: 'log-004',
    timestamp: '2026-10-05 12:04:18',
    source: 'Edge-Gateway-Chillan',
    eventType: 'EDGE_OFFLINE_SYNC',
    severity: 'WARNING',
    details: 'Pérdida momentánea de conectividad WAN. Activado modo de contingencia autónomo ITIL en memoria SPIFFS local.'
  }
];

export interface SLAMetrics {
  systemUptimePercentage: number;
  iotRelaySwitchLatencyMs: number;
  qrScanToDoorOpenMs: number;
  incidentsResolvedInSlaPercentage: number;
  totalMonthlyReservations: number;
  preventedDoubleBookings: number;
}

export const CURRENT_SLA_METRICS: SLAMetrics = {
  systemUptimePercentage: 99.96, // Superior a la meta del 99.9%
  iotRelaySwitchLatencyMs: 380,   // Sub-segundo
  qrScanToDoorOpenMs: 650,
  incidentsResolvedInSlaPercentage: 98.4,
  totalMonthlyReservations: 1280,
  preventedDoubleBookings: 14
};
