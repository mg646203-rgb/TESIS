# CanCha Smart-Complex 🎾⚽
> **Plataforma SaaS de Gestión Inteligente, Tarificación Dinámica y Automatización IoT para Complejos Multideportivos**  
> **Proyecto de Título — INACAP Sede Chillán (2026)**  
> **Carrera:** Ingeniería en Informática  
> **Autores:** Fabián Ortega, Marcelo Gutiérrez, Benjamín Escarez  
> **Zona de Estudio y Caso Piloto:** Región de Ñuble, Chile  
> **Demo en Vivo (GitHub Pages):** https://mg646203-rgb.github.io/TESIS/

---

## 1. Resumen Ejecutivo y Propuesta de Valor

En la Región de Ñuble, los operadores de complejos multideportivos enfrentan la ineficiencia en el uso del suelo ($m^2$), altos costos de personal presencial (OPEX) y tarifas estáticas que desaprovechan horarios peak o dejan canchas vacías en horarios diurnos.

**CanCha Smart-Complex** transforma recintos deportivos convencionales en infraestructuras autónomas e inteligentes bajo un modelo **B2B2C SaaS Multi-Tenant**:
1. **Gemelo Digital y Heatmap por $m^2$:** Visualización espacial del predio de 5.200 m² con métrica inmobiliaria **RevPASH/$m^2$** (Revenue Per Available Slot-Hour) para comparar la rentabilidad de reconversión de suelo (ej: 1 cancha de fútbol 7 vs. 4 de pádel).
2. **Yield Management Paramétrico:** Tarificación dinámica multivariable con resguardo ético (guardrails: techo anti-abuso y piso promocional) que pondera horario valle/peak, fin de semana, ocupación en tiempo real y clima de Chillán.
3. **Smart-Building IoT (Norma SEC NCh Elec. 4/2003):** Control de acceso por torniquetes QR y conmutación gradual de luminarias mediante contactores industriales y sensores CT de corriente.
4. **Resiliencia ITIL v4 y Edge Computing:** Tolerancia a fallos con modo autónomo en memoria local (Edge Cache) para operar sin internet ante caídas de 4G/fibra óptica en Ñuble.
5. **Evaluación Financiera Multiescenario:** Modelado cuantitativo a 5 años (VAN, TIR, WACC, Payback) con simulador interactivo *What-If*.

---

## 2. Los 4 Perfiles de Usuario (Multi-Rol)

La plataforma cuenta con un conmutador instantáneo de roles en la barra superior para demostraciones interactivas:
1. **Dueño o Corporación de Canchas (Owner):**
   - Panel de control de su recinto en Chillán.
   - Gemelo Digital interactivo con mapa de calor por metro cuadrado ($m^2$).
   - Calibrador de pesos del algoritmo de Yield Management.
   - Simulador Financiero multiescenario con cálculo dinámico de VAN, TIR y Payback.
2. **Jugador / Cliente Final (Player / Mobile Responsive):**
   - Catálogo interactivo de canchas y deportes (Pádel panorámico techado, Fútbol 7).
   - Cotizador en tiempo real con desglose transparente y badges explicativos ("Tarifa Valle -25%", "Alta Demanda Pádel", "Bono Clima Chillán").
   - Pasarela de pago simulada Webpay Plus Transbank.
   - Generación de **CanCha Pass Digital** con Código QR encriptado y temporizador de acceso.
3. **Funcionario Operativo en Terreno (Staff / Guardia / Canchero):**
   - Escáner y validador de Códigos QR con feedback visual y sonoro de apertura de torniquetes.
   - Consola de anulación manual (Manual Override) de luminarias con protección anti-chattering SEC.
   - Bitácora de incidencias operativas bajo metodología ITIL v4.
4. **Plataforma de Gestión (SuperAdmin SaaS / Equipo INACAP):**
   - Control de múltiples recintos (tenants) en Chillán, San Carlos y Bulnes.
   - Métricas de negocio: MRR (\$14.8M CLP), ARR (\$178M CLP) y volumen transaccional.
   - Monitoreo de microservicios cloud y cumplimiento de SLAs (Uptime 99.96%, Latencia IoT 380ms).
   - Log inmutable de auditoría con prevención de concurrencia y doble reserva (OWASP).

---

## 3. Instrucciones de Ejecución

### Prerrequisitos
- Node.js (v18+)
- npm

### Pasos
```bash
# 1. Instalar dependencias (ya instaladas en el entorno)
npm install

# 2. Iniciar servidor de desarrollo Vite
npm run dev

# 3. Compilar para producción
npm run build
```

Una vez iniciado, abre `http://localhost:5173` en tu navegador para interactuar con la plataforma.
