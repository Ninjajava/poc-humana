export type FlowStepId =
  | "quote-target"
  | "holder-data"
  | "beneficiaries"
  | "products"
  | "plans"
  | "compare-plans"
  | "download-comparison"
  | "promotions"
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
  documentType?: string;
  documentNumber?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  beneficiaryName?: string;
  selectedProduct?: string;
  selectedPlan?: string;
  selectedPromotion?: string;
  wantsToCompare?: boolean;
  plansToCompare?: string[];
}