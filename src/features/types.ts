export type FlowStepId =
  | "quote-target"
  | "holder-data"
  | "beneficiaries"
  | "products"
  | "plans"
  | "compare-plans"
  | "download-comparison"
  | "promotions"
  | "quote-send-login"
  | "quote-send-followup"
  | "login"
  | "sales-stage";

export interface FlowStep {
  id: FlowStepId;
  number: string;
  title: string;
  description: string;
}

export interface QuoteData {
  quoteTarget?: string;
  genero?: string;
  edad?: string;
  fullName?: string;
  provincia?: string;
  phone?: string;
  beneficiaryName?: string;
  selectedProduct?: string;
  selectedPlan?: string;
  selectedPromotion?: string;
  nextAction?: "sale" | "send-quote";
  followupChannel?: string;
}
