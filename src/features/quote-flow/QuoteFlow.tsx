import { useMemo, useState } from "react";
import { Header } from "../../shared/components/Header";
import { ProgressStepper } from "../../shared/components/ProgressStepper";
import { useInteractionTracker } from "../../shared/tracking/useInteractionTracker";
import { flowSteps } from "../data/flowSteps";
import type { QuoteData } from "../types";
import {
  BeneficiariesScreen,
  HolderDataScreen,
  LoginScreen,
  PlansScreen,
  ProductsScreen,
  PromotionsScreen,
  QuoteTargetScreen,
  SalesStageScreen
} from "../screens/QuoteScreens";

const screens = [
  QuoteTargetScreen,
  HolderDataScreen,
  BeneficiariesScreen,
  ProductsScreen,
  PlansScreen,
  PromotionsScreen,
  LoginScreen,
  SalesStageScreen
];

export function QuoteFlow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quoteData, setQuoteData] = useState<QuoteData>({});

  const currentStep = flowSteps[currentIndex];
  const CurrentScreen = screens[currentIndex];

  const {
    events,
    track,
    trackScreenExit,
    clearEvents,
    exportEvents
  } = useInteractionTracker(currentStep.id);

  const updateData = (data: Partial<QuoteData>) => {
    setQuoteData((prev) => ({ ...prev, ...data }));
  };

  const onNext = () => {
    trackScreenExit("click_next");
    setCurrentIndex((prev) => Math.min(prev + 1, flowSteps.length - 1));
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
            <h1>Simulación de cotización Humana</h1>
            <p>
              Flujo navegable para medir interacción de pantallas antes de pasar
              a integración real con backend.
            </p>
          </div>
        </section>

        <ProgressStepper steps={flowSteps} currentIndex={currentIndex} />

        <div className="content-layout">
          <CurrentScreen
            data={quoteData}
            updateData={updateData}
            onNext={onNext}
            onBack={onBack}
            isFirst={currentIndex === 0}
            isLast={currentIndex === flowSteps.length - 1}
            track={track}
          />

          <aside className="metrics-panel">
            <h3>Métricas POC</h3>

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
              Limpiar métricas
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