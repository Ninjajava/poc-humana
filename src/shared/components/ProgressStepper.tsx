import type{ FlowStep } from "../../features/types";

interface Props {
  steps: FlowStep[];
  currentIndex: number;
}

export function ProgressStepper({ steps, currentIndex }: Props) {
  return (
    <div className="stepper">
      {steps.map((step, index) => {
        const isActive = index === currentIndex;
        const isDone = index < currentIndex;

        return (
          <div
            key={step.id}
            className={`stepper-item ${isActive ? "active" : ""} ${
              isDone ? "done" : ""
            }`}
          >
            <div className="stepper-number">{step.number}</div>
            <div className="stepper-title">{step.title}</div>
          </div>
        );
      })}
    </div>
  );
}