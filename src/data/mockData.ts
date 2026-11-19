import { Complex, WeatherCondition, FinancialScenario, ITILIncident, Reservation, Court } from '../types';

export const INITIAL_WEATHER: WeatherCondition = {
  city: 'Chillán (Región de Ñuble)',
  temperatureC: 17,
  condition: 'nublado',
  precipitationProbability: 20,
  description: 'Cielo nuboso templado en Chillán. Condiciones ideales para partido de babyfútbol nocturno.',
  updatedAt: new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
};

export const BABY_COURT: Court = {
  id: 'court-baby-1',
  complexId: 'cpx-baby-chillan',
  name: 'Cancha Principal de Babyfútbol (5 vs 5)',
  sport: 'babyfutbol',
  surfaceAreaM2: 600, // Medidas reglamentarias 30m x 20m
  surfaceType: 'Pasto sintético FIFA Quality 50mm con caucho criogénico + 4 Torres LED 8x200W',
  indoor: false,
  basePricePerHour: 28000,
  status: 'occupied',
  currentReservationId: 'res-baby-101',
  iot: {
    deviceId: 'ESP32-BABY1-SEC01',
    relayState: true,
    contactorEngaged: true,
    turnstileUnlocked: true,
    currentAmperes: 12.8,
    activePowerKw: 2.85,
    energyConsumedKwh: 4.6,
    ambientTempC: 23.4,
    firmwareVersion: 'v2.4.1-SEC-NCh4',
    lastHeartbeat: 'Hace 2 seg',
    isEdgeAutonomous: true
  },
  metrics: {
    monthlyUtilizationRate: 78.0,
    revenuePerM2Month: 6850,
    revPASH: 48.2
  },
  coordinates: { x: 20, y: 15, w: 60, h: 70 }
};

export const MOCK_COMPLEXES: Complex[] = [
  {
    id: 'cpx-baby-chillan',
    name: 'Cancha de Babyfútbol Chillán',
    corporateName: 'Babyfútbol & Deportes Don Marcelo',
    rut: '18.452.930-1',
    commune: 'Chillán',
    address: 'Av. Vicente Méndez 1420, Chillán (Sector Los Volcanes)',
    totalLandAreaM2: 1200,
    usableSportAreaM2: 600,
    yieldConfig: {
      enabled: true,
      weightTimeSlot: 0.85,
      weightWeekend: 0.70,
      weightRealtimeOccupancy: 0.90,
      weightWeatherÑuble: 0.60,
      maxPriceMultiplier: 1.30,
      minPriceMultiplier: 0.75
    },
    financialMetrics: {
      monthlyGrossRevenue: 4350000,
      monthlyElectricityCost: 260000,
      averageOccupancyRate: 76.5,
      averageRevenuePerM2: 7250
    },
    courts: [BABY_COURT]
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-baby-101',
    courtId: 'court-baby-1',
    complexId: 'cpx-baby-chillan',
    playerName: 'Marcelo Gutiérrez',
    playerEmail: 'marcelo.g@inacap.cl',
    playerPhone: '+56 9 8451 2230',
    date: '2026-10-05',
    timeSlot: '20:00 - 21:00',
    basePrice: 28000,
    finalPrice: 33600,
    status: 'active',
    paid: true,
    paymentMethod: 'webpay_plus',
    qrAccessCode: 'BABY-7789-SEC',
    qrValidFrom: '2026-10-05T19:45:00',
    qrValidUntil: '2026-10-05T21:15:00',
    lightsAutoEngaged: true,
    turnstilePassed: true,
    createdAt: '2026-10-05T14:20:00'
  },
  {
    id: 'res-baby-102',
    courtId: 'court-baby-1',
    complexId: 'cpx-baby-chillan',
    playerName: 'Fabián Ortega (Equipo Los Galácticos)',
    playerEmail: 'fabian.ortega@inacapmail.cl',
    playerPhone: '+56 9 7612 9904',
    date: '2026-10-05',
    timeSlot: '21:00 - 22:00',
    basePrice: 28000,
    finalPrice: 35000,
    status: 'confirmed',
    paid: true,
    paymentMethod: 'webpay_plus',
    qrAccessCode: 'BABY-9921-SEC',
    qrValidFrom: '2026-10-05T20:45:00',
    qrValidUntil: '2026-10-05T22:15:00',
    lightsAutoEngaged: false,
    turnstilePassed: false,
    createdAt: '2026-10-05T16:11:00'
  },
  {
    id: 'res-baby-103',
    courtId: 'court-baby-1',
    complexId: 'cpx-baby-chillan',
    playerName: 'Benjamín Escarez (Tercer Tiempo FC)',
    playerEmail: 'benjamin.escarez@inacapmail.cl',
    playerPhone: '+56 9 9341 5567',
    date: '2026-10-05',
    timeSlot: '22:00 - 23:00',
    basePrice: 28000,
    finalPrice: 32200,
    status: 'confirmed',
    paid: true,
    paymentMethod: 'webpay_plus',
    qrAccessCode: 'BABY-4402-SEC',
    qrValidFrom: '2026-10-05T21:45:00',
    qrValidUntil: '2026-10-05T23:15:00',
    lightsAutoEngaged: false,
    turnstilePassed: false,
    createdAt: '2026-10-05T11:05:00'
  }
];

