import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  children: ReactNode;
}

export function ScreenShell({ title, description, children }: Props) {
  return (
    <section className="screen-card">
      <div className="screen-header">
        <span className="screen-badge">POC Cotización</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>

      <div className="screen-content">{children}</div>
    </section>
  );
}