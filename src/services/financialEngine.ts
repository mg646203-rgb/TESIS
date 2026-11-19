export interface CashFlowYear {
  year: number;
  grossRevenue: number;
  opex: number;
  netCashFlow: number;
  discountedCashFlow: number;
  cumulativeCashFlow: number;
}

export interface ScenarioCalculationResult {
  capexTotal: number;
  annualGrossRevenue: number;
  annualOpex: number;
  annualNetCashFlow: number;
  cashFlows5Years: CashFlowYear[];
  vanCLP: number;
  tirPercentage: number;
  paybackYears: number;
  returnPerM2Annual: number;
}

/**
 * Calcula el VAN (Valor Actual Neto) de un flujo de caja con una tasa de descuento (WACC).
 */
export function calculateVAN(capex: number, cashFlows: number[], waccRate: number): number {
  let van = -capex;
  for (let t = 0; t < cashFlows.length; t++) {
    van += cashFlows[t] / Math.pow(1 + waccRate, t + 1);
  }
  return Math.round(van);
}

/**
 * Calcula la TIR numéricamente mediante aproximación de Bisección.
 */
export function calculateTIR(capex: number, cashFlows: number[]): number {
  let lowRate = 0.001;
  let highRate = 2.0; // 200%
  let midRate = 0.1;
  const maxIterations = 100;
  const tolerance = 0.0001;

  for (let i = 0; i < maxIterations; i++) {
    midRate = (lowRate + highRate) / 2;
    const vanMid = calculateVAN(capex, cashFlows, midRate);

    if (Math.abs(vanMid) < tolerance) {
      break;
    }

    const vanLow = calculateVAN(capex, cashFlows, lowRate);
    if ((vanLow > 0 && vanMid > 0) || (vanLow < 0 && vanMid < 0)) {
      lowRate = midRate;
    } else {
      highRate = midRate;
    }
  }

  return Number((midRate * 100).toFixed(1));
}

/**
 * Modela un escenario personalizado de distribución de canchas de fútbol vs pádel vs tenis.
 */
export function simulateCustomScenario(
  futbol7Count: number,
  padelCount: number,
  tenisCount: number,
  waccPercentage: number = 11.5,
  yieldOptimizationBonusPercent: number = 15 // Incremento por yield management y automatización IoT
): ScenarioCalculationResult {
  // Dimensiones físicas reglamentarias
  const futbolArea = 1400; // m2 con contracanchas
  const padelArea = 200;   // m2 con circulaciones
  const tenisArea = 650;   // m2 con contracanchas

  const totalUsedSportM2 = (futbol7Count * futbolArea) + (padelCount * padelArea) + (tenisCount * tenisArea);

  // Estimación de CAPEX por tipo de cancha (valores reales mercado Chile 2026)
  // Cancha Fútbol 7 césped sintético FIFA: ~$24.000.000
  // Cancha Pádel Panorámica techada con vidrio templado: ~$21.500.000
  // Cancha Tenis superficie rápida/arcilla: ~$16.000.000
  // IoT & SEC (Relés, canalizaciones, tableros SEC NCh4, torniquetes QR): ~$3.500.000 por cancha
  const capexCourts = (futbol7Count * 24000000) + (padelCount * 21500000) + (tenisCount * 16000000);
  const capexIoT = (futbol7Count + padelCount + tenisCount) * 3500000;
  const capexGroundAndClub = 32000000; // Movimiento tierra, drenajes, camarines y club house
  const capexTotal = capexCourts + capexIoT + capexGroundAndClub;

  // Supuestos de horas de uso y tarifas en Chillán
  // Fútbol 7: $36.000/hr, 4.5 hrs prom/día x 330 días = ~$53.460.000 año por cancha
  // Pádel: $18.000/hr, 5.5 hrs prom/día x 340 días = ~$33.660.000 año por cancha
  // Tenis: $14.000/hr, 3.5 hrs prom/día x 320 días = ~$15.680.000 año por cancha
  let annualGrossRevenue = (futbol7Count * 53460000) + (padelCount * 33660000) + (tenisCount * 15680000);

  // Beneficio del Algoritmo Yield Management y Ahorro Eléctrico IoT
  annualGrossRevenue = annualGrossRevenue * (1 + (yieldOptimizationBonusPercent / 100));

  // Estimación OPEX Anual (Mantenimiento, SaaS CanCha, seguros, alumbrado automatizado)
  // CanCha ahorra ~35% de consumo eléctrico apagando luminarias automáticamente
  const opexPerCourt = 2100000;
  const totalCourts = futbol7Count + padelCount + tenisCount;
  const annualOpex = 7500000 + (totalCourts * opexPerCourt);

  const annualNetCashFlow = annualGrossRevenue - annualOpex;
  const waccRate = waccPercentage / 100;

  // Flujos proyectados a 5 años (con ligero crecimiento anual del 3% por consolidación de clientes)
  const cashFlows: number[] = [];
  const cashFlows5Years: CashFlowYear[] = [];
  let cumulative = -capexTotal;

  for (let year = 1; year <= 5; year++) {
    const growthFactor = Math.pow(1.03, year - 1);
    const revYear = annualGrossRevenue * growthFactor;
    const opexYear = annualOpex * Math.pow(1.02, year - 1); // Inflación OPEX 2%
    const netYear = revYear - opexYear;
    const discountedYear = netYear / Math.pow(1 + waccRate, year);
    cumulative += netYear;

    cashFlows.push(netYear);
    cashFlows5Years.push({
      year,
      grossRevenue: Math.round(revYear),
      opex: Math.round(opexYear),
      netCashFlow: Math.round(netYear),
      discountedCashFlow: Math.round(discountedYear),
      cumulativeCashFlow: Math.round(cumulative)
    });
  }

  const vanCLP = calculateVAN(capexTotal, cashFlows, waccRate);
  const tirPercentage = calculateTIR(capexTotal, cashFlows);

  // Payback period
  let paybackYears = 5.0;
  let runningCum = -capexTotal;
  for (let i = 0; i < cashFlows.length; i++) {
    const prevCum = runningCum;
    runningCum += cashFlows[i];
    if (runningCum >= 0) {
      const fraction = Math.abs(prevCum) / cashFlows[i];
      paybackYears = Number(((i) + fraction).toFixed(1));
      break;
    }
  }

  const returnPerM2Annual = totalUsedSportM2 > 0 ? Math.round(annualGrossRevenue / totalUsedSportM2) : 0;

  return {
    capexTotal,
    annualGrossRevenue: Math.round(annualGrossRevenue),
    annualOpex: Math.round(annualOpex),
    annualNetCashFlow: Math.round(annualNetCashFlow),
    cashFlows5Years,
    vanCLP,
    tirPercentage,
    paybackYears,
    returnPerM2Annual
  };
}