export const FINANCIAL_SCENARIOS: FinancialScenario[] = [
  {
    id: 'scen-baby-actual',
    title: 'Escenario 1: Operación Actual (Cancha Descubierta)',
    description: 'Cancha reglamentaria de babyfútbol al aire libre con iluminación LED industrial. Alta demanda nocturna y fines de semana, pero vulnerable a lluvias de invierno en Chillán.',
    distribution: {
      futbol7Count: 1,
      padelCount: 0,
      tenisCount: 0,
      usedAreaM2: 600,
      availableAreaM2: 600
    },
    capex: {
      groundPreparation: 6500000,
      courtsConstruction: 18000000,
      lightingAndIotSEC: 4800000,
      clubhouseAndCirculation: 5200000,
      totalCapex: 34500000
    },
    opexAnnual: {
      electricityAndMaintenance: 3120000,
      saasSubscription: 840000,
      insuranceAndPermits: 950000,
      marketing: 600000,
      totalOpexAnnual: 5510000
    },
    financialOutputs: {
      annualGrossRevenue: 34800000,
      annualNetCashFlow: 29290000,
      waccPercentage: 11.5,
      van5YearsCLP: 68400000,
      tirPercentage: 74.2,
      paybackYears: 1.3,
      returnPerM2Annual: 58000
    }
  },
  {
    id: 'scen-baby-techado',
    title: 'Escenario 2: Inversión en Techado Metálico (Recomendado)',
    description: 'Instalación de cubierta metálica de arco autoportante sobre la cancha. Elimina las cancelaciones por lluvia en invierno en Ñuble y permite arriendo continuo los 365 días del año.',
    distribution: {
      futbol7Count: 1,
      padelCount: 0,
      tenisCount: 0,
      usedAreaM2: 600,
      availableAreaM2: 600
    },
    capex: {
      groundPreparation: 1500000,
      courtsConstruction: 16500000, // Estructura galpón y policarbonato
      lightingAndIotSEC: 2800000,
      clubhouseAndCirculation: 2200000,
      totalCapex: 23000000
    },
    opexAnnual: {
      electricityAndMaintenance: 2900000,
      saasSubscription: 840000,
      insuranceAndPermits: 1100000,
      marketing: 800000,
      totalOpexAnnual: 5640000
    },
    financialOutputs: {
      annualGrossRevenue: 49600000, // +42% ingresos al operar en invierno
      annualNetCashFlow: 43960000,
      waccPercentage: 11.5,
      van5YearsCLP: 128500000,
      tirPercentage: 92.4,
      paybackYears: 0.9,
      returnPerM2Annual: 82666
    }
  },
  {
    id: 'scen-baby-quincho',
    title: 'Escenario 3: Techado + Quincho Tercer Tiempo & Energía Solar',
    description: 'Cancha techada + ampliación de quincho equipado para asados post-partido + 12 paneles solares fotovoltaicos para reducir a $0 el costo eléctrico de las luminarias LED.',
    distribution: {
      futbol7Count: 1,
      padelCount: 0,
      tenisCount: 0,
      usedAreaM2: 600,
      availableAreaM2: 600
    },
    capex: {
      groundPreparation: 2500000,
      courtsConstruction: 16500000,
      lightingAndIotSEC: 7200000, // Paneles solares On-Grid
      clubhouseAndCirculation: 9800000, // Quincho con parrilla y mesas
      totalCapex: 36000000
    },
    opexAnnual: {
      electricityAndMaintenance: 1400000, // Ahorro masivo en luz
      saasSubscription: 840000,
      insuranceAndPermits: 1300000,
      marketing: 1000000,
      totalOpexAnnual: 4540000
    },
    financialOutputs: {
      annualGrossRevenue: 58200000, // Ingresos por babyfútbol + arriendo de quincho
      annualNetCashFlow: 53660000,
      waccPercentage: 11.5,
      van5YearsCLP: 154200000,
      tirPercentage: 86.8,
      paybackYears: 1.1,
      returnPerM2Annual: 97000
    }
  }
];

export const MOCK_ITIL_INCIDENTS: ITILIncident[] = [
  {
    id: 'inc-1',
    code: 'INC-2026-001',
    title: 'Discrepancia telemétrica CT en Reflector LED Torre 2',
    category: 'Electrical_SEC',
    severity: 'medium',
    status: 'investigating',
    slaTargetHours: 4,
    createdAt: '2026-10-05T18:10:00',
    courtName: 'Cancha Principal Babyfútbol',
    resolutionNotes: 'El sensor de corriente reporta 9.8A en vez de los 12.8A nominales. Revisión programada de contactor trifásico.'
  },
  {
    id: 'inc-2',
    code: 'INC-2026-002',
    title: 'Torniquete de acceso operó en modo Edge Autónomo por corte de señal 4G en Chillán',
    category: 'Offline_Edge',
    severity: 'low',
    status: 'resolved',
    slaTargetHours: 8,
    createdAt: '2026-10-05T12:04:00',
    resolvedAt: '2026-10-05T12:22:00',
    courtName: 'Torniquete Principal Acceso',
    resolutionNotes: 'El Gateway local en Chillán mantuvo validación de pases QR sin internet mediante HMAC en memoria caché.'
  }
];
