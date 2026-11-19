-- ==============================================================================
-- CANCHA SMART-COMPLEX (INACAP Sede Chillán 2026)
-- Esquema de Base de Datos para Supabase (PostgreSQL 15+)
-- Proyecto: CanCha Smart-Complex - Gestión, Yield Management & IoT SEC NCh 4/2003
-- Autores: Fabián Ortega, Marcelo Gutiérrez, Benjamín Escarez
-- ==============================================================================

-- Habilitar extensión pgcrypto / uuid-ossp
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. TIPOS ENUMERADOS (ENUMS)
-- ==============================================================================

DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('owner', 'player', 'staff', 'superadmin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sport_type AS ENUM ('babyfutbol', 'padel', 'futbol7', 'tenis');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE court_status AS ENUM ('available', 'occupied', 'maintenance', 'reserved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE reservation_status AS ENUM ('confirmed', 'active', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payment_method AS ENUM ('webpay_plus', 'transfer', 'counter_cash');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_category AS ENUM ('IoT_Relay', 'QR_Access', 'Payment_Gateway', 'Electrical_SEC', 'Offline_Edge');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_severity AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 2. TABLA DE PERFILES DE USUARIO (Vinculada a auth.users de Supabase)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    rut TEXT,
    role user_role NOT NULL DEFAULT 'player',
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 3. TABLA DE COMPLEJOS DEPORTIVOS (TENANTS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.complexes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    corporate_name TEXT,
    rut TEXT,
    commune TEXT NOT NULL DEFAULT 'Chillán',
    address TEXT NOT NULL,
    total_land_area_m2 NUMERIC(10, 2) NOT NULL DEFAULT 1200.00,
    usable_sport_area_m2 NUMERIC(10, 2) NOT NULL DEFAULT 600.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 4. CONFIGURACIÓN DE YIELD MANAGEMENT (TARIFICACIÓN DINÁMICA)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.yield_configs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complex_id UUID NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE UNIQUE,
    enabled BOOLEAN NOT NULL DEFAULT true,
    weight_time_slot NUMERIC(3, 2) NOT NULL DEFAULT 0.85,
    weight_weekend NUMERIC(3, 2) NOT NULL DEFAULT 0.70,
    weight_realtime_occupancy NUMERIC(3, 2) NOT NULL DEFAULT 0.90,
    weight_weather_nuble NUMERIC(3, 2) NOT NULL DEFAULT 0.60,
    max_price_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 1.30,
    min_price_multiplier NUMERIC(3, 2) NOT NULL DEFAULT 0.75,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 5. TABLA DE CANCHAS (COURTS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.courts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complex_id UUID NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    sport sport_type NOT NULL DEFAULT 'babyfutbol',
    surface_area_m2 NUMERIC(10, 2) NOT NULL DEFAULT 600.00,
    surface_type TEXT NOT NULL DEFAULT 'Pasto sintético FIFA Quality 50mm con caucho criogénico',
    indoor BOOLEAN NOT NULL DEFAULT false,
    base_price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 28000.00,
    status court_status NOT NULL DEFAULT 'available',
    current_reservation_id UUID,
    coordinates JSONB DEFAULT '{"x": 20, "y": 15, "w": 60, "h": 70}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 6. TELEMETRÍA Y DISPOSITIVOS SMART-BUILDING IOT (NORMA SEC NCh Elec 4/2003)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.iot_devices (
    device_id TEXT PRIMARY KEY, -- ej: 'ESP32-BABY1-SEC01'
    court_id UUID REFERENCES public.courts(id) ON DELETE CASCADE UNIQUE,
    relay_state BOOLEAN NOT NULL DEFAULT false,
    contactor_engaged BOOLEAN NOT NULL DEFAULT false,
    turnstile_unlocked BOOLEAN NOT NULL DEFAULT false,
    current_amperes NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    active_power_kw NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    energy_consumed_kwh NUMERIC(8, 2) NOT NULL DEFAULT 0.00,
    ambient_temp_c NUMERIC(5, 2) NOT NULL DEFAULT 20.00,
    firmware_version TEXT NOT NULL DEFAULT 'v2.4.1-SEC-NCh4',
    is_edge_autonomous BOOLEAN NOT NULL DEFAULT true,
    last_heartbeat TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 7. TABLA DE RESERVAS (RESERVATIONS)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    court_id UUID NOT NULL REFERENCES public.courts(id) ON DELETE RESTRICT,
    complex_id UUID NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE,
    player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    player_name TEXT NOT NULL,
    player_email TEXT NOT NULL,
    player_phone TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    time_slot TEXT NOT NULL, -- ej: '20:00 - 21:00'
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 28000.00,
    final_price NUMERIC(10, 2) NOT NULL DEFAULT 28000.00,
    status reservation_status NOT NULL DEFAULT 'confirmed',
    paid BOOLEAN NOT NULL DEFAULT false,
    payment_method payment_method NOT NULL DEFAULT 'webpay_plus',
    qr_access_code TEXT NOT NULL UNIQUE,
    qr_valid_from TIMESTAMPTZ NOT NULL,
    qr_valid_until TIMESTAMPTZ NOT NULL,
    lights_auto_engaged BOOLEAN NOT NULL DEFAULT false,
    turnstile_passed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Vincular foreign key de current_reservation_id en courts
ALTER TABLE public.courts 
    DROP CONSTRAINT IF EXISTS fk_courts_current_reservation;

ALTER TABLE public.courts 
    ADD CONSTRAINT fk_courts_current_reservation 
    FOREIGN KEY (current_reservation_id) REFERENCES public.reservations(id) ON DELETE SET NULL;

-- ==============================================================================
-- 8. INCIDENCIAS OPERATIVAS Y BITÁCORA ITIL v4
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.itil_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE, -- ej: 'INC-2026-001'
    complex_id UUID NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE,
    court_id UUID REFERENCES public.courts(id) ON DELETE SET NULL,
    court_name TEXT,
    title TEXT NOT NULL,
    category incident_category NOT NULL,
    severity incident_severity NOT NULL DEFAULT 'medium',
    status incident_status NOT NULL DEFAULT 'open',
    sla_target_hours INTEGER NOT NULL DEFAULT 4,
    resolution_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 9. ESCENARIOS FINANCIEROS Y SIMULADOR DE CAPEX/OPEX
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.financial_scenarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complex_id UUID NOT NULL REFERENCES public.complexes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    distribution JSONB NOT NULL DEFAULT '{}'::jsonb,
    capex JSONB NOT NULL DEFAULT '{}'::jsonb,
    opex_annual JSONB NOT NULL DEFAULT '{}'::jsonb,
    financial_outputs JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 10. CLIMA HISTÓRICO Y REGISTROS DE TELEMETRÍA AMBIENTAL (CHILLÁN)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.weather_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city TEXT NOT NULL DEFAULT 'Chillán (Región de Ñuble)',
    temperature_c NUMERIC(4, 1) NOT NULL,
    condition TEXT NOT NULL,
    precipitation_probability INTEGER NOT NULL DEFAULT 0,
    description TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- 11. ÍNDICES DE RENDIMIENTO (PERFORMANCE INDEXES)
-- ==============================================================================

CREATE INDEX IF NOT EXISTS idx_reservations_court_date ON public.reservations (court_id, reservation_date);
CREATE INDEX IF NOT EXISTS idx_reservations_qr_code ON public.reservations (qr_access_code);
CREATE INDEX IF NOT EXISTS idx_reservations_player_id ON public.reservations (player_id);
CREATE INDEX IF NOT EXISTS idx_courts_complex_id ON public.courts (complex_id);
CREATE INDEX IF NOT EXISTS idx_itil_incidents_status ON public.itil_incidents (status);
CREATE INDEX IF NOT EXISTS idx_iot_devices_court_id ON public.iot_devices (court_id);

-- ==============================================================================
-- 12. TRIGGERS PARA ACTUALIZACIÓN AUTOMÁTICA DE `updated_at`
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_profiles_updated_at ON public.profiles;
CREATE TRIGGER tr_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_complexes_updated_at ON public.complexes;
CREATE TRIGGER tr_complexes_updated_at BEFORE UPDATE ON public.complexes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_courts_updated_at ON public.courts;
CREATE TRIGGER tr_courts_updated_at BEFORE UPDATE ON public.courts FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_reservations_updated_at ON public.reservations;
CREATE TRIGGER tr_reservations_updated_at BEFORE UPDATE ON public.reservations FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_iot_devices_updated_at ON public.iot_devices;
CREATE TRIGGER tr_iot_devices_updated_at BEFORE UPDATE ON public.iot_devices FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS tr_itil_incidents_updated_at ON public.itil_incidents;
CREATE TRIGGER tr_itil_incidents_updated_at BEFORE UPDATE ON public.itil_incidents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- 13. TRIGGER PARA SINCRONIZACIÓN AUTOMÁTICA CON AUTH.USERS
-- (Crea un perfil público automáticamente cuando alguien se registra en Supabase Auth)
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'player')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 14. POLÍTICAS DE SEGURIDAD A NIVEL DE FILA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complexes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.yield_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itil_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_logs ENABLE ROW LEVEL SECURITY;

-- 14.1. Perfiles: Los usuarios pueden ver todos los perfiles y editar el suyo propio
CREATE POLICY "Perfiles visibles por usuarios autenticados" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuarios pueden actualizar su propio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 14.2. Complejos y Canchas: Lectura pública (para catálogo de clientes)
CREATE POLICY "Complejos visibles públicamente" ON public.complexes FOR SELECT USING (true);
CREATE POLICY "Canchas visibles públicamente" ON public.courts FOR SELECT USING (true);
CREATE POLICY "Configuración de Yield visible públicamente" ON public.yield_configs FOR SELECT USING (true);

-- Edición de complejos/canchas solo por dueños o administradores
CREATE POLICY "Dueños administran sus complejos" ON public.complexes FOR ALL USING (auth.uid() = owner_id);
CREATE POLICY "Dueños configuran Yield" ON public.yield_configs FOR ALL USING (
    EXISTS (SELECT 1 FROM public.complexes WHERE id = yield_configs.complex_id AND owner_id = auth.uid())
);

-- 14.3. Reservas:
-- Clientes pueden ver sus propias reservas; Dueños y Staff ven las del complejo
CREATE POLICY "Lectura de reservas por dueño o cliente" ON public.reservations FOR SELECT USING (
    auth.uid() = player_id 
    OR EXISTS (SELECT 1 FROM public.complexes c WHERE c.id = reservations.complex_id AND c.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('staff', 'superadmin'))
    OR auth.role() = 'anon' -- Permite ver disponibilidad horaria anónimamente
);

CREATE POLICY "Inserción de reservas permitida" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Actualización de reservas por dueño o staff" ON public.reservations FOR UPDATE USING (
    auth.uid() = player_id 
    OR EXISTS (SELECT 1 FROM public.complexes c WHERE c.id = reservations.complex_id AND c.owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.role IN ('staff', 'superadmin'))
);

-- 14.4. Telemetría IoT y Dispositivos:
CREATE POLICY "Lectura IoT para monitoreo" ON public.iot_devices FOR SELECT USING (true);
CREATE POLICY "Actualización IoT por Staff o Dueño" ON public.iot_devices FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'staff', 'superadmin'))
);

