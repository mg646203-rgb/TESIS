import { YieldRuleConfig, WeatherCondition, PriceBreakdown } from '../types';

export function calculateDynamicPrice(
  basePrice: number,
  timeSlot: string,        // ej: "19:00 - 20:00" o "10:00 - 11:00"
  dateStr: string,         // "YYYY-MM-DD"
  currentOccupancyRatio: number, // 0.0 a 1.0 (ej: 0.75 para 75% ocupación)
  weather: WeatherCondition,
  config: YieldRuleConfig
): PriceBreakdown {
  if (!config.enabled) {
    return {
      basePrice,
      timeSlotFactor: 0,
      weekendFactor: 0,
      occupancyFactor: 0,
      weatherFactor: 0,
      surgeMultiplier: 1.0,
      finalPrice: basePrice,
      explanationBadges: [{ label: 'Tarifa Fija Estándar', type: 'neutral', value: '$0' }]
    };
  }

  // 1. Factor de Franja Horaria (Peak vs Valle)
  // Horario Valle: 08:00 a 17:00 (lunes a viernes) -> -20% a -25%
  // Horario Regular: 17:00 a 19:00 -> 0%
  // Horario Prime/Peak: 19:00 a 23:00 -> +25% a +35%
  const startHour = parseInt(timeSlot.split(':')[0], 10) || 19;
  let rawTimeFactor = 0;
  let timeLabel = 'Horario Normal';

  if (startHour >= 8 && startHour < 17) {
    rawTimeFactor = -0.25; // -25% en valle diurno
    timeLabel = 'Horario Valle Diurno';
  } else if (startHour >= 19 && startHour <= 22) {
    rawTimeFactor = 0.30;  // +30% en horarios peak nocturno
    timeLabel = 'Horario Peak Nocturno';
  } else {
    rawTimeFactor = 0.05;  // +5% transición
    timeLabel = 'Horario Regular';
  }

  // 2. Factor Fin de Semana / Viernes Noche
  const dateObj = new Date(dateStr + 'T12:00:00');
  const dayOfWeek = dateObj.getDay(); // 0 = Domingo, 5 = Viernes, 6 = Sábado
  let rawWeekendFactor = 0;
  let weekendLabel = 'Día de Semana';

  if (dayOfWeek === 6 || dayOfWeek === 0) {
    rawWeekendFactor = 0.15; // +15% fines de semana
    weekendLabel = 'Fin de Semana';
  } else if (dayOfWeek === 5 && startHour >= 18) {
    rawWeekendFactor = 0.20; // +20% Viernes tarde/noche
    weekendLabel = 'Viernes Prime';
  }

  // 3. Factor de Ocupación en Tiempo Real (Curva de Llenado)
  let rawOccupancyFactor = 0;
  let occupancyLabel = 'Demanda Moderada';

  if (currentOccupancyRatio >= 0.85) {
    rawOccupancyFactor = 0.25; // Complejo casi lleno: incentivo de reserva temprana
    occupancyLabel = 'Alta Ocupación (>85%)';
  } else if (currentOccupancyRatio >= 0.60) {
    rawOccupancyFactor = 0.10;
    occupancyLabel = 'Ocupación Media (60-85%)';
  } else if (currentOccupancyRatio < 0.40) {
    rawOccupancyFactor = -0.15; // Complejo con baja ocupación: descuento de última hora
    occupancyLabel = 'Baja Ocupación (<40%)';
  }

  // 4. Factor Climático Ñuble (Lluvia o Frío Extremo)
  let rawWeatherFactor = 0;
  let weatherLabel = 'Clima Templado Ñuble';

  if (weather.condition === 'lluvia_fuerte' || weather.condition === 'lluvia_ligera') {
    // Si llueve, canchas exteriores tienen descuento agresivo para incentivar uso
    rawWeatherFactor = -0.20;
    weatherLabel = 'Bono Clima Lluvioso Chillán';
  } else if (weather.temperatureC < 8) {
    rawWeatherFactor = -0.10;
    weatherLabel = 'Bono Invierno / Baja Temp';
  }

  // Ponderación según la configuración del Dueño del Complejo
  const weightedTime = rawTimeFactor * config.weightTimeSlot;
  const weightedWeekend = rawWeekendFactor * config.weightWeekend;
  const weightedOccupancy = rawOccupancyFactor * config.weightRealtimeOccupancy;
  const weightedWeather = rawWeatherFactor * config.weightWeatherÑuble;

  // Multiplicador compuesto acumulado
  let totalMultiplier = 1.0 + (weightedTime + weightedWeekend + weightedOccupancy + weightedWeather);

  // Aplicar Guardrails / Techos y Pisos de Protección
  totalMultiplier = Math.max(config.minPriceMultiplier, Math.min(config.maxPriceMultiplier, totalMultiplier));

  // Redondeo comercial chileno a cientos de pesos (ej: $18.500)
  const calculatedPrice = Math.round((basePrice * totalMultiplier) / 100) * 100;

  // Construcción de badges explicativos para el deportista
  const badges: PriceBreakdown['explanationBadges'] = [];

  if (rawTimeFactor > 0) {
    badges.push({ label: `${timeLabel} (+${Math.round(weightedTime * 100)}%)`, type: 'peak', value: `+$${Math.round(basePrice * weightedTime)}` });
  } else if (rawTimeFactor < 0) {
    badges.push({ label: `${timeLabel} (${Math.round(weightedTime * 100)}%)`, type: 'discount', value: `-$${Math.abs(Math.round(basePrice * weightedTime))}` });
  }

  if (rawWeekendFactor > 0) {
    badges.push({ label: `${weekendLabel} (+${Math.round(weightedWeekend * 100)}%)`, type: 'peak', value: `+$${Math.round(basePrice * weightedWeekend)}` });
  }

  if (rawOccupancyFactor > 0) {
    badges.push({ label: `${occupancyLabel} (+${Math.round(weightedOccupancy * 100)}%)`, type: 'peak', value: `+$${Math.round(basePrice * weightedOccupancy)}` });
  } else if (rawOccupancyFactor < 0) {
    badges.push({ label: `${occupancyLabel} (${Math.round(weightedOccupancy * 100)}%)`, type: 'discount', value: `-$${Math.abs(Math.round(basePrice * weightedOccupancy))}` });
  }

  if (rawWeatherFactor < 0) {
    badges.push({ label: `${weatherLabel} (${Math.round(weightedWeather * 100)}%)`, type: 'discount', value: `-$${Math.abs(Math.round(basePrice * weightedWeather))}` });
  }

  if (badges.length === 0) {
    badges.push({ label: 'Tarifa Estándar Calibrada', type: 'neutral', value: '$0' });
  }

  return {
    basePrice,
    timeSlotFactor: weightedTime,
    weekendFactor: weightedWeekend,
    occupancyFactor: weightedOccupancy,
    weatherFactor: weightedWeather,
    surgeMultiplier: Number(totalMultiplier.toFixed(2)),
    finalPrice: calculatedPrice,
    explanationBadges: badges
  };
}
