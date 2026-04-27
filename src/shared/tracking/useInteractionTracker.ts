import { useCallback, useEffect, useRef, useState } from "react";

export interface InteractionEvent {
  id: string;
  event: string;
  stepId: string;
  timestamp: string;
  elapsedMs?: number;
  payload?: Record<string, unknown>;
}

const STORAGE_KEY = "humana-poc-interactions";

export function useInteractionTracker(currentStepId: string) {
  const [events, setEvents] = useState<InteractionEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const screenStartedAt = useRef(Date.now());

  const persist = (nextEvents: InteractionEvent[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextEvents));
  };

  const track = useCallback(
    (
      event: string,
      payload?: Record<string, unknown>,
      elapsedMs?: number
    ) => {
      const newEvent: InteractionEvent = {
        id: crypto.randomUUID(),
        event,
        stepId: currentStepId,
        timestamp: new Date().toISOString(),
        elapsedMs,
        payload
      };

      setEvents((prev) => {
        const next = [...prev, newEvent];
        persist(next);
        return next;
      });
    },
    [currentStepId]
  );

  useEffect(() => {
    screenStartedAt.current = Date.now();
    track("screen_view");
  }, [currentStepId, track]);

  const trackScreenExit = useCallback(
    (action: string) => {
      const elapsedMs = Date.now() - screenStartedAt.current;
      track(action, undefined, elapsedMs);
    },
    [track]
  );

  const clearEvents = () => {
    localStorage.removeItem(STORAGE_KEY);
    setEvents([]);
  };

  const exportEvents = () => {
    const blob = new Blob([JSON.stringify(events, null, 2)], {
      type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "humana-poc-interactions.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return {
    events,
    track,
    trackScreenExit,
    clearEvents,
    exportEvents
  };
}