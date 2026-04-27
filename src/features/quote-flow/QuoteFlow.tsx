import { useMemo, useState } from "react";
import { Header } from "../../shared/components/Header";
import { ProgressStepper } from "../../shared/components/ProgressStepper";
import { useInteractionTracker } from "../../shared/tracking/useInteractionTracker";
import { flowStepMap } from "../data/flowSteps";
import type { FlowStepId, QuoteData } from "../types";
import {
  BeneficiariesScreen,
  HolderDataScreen,
  LoginScreen,
  PlansScreen,
  ProductsScreen,
  PromotionsScreen,
  QuoteSendFollowupScreen,
  QuoteSendLoginScreen,
  QuoteTargetScreen,
  SalesStageScreen
} from "../screens/QuoteScreens";

interface ScreenProps {
  data: QuoteData;
  updateData: (data: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  track: (event: string, payload?: Record<string, unknown>) => void;
}

type ScreenComponent = (props: ScreenProps) => JSX.Element;

const sharedPath: FlowStepId[] = [
  "quote-target",
  "holder-data",
  "beneficiaries",
  "products",
  "plans",
  "promotions"
];

const sendQuotePath: FlowStepId[] = [
  ...sharedPath,
  "quote-send-login",
  "quote-send-followup"
];

const salePath: FlowStepId[] = [...sharedPath, "login", "sales-stage"];

const screensByStepId: Record<FlowStepId, ScreenComponent> = {
  "quote-target": QuoteTargetScreen,
  "holder-data": HolderDataScreen,
  beneficiaries: BeneficiariesScreen,
  products: ProductsScreen,
  plans: PlansScreen,
  promotions: PromotionsScreen,
  "quote-send-login": QuoteSendLoginScreen,
  "quote-send-followup": QuoteSendFollowupScreen,
  login: LoginScreen,
  "sales-stage": SalesStageScreen
};

export function QuoteFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quoteData, setQuoteData] = useState<QuoteData>({});

  const activePath = useMemo(
    () => (quoteData.nextAction === "send-quote" ? sendQuotePath : salePath),
    [quoteData.nextAction]
  );

  const activeSteps = useMemo(
    () => activePath.map((stepId) => flowStepMap[stepId]),
    [activePath]
  );

  const safeIndex = Math.min(currentIndex, activeSteps.length - 1);
  const currentStep = activeSteps[safeIndex];
  const CurrentScreen = screensByStepId[currentStep.id];

  const { events, track, trackScreenExit, clearEvents, exportEvents } =
    useInteractionTracker(currentStep.id);

  const updateData = (data: Partial<QuoteData>) => {
    setQuoteData((prev) => ({ ...prev, ...data }));
  };

  const onNext = () => {
    trackScreenExit("click_next");
    setCurrentIndex((prev) => Math.min(prev + 1, activeSteps.length - 1));
  };

  const onBack = () => {
    trackScreenExit("click_back");
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const totalElapsedSeconds = useMemo(() => {
    const elapsed = events
      .filter((event) => typeof event.elapsedMs === "number")
      .reduce((acc, event) => acc + Number(event.elapsedMs), 0);

    return Math.round(elapsed / 1000);
  }, [events]);

  return (
    <div className="app">
      <Header />

      <main className="main-layout">
        <section className="hero">
          <div>
            <span className="hero-chip">POC flujo comercial</span>
            <h1>Simulacion de cotizacion Humana</h1>
            <p>
              Flujo navegable para medir interaccion de pantallas antes de pasar
              a integracion real con backend.
            </p>
          </div>
        </section>

        <ProgressStepper steps={activeSteps} currentIndex={safeIndex} />

        <div className="content-layout">
          <CurrentScreen
            data={quoteData}
            updateData={updateData}
            onNext={onNext}
            onBack={onBack}
            isFirst={safeIndex === 0}
            isLast={safeIndex === activeSteps.length - 1}
            track={track}
          />

          <aside className="metrics-panel">
            <h3>Metricas POC</h3>

            <div className="metric">
              <span>Pantalla actual</span>
              <strong>{currentStep.number}</strong>
            </div>

            <div className="metric">
              <span>Eventos registrados</span>
              <strong>{events.length}</strong>
            </div>

            <div className="metric">
              <span>Tiempo medido</span>
              <strong>{totalElapsedSeconds}s</strong>
            </div>

            <button className="btn-secondary full" onClick={exportEvents}>
              Exportar JSON
            </button>

            <button className="btn-danger full" onClick={clearEvents}>
              Limpiar metricas
            </button>

            <div className="event-list">
              {events.slice(-5).map((event) => (
                <div key={event.id} className="event-item">
                  <strong>{event.event}</strong>
                  <span>{event.stepId}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