-- 14.5. Incidencias ITIL:
CREATE POLICY "Lectura de incidencias por personal autorizado" ON public.itil_incidents FOR SELECT USING (true);
CREATE POLICY "Gestión de incidencias ITIL por staff y dueño" ON public.itil_incidents FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('owner', 'staff', 'superadmin'))
);

-- 14.6. Escenarios Financieros:
CREATE POLICY "Lectura y edición de escenarios financieros por dueños" ON public.financial_scenarios FOR ALL USING (
    EXISTS (SELECT 1 FROM public.complexes WHERE id = financial_scenarios.complex_id AND owner_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'superadmin')
);

-- 14.7. Clima: Lectura abierta
CREATE POLICY "Lectura pública de clima" ON public.weather_logs FOR SELECT USING (true);

-- ==============================================================================
-- 15. DATOS SEMILLA DE PRUEBA (SEED DATA - CASO PILOTO CHILLÁN)
-- ==============================================================================

DO $$
DECLARE
    v_complex_id UUID := 'c0000000-0000-0000-0000-000000000001';
    v_court_id   UUID := 'c0000000-0000-0000-0000-000000000002';
    v_res1_id    UUID := 'c0000000-0000-0000-0000-000000000003';
    v_res2_id    UUID := 'c0000000-0000-0000-0000-000000000004';
    v_res3_id    UUID := 'c0000000-0000-0000-0000-000000000005';
