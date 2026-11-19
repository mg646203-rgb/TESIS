export type UserRole = 'owner' | 'player' | 'staff';

export type SportType = 'babyfutbol';

export type CourtStatus = 'available' | 'occupied' | 'maintenance' | 'reserved';

export interface IoTTelemetry {
  deviceId: string;
  relayState: boolean;       // Conmutación luminarias
  contactorEngaged: boolean; // Contactor trifásico SEC NCh Elec 4/2003
  turnstileUnlocked: boolean;// Estado torniquete QR
  currentAmperes: number;    // Sensor CT (A)
  activePowerKw: number;     // Potencia activa (kW)
  energyConsumedKwh: number; // Consumo acumulado sesión (kWh)
  ambientTempC: number;      // Temperatura cuadro eléctrico
  firmwareVersion: string;
  lastHeartbeat: string;
  isEdgeAutonomous: boolean; // Tolerancia a fallos: Operación con caché local
}

export interface Court {
  id: string;
  complexId: string;
  name: string;
  sport: SportType;
  surfaceAreaM2: number;     // Metros cuadrados físicos
  surfaceType: string;      // ej: "Césped Sintético Monofilamento", "Pádel Vidrio Templado 12mm"
  indoor: boolean;
  basePricePerHour: number;  // CLP
  status: CourtStatus;
  currentReservationId?: string;
  iot: IoTTelemetry;
  // Métricas de eficiencia de suelo
  metrics: {
    monthlyUtilizationRate: number; // %
    revenuePerM2Month: number;      // CLP / m2
    revPASH: number;                // Revenue Per Available Slot-Hour / m2
  };
  coordinates: {
    x: number; // Posición en plano digital (%)
    y: number;
    w: number;
    h: number;
  };
}

export interface WeatherCondition {
  city: string;             // ej: "Chillán"
  temperatureC: number;     // ej: 14°C
  condition: 'soleado' | 'nublado' | 'lluvia_ligera' | 'lluvia_fuerte' | 'frio_extremo';
  precipitationProbability: number; // %
  description: string;
  updatedAt: string;
}

export interface YieldRuleConfig {
  enabled: boolean;
  weightTimeSlot: number;     // Ponderación Horario Peak/Valle (0 - 1)
  weightWeekend: number;      // Ponderación Fin de semana (0 - 1)
  weightRealtimeOccupancy: number; // Ponderación Llenado en vivo (0 - 1)
  weightWeatherÑuble: number; // Ponderación Clima Chillán (0 - 1)
  maxPriceMultiplier: number; // Techo máximo anti-abuso (ej. 1.35 = +35%)
  minPriceMultiplier: number; // Piso mínimo promocional (ej. 0.65 = -35%)
}

export interface PriceBreakdown {
  basePrice: number;
  timeSlotFactor: number;
  weekendFactor: number;
  occupancyFactor: number;
  weatherFactor: number;
  surgeMultiplier: number;
  finalPrice: number;
  explanationBadges: {
    label: string;
    type: 'peak' | 'discount' | 'neutral';
    value: string;
  }[];
}

export interface Reservation {
  id: string;
  courtId: string;
  complexId: string;
  playerName: string;
  playerEmail: string;
  playerPhone: string;
  date: string;              // YYYY-MM-DD
  timeSlot: string;          // HH:00 (ej: "19:00 - 20:00")
  basePrice: number;
  finalPrice: number;
  status: 'confirmed' | 'active' | 'completed' | 'cancelled';
  paid: boolean;
  paymentMethod: 'webpay_plus' | 'transfer' | 'counter_cash';
  qrAccessCode: string;      // Token criptográfico HMAC
  qrValidFrom: string;       // ISO
  qrValidUntil: string;      // ISO
  lightsAutoEngaged: boolean;
  turnstilePassed: boolean;
  createdAt: string;
}

export interface Complex {
  id: string;
  name: string;
  corporateName: string;
  rut: string;
  commune: string;           // "Chillán", "San Carlos", etc.
  address: string;
  totalLandAreaM2: number;   // Superficie total del predio
  usableSportAreaM2: number; // Superficie de canchas
  courts: Court[];
  yieldConfig: YieldRuleConfig;
  financialMetrics: {
    monthlyGrossRevenue: number;
    monthlyElectricityCost: number;
    averageOccupancyRate: number;
    averageRevenuePerM2: number;
  };
}

export interface FinancialScenario {
  id: string;
  title: string;
  description: string;
  distribution: {
    futbol7Count: number;
    padelCount: number;
    tenisCount: number;
    usedAreaM2: number;
    availableAreaM2: number;
  };
  capex: {
    groundPreparation: number;
    courtsConstruction: number;
    lightingAndIotSEC: number;
    clubhouseAndCirculation: number;
    totalCapex: number;
  };
  opexAnnual: {
    electricityAndMaintenance: number;
    saasSubscription: number;
    insuranceAndPermits: number;
    marketing: number;
    totalOpexAnnual: number;
  };
  financialOutputs: {
    annualGrossRevenue: number;
    annualNetCashFlow: number;
    waccPercentage: number;   // Tasa de descuento (%)
    van5YearsCLP: number;     // Valor Actual Neto
    tirPercentage: number;    // Tasa Interna de Retorno (%)
    paybackYears: number;     // Período de recuperación
    returnPerM2Annual: number;// CLP / m2 / año
  };
}

export interface ITILIncident {
  id: string;
  code: string;               // INC-2026-004
  title: string;
  category: 'IoT_Relay' | 'QR_Access' | 'Payment_Gateway' | 'Electrical_SEC' | 'Offline_Edge';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved';
  slaTargetHours: number;
  createdAt: string;
  resolvedAt?: string;
  courtName?: string;
  resolutionNotes?: string;
}
