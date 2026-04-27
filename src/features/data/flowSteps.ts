import type { FlowStep, FlowStepId } from "../types";

export const flowSteps: FlowStep[] = [
  {
    id: "quote-target",
    number: "1",
    title: "Seleccionar a quien cotizar",
    description: "Define si la cotizacion sera para una persona natural u otro perfil."
  },
  {
    id: "holder-data",
    number: "2",
    title: "Datos del asegurado titular",
    description: "Captura los datos principales del titular."
  },
  {
    id: "beneficiaries",
    number: "2.1",
    title: "Datos de beneficiarios",
    description: "Registra beneficiarios asociados a la cotizacion."
  },
  {
    id: "products",
    number: "3 - 4",
    title: "Productos disponibles",
    description: "Visualiza y selecciona el producto a cotizar."
  },
  {
    id: "plans",
    number: "5 - 6",
    title: "Planes y beneficios",
    description: "Consulta planes, tarifas y beneficios disponibles."
  },
  {
    id: "promotions",
    number: "8",
    title: "Promociones y resumen",
    description: "Visualiza promociones aplicables antes de iniciar venta."
  },
  {
    id: "quote-send-login",
    number: "8.2",
    title: "Iniciar sesion para enviar cotizacion",
    description: "Autenticacion con credenciales para enviar cotizacion."
  },
  {
    id: "quote-send-followup",
    number: "8.2.1",
    title: "Enviar cotizacion y dar seguimiento",
    description: "Envio al cliente y registro de seguimiento comercial."
  },
  {
    id: "login",
    number: "8.3 - 8.3.1",
    title: "Iniciar venta",
    description: "Autenticacion con credenciales personales."
  },
  {
    id: "sales-stage",
    number: "Etapa de venta",
    title: "Etapa de venta",
    description: "Inicio formal del proceso comercial."
  }
];

export const flowStepMap = Object.fromEntries(
  flowSteps.map((step) => [step.id, step])
) as Record<FlowStepId, FlowStep>;