BEGIN
    -- Complejo Deportivo Chillán
    INSERT INTO public.complexes (id, name, corporate_name, rut, commune, address, total_land_area_m2, usable_sport_area_m2)
    VALUES (
        v_complex_id,
        'Cancha de Babyfútbol Chillán',
        'Babyfútbol & Deportes Don Marcelo',
        '18.452.930-1',
        'Chillán',
        'Av. Vicente Méndez 1420, Chillán (Sector Los Volcanes)',
        1200.00,
        600.00
    ) ON CONFLICT (id) DO NOTHING;

    -- Configuración de Yield Management
    INSERT INTO public.yield_configs (complex_id, enabled, weight_time_slot, weight_weekend, weight_realtime_occupancy, weight_weather_nuble, max_price_multiplier, min_price_multiplier)
    VALUES (
        v_complex_id,
        true,
        0.85,
        0.70,
        0.90,
        0.60,
        1.30,
        0.75
    ) ON CONFLICT (complex_id) DO NOTHING;

    -- Cancha Principal de Babyfútbol
    INSERT INTO public.courts (id, complex_id, name, sport, surface_area_m2, surface_type, indoor, base_price_per_hour, status, coordinates)
    VALUES (
        v_court_id,
        v_complex_id,
        'Cancha Principal de Babyfútbol (5 vs 5)',
        'babyfutbol',
        600.00,
        'Pasto sintético FIFA Quality 50mm con caucho criogénico + 4 Torres LED 8x200W',
        false,
        28000.00,
        'occupied',
        '{"x": 20, "y": 15, "w": 60, "h": 70}'::jsonb
    ) ON CONFLICT (id) DO NOTHING;

    -- Dispositivo IoT SEC NCh 4/2003
    INSERT INTO public.iot_devices (device_id, court_id, relay_state, contactor_engaged, turnstile_unlocked, current_amperes, active_power_kw, energy_consumed_kwh, ambient_temp_c, firmware_version, is_edge_autonomous)
    VALUES (
        'ESP32-BABY1-SEC01',
        v_court_id,
        true,
        true,
        true,
        12.80,
        2.85,
        4.60,
        23.40,
        'v2.4.1-SEC-NCh4',
        true
    ) ON CONFLICT (device_id) DO NOTHING;

    -- Reservas de Ejemplo
    INSERT INTO public.reservations (id, court_id, complex_id, player_name, player_email, player_phone, reservation_date, time_slot, base_price, final_price, status, paid, payment_method, qr_access_code, qr_valid_from, qr_valid_until, lights_auto_engaged, turnstile_passed)
    VALUES 
    (
        v_res1_id,
        v_court_id,
        v_complex_id,
        'Marcelo Gutiérrez',
        'marcelo.g@inacap.cl',
        '+56 9 8451 2230',
        CURRENT_DATE,
        '20:00 - 21:00',
        28000,
        33600,
        'active',
        true,
        'webpay_plus',
        'BABY-7789-SEC',
        now() - INTERVAL '15 minutes',
        now() + INTERVAL '1 hour 15 minutes',
        true,
        true
    ),
    (
        v_res2_id,
        v_court_id,
        v_complex_id,
        'Fabián Ortega (Equipo Los Galácticos)',
        'fabian.ortega@inacapmail.cl',
        '+56 9 7612 9904',
        CURRENT_DATE,
        '21:00 - 22:00',
        28000,
        35000,
        'confirmed',
        true,
        'webpay_plus',
        'BABY-9921-SEC',
        now() + INTERVAL '45 minutes',
        now() + INTERVAL '2 hours 15 minutes',
        false,
        false
    ),
    (
        v_res3_id,
        v_court_id,
        v_complex_id,
        'Benjamín Escarez (Tercer Tiempo FC)',
        'benjamin.escarez@inacapmail.cl',
        '+56 9 9341 5567',
        CURRENT_DATE,
        '22:00 - 23:00',
        28000,
        32200,
        'confirmed',
        true,
        'webpay_plus',
        'BABY-4402-SEC',
        now() + INTERVAL '1 hour 45 minutes',
        now() + INTERVAL '3 hours 15 minutes',
        false,
        false
    ) ON CONFLICT (id) DO NOTHING;

    -- Actualizar cancha con la reserva activa
    UPDATE public.courts SET current_reservation_id = v_res1_id WHERE id = v_court_id;

    -- Incidencias ITIL
    INSERT INTO public.itil_incidents (code, complex_id, court_id, court_name, title, category, severity, status, sla_target_hours, resolution_notes)
    VALUES 
    (
        'INC-2026-001',
        v_complex_id,
        v_court_id,
        'Cancha Principal Babyfútbol',
        'Discrepancia telemétrica CT en Reflector LED Torre 2',
        'Electrical_SEC',
        'medium',
        'investigating',
        4,
        'El sensor de corriente reporta 9.8A en vez de los 12.8A nominales. Revisión programada de contactor trifásico.'
    ),
    (
        'INC-2026-002',
        v_complex_id,
        v_court_id,
        'Torniquete Principal Acceso',
        'Torniquete de acceso operó en modo Edge Autónomo por corte de señal 4G en Chillán',
        'Offline_Edge',
        'low',
        'resolved',
        8,
        'El Gateway local en Chillán mantuvo validación de pases QR sin internet mediante HMAC en memoria caché.'
    ) ON CONFLICT (code) DO NOTHING;

    -- Registro inicial de clima
    INSERT INTO public.weather_logs (city, temperature_c, condition, precipitation_probability, description)
    VALUES (
        'Chillán (Región de Ñuble)',
        17.0,
        'nublado',
        20,
        'Cielo nuboso templado en Chillán. Condiciones ideales para partido de babyfútbol nocturno.'
    );

END $$;
