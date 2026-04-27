export function Header() {
  return (
    <header className="app-header">
      <div className="top-bar">
        <span>Oficinas</span>
        <span>|</span>
        <span>Servicio al cliente</span>
        <span>|</span>
        <span>Portal del Bróker</span>
      </div>

      <div className="brand-section">
        <div className="brand-logo">humana</div>
        <div className="brand-subtitle">Cobertura Médica Integral</div>
      </div>

      <nav className="main-nav">
        <span>Inicio</span>
        <span>Planes</span>
        <span>Medihumana</span>
        <span>Humana Contigo</span>
        <span>Red Humana</span>
        <span>Nosotros</span>
        <strong>Cotizar</strong>
      </nav>
    </header>
  );
}