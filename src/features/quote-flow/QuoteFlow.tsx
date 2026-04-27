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
  SalesStageScreen,
  ComparePlansScreen,      // Añadido
  DownloadComparisonScreen // Añadido
} from "../screens/QuoteScreens";

// El orden de los componentes debe coincidir exactamente con el de flowSteps.ts
const screens = [
  QuoteTargetScreen,        // Índice 0
  HolderDataScreen,         // Índice 1
  BeneficiariesScreen,      // Índice 2
  ProductsScreen,           // Índice 3
  PlansScreen,              // Índice 4
  ComparePlansScreen,       // Índice 5 (Nuevo 6.1)
  DownloadComparisonScreen, // Índice 6 (Nuevo 6.2 - Fin)
  PromotionsScreen,         // Índice 7 (Paso 8)
  LoginScreen,              // Índice 8
  SalesStageScreen          // Índice 9
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
    setCurrentIndex((prev) => {
      // BIFURCACIÓN: Si estamos en PlansScreen (índice 4) y el usuario NO quiere comparar
      // saltamos a PromotionsScreen (índice 7)
      if (prev === 4 && quoteData.wantsToCompare === false) {
        return 7; 
      }
      
      // FIN DE FLUJO: Si estamos en DownloadComparisonScreen (índice 6) o en la última pantalla, no avanzamos.
      if (prev === 6 || prev === screens.length - 1) {
        return prev;
      }
      
      // Flujo normal paso a paso
      return prev + 1;
    });
  };

  const onBack = () => {
    trackScreenExit("click_back");
    setCurrentIndex((prev) => {
      // BIFURCACIÓN INVERSA: Si estamos en PromotionsScreen (índice 7)
      // debemos retroceder a PlansScreen (índice 4) saltándonos las pantallas de comparativo
      if (prev === 7) {
        return 4;
      }
      
      // Flujo normal hacia atrás
      return Math.max(prev - 1, 0);
    });
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
            // En este diagrama, el paso 6.2 también es considerado un "Fin" del flujo
            isLast={currentIndex === screens.length - 1 || currentIndex === 6}
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