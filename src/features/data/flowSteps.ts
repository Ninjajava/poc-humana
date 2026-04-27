import type { FlowStep } from "../types";

export const flowSteps: FlowStep[] = [
  {
    id: "quote-target",
    number: "1",
    title: "Seleccionar a quién cotizar",
    description: "Define si la cotización será para una persona natural u otro perfil."
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
    description: "Registra beneficiarios asociados a la cotización."
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
    id: "login",
    number: "8.3 - 8.3.1",
    title: "Iniciar venta",
    description: "Autenticación con credenciales personales."
  },
  {
    id: "sales-stage",
    number: "Etapa de venta",
    title: "Etapa de venta",
    description: "Inicio formal del proceso comercial."
  }
];