import type { QuoteData } from "../types";
import { ScreenShell } from "../../shared/components/ScreenShell";
import { availablePlans } from "../data/plansData";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ScreenProps {
  data: QuoteData;
  updateData: (data: Partial<QuoteData>) => void;
  onNext: () => void;
  onBack: () => void;
  isFirst: boolean;
  isLast: boolean;
  track: (event: string, payload?: Record<string, unknown>) => void;
}

function Actions({ onBack, onNext, isFirst, isLast }: ScreenProps) {
  return (
    <div className="actions">
      {!isFirst && (
        <button className="btn-secondary" onClick={onBack}>
          Atrás
        </button>
      )}

      {!isLast && (
        <button className="btn-primary" onClick={onNext}>
          Continuar
        </button>
      )}
    </div>
  );
}

export function QuoteTargetScreen(props: ScreenProps) {
  const { data, updateData, track } = props;

  const selectTarget = (quoteTarget: string) => {
    updateData({ quoteTarget });
    track("select_quote_target", { quoteTarget });
  };

  return (
    <ScreenShell
      title="Seleccionar a quién cotizar"
      description="Primer paso del flujo. Aquí se define el tipo de cotización."
    >
      <div className="option-grid">
        {["Para mí", "Para otra persona", "Grupo familiar"].map((item) => (
          <button
            key={item}
            className={`option-card ${data.quoteTarget === item ? "selected" : ""}`}
            onClick={() => selectTarget(item)}
          >
            <strong>{item}</strong>
            <span>Cotización médica integral</span>
          </button>
        ))}
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function HolderDataScreen(props: ScreenProps) {
  const { data, updateData } = props;

  return (
    <ScreenShell
      title="Datos del asegurado titular"
      description="Captura de datos básicos del titular de la cotización."
    >
      <div className="form-grid">
        <label>
          Tipo de documento
          <select
            value={data.documentType ?? ""}
            onChange={(e) => updateData({ documentType: e.target.value })}
          >
            <option value="">Seleccione</option>
            <option value="CC">Cédula</option>
            <option value="PAS">Pasaporte</option>
            <option value="RUC">RUC</option>
          </select>
        </label>

        <label>
          Número de documento
          <input
            value={data.documentNumber ?? ""}
            onChange={(e) => updateData({ documentNumber: e.target.value })}
            placeholder="Ej: 0912345678"
          />
        </label>

        <label>
          Nombre completo
          <input
            value={data.fullName ?? ""}
            onChange={(e) => updateData({ fullName: e.target.value })}
            placeholder="Nombre del titular"
          />
        </label>

        <label>
          Correo
          <input
            value={data.email ?? ""}
            onChange={(e) => updateData({ email: e.target.value })}
            placeholder="correo@dominio.com"
          />
        </label>

        <label>
          Teléfono
          <input
            value={data.phone ?? ""}
            onChange={(e) => updateData({ phone: e.target.value })}
            placeholder="0999999999"
          />
        </label>
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function BeneficiariesScreen(props: ScreenProps) {
  const { data, updateData } = props;

  return (
    <ScreenShell
      title="Datos de beneficiarios"
      description="Para la POC se captura un beneficiario principal."
    >
      <div className="form-grid">
        <label>
          Nombre del beneficiario
          <input
            value={data.beneficiaryName ?? ""}
            onChange={(e) => updateData({ beneficiaryName: e.target.value })}
            placeholder="Nombre del beneficiario"
          />
        </label>

        <label>
          Parentesco
          <select>
            <option>Seleccione</option>
            <option>Cónyuge</option>
            <option>Hijo/a</option>
            <option>Padre/Madre</option>
          </select>
        </label>

        <label>
          Edad
          <input placeholder="Ej: 25" />
        </label>
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function ProductsScreen(props: ScreenProps) {
  const { data, updateData, track } = props;

  const products = [
    {
      name: "Plan Proteger",
      description: "Cobertura para enfermedades graves y gastos mayores."
    },
    {
      name: "Medihumana Familiar",
      description: "Protección médica para el grupo familiar."
    },
    {
      name: "Humana Contigo",
      description: "Acompañamiento médico y servicios complementarios."
    }
  ];

  return (
    <ScreenShell
      title="Visualizar y seleccionar producto"
      description="Agrupa los pasos 3 y 4 del flujo."
    >
      <div className="product-grid">
        {products.map((product) => (
          <button
            key={product.name}
            className={`product-card ${
              data.selectedProduct === product.name ? "selected" : ""
            }`}
            onClick={() => {
              updateData({ selectedProduct: product.name });
              track("select_product", { product: product.name });
            }}
          >
            <span className="product-label">Producto</span>
            <strong>{product.name}</strong>
            <p>{product.description}</p>
          </button>
        ))}
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function PlansScreen(props: ScreenProps) {
  const { data, updateData, track } = props;

  return (
    <ScreenShell
      title="Visualizar planes y seleccionar plan"
      description="Agrupa los pasos 5 y 6 del flujo. Seleccione un plan o elija compararlos."
    >
      <div className="plan-grid">
{availablePlans.map((plan) => (
          <button
            key={plan.name}
            className={`plan-card ${data.selectedPlan === plan.name ? "selected" : ""}`}
            onClick={() => {
              updateData({ selectedPlan: plan.name });
              track("select_plan", { plan: plan.name });
            }}
          >
            <strong>{plan.name}</strong>
            <span className="price">{plan.price}</span>
            <p>{plan.benefits}</p>
          </button>
        ))}
      </div>

      <div style={{ marginTop: "2rem", padding: "1.5rem", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1rem" }}>¿Desea comparar planes?</h3>
        <div className="option-grid">
          <button
            className={`option-card ${data.wantsToCompare === true ? "selected" : ""}`}
            onClick={() => {
              updateData({ wantsToCompare: true });
              track("decision_compare_plans", { wantsToCompare: true });
            }}
          >
            <strong>Sí</strong>
            <span>Quiero ver un cuadro comparativo</span>
          </button>
          <button
            className={`option-card ${data.wantsToCompare === false ? "selected" : ""}`}
            onClick={() => {
              updateData({ wantsToCompare: false });
              track("decision_compare_plans", { wantsToCompare: false });
            }}
          >
            <strong>No</strong>
            <span>Continuar con el plan seleccionado</span>
          </button>
        </div>
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function PromotionsScreen(props: ScreenProps) {
  const { data, updateData, track } = props;

  return (
    <ScreenShell
      title="Promociones y resumen de cotización"
      description="Paso 8 del flujo. Antes de iniciar venta se muestran beneficios o promociones."
    >
      <div className="summary-card">
        <h2>Resumen</h2>
        <p><strong>Cotización:</strong> {data.quoteTarget || "No seleccionado"}</p>
        <p><strong>Titular:</strong> {data.fullName || "Sin datos"}</p>
        <p><strong>Producto:</strong> {data.selectedProduct || "No seleccionado"}</p>
        <p><strong>Plan:</strong> {data.selectedPlan || "No seleccionado"}</p>
      </div>

      <div className="promotion-box">
        <strong>Promoción disponible</strong>
        <p>10% de descuento durante los primeros 3 meses.</p>

        <button
          className={`btn-promo ${
            data.selectedPromotion === "10-percent" ? "selected" : ""
          }`}
          onClick={() => {
            updateData({ selectedPromotion: "10-percent" });
            track("select_promotion", { promotion: "10-percent" });
          }}
        >
          Aplicar promoción
        </button>
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function LoginScreen(props: ScreenProps) {
  const { track } = props;

  return (
    <ScreenShell
      title="Iniciar venta"
      description="Agrupa los pasos 8.3 y 8.3.1: iniciar venta e ingresar credenciales."
    >
      <div className="login-box">
        <label>
          Usuario
          <input placeholder="usuario.broker" />
        </label>

        <label>
          Contraseña
          <input type="password" placeholder="********" />
        </label>

        <button
          className="btn-primary full"
          onClick={() => track("login_attempt", { result: "mock_success" })}
        >
          Validar credenciales
        </button>
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function SalesStageScreen(props: ScreenProps) {
  return (
    <ScreenShell
      title="Etapa de venta"
      description="Pantalla final de la POC. Aquí iniciaría el flujo real de venta."
    >
      <div className="success-panel">
        <div className="success-icon">✓</div>
        <h2>Venta iniciada correctamente</h2>
        <p>
          La POC llegó hasta la etapa de venta siguiendo la secuencia definida.
        </p>
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={props.onBack}>
          Atrás
        </button>
      </div>
    </ScreenShell>
  );
}

export function ComparePlansScreen(props: ScreenProps) {
  const { data, updateData, track } = props;

  const plans = [
    { name: "Esencial", price: "$45 / mes" },
    { name: "Plus", price: "$75 / mes" },
    { name: "Premium", price: "$110 / mes" }
  ];

  // Inicializar arreglo si no existe
  const selectedToCompare = data.plansToCompare || [];

  const togglePlanCompare = (planName: string) => {
    const isSelected = selectedToCompare.includes(planName);
    let newSelection;
    
    if (isSelected) {
      newSelection = selectedToCompare.filter(p => p !== planName);
    } else {
      if (selectedToCompare.length >= 3) return; // Limitar a max 3 planes
      newSelection = [...selectedToCompare, planName];
    }
    
    updateData({ plansToCompare: newSelection });
    track("toggle_compare_plan", { plan: planName, isSelected: !isSelected });
  };

  return (
    <ScreenShell
      title="6.1 Seleccionar planes a comparar"
      description="Seleccione hasta 3 planes para generar un documento comparativo detallado."
    >
      <div className="plan-grid">
        {availablePlans.map((plan) => (
          <button
            key={plan.name}
            className={`plan-card ${data.selectedPlan === plan.name ? "selected" : ""}`}
            onClick={() => togglePlanCompare(plan.name)}
          >
            <strong>{plan.name}</strong>
            <span className="price">{plan.price}</span>
            <p>{selectedToCompare.includes(plan.name) ? "✓ Seleccionado para comparar" : "Haz clic para seleccionar"}</p>
          </button>
        ))}
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function DownloadComparisonScreen(props: ScreenProps) {
  const { data, track } = props;
  const selectedPlansNames = data.plansToCompare || [];

  const handleGeneratePDF = () => {
    // 1. Filtrar los datos reales basados en la selección del usuario
    const plansToCompare = availablePlans.filter(plan => 
      selectedPlansNames.includes(plan.name)
    );

    if (plansToCompare.length === 0) return;

    // 2. Inicializar el documento PDF
    const doc = new jsPDF();

    // 3. Agregar título y cabecera
    doc.setFontSize(18);
    doc.setTextColor(0, 123, 255); // Azul estilo Humana
    doc.text("Comparativo de Planes - Humana", 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text("Resumen detallado generado para la simulación de cotización.", 14, 30);

    // 4. Preparar los datos dinámicos para la tabla
    // Las columnas serán: "Característica" + Nombre de cada plan seleccionado
    const tableColumns = ["Característica", ...plansToCompare.map(p => p.name)];
    
    // Las filas serán los atributos que queremos comparar
    const priceRow = ["Costo Mensual", ...plansToCompare.map(p => p.price)];
    const benefitsRow = ["Cobertura", ...plansToCompare.map(p => p.benefits)];

    // 5. Dibujar la tabla dinámica
    autoTable(doc, {
      startY: 40,
      head: [tableColumns],
      body: [
        priceRow,
        benefitsRow
      ],
      headStyles: { fillColor: [0, 123, 255] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      theme: 'grid'
    });

    // 6. Guardar el archivo
    doc.save("Comparativo_Planes_Humana.pdf");
    
    // Trackear el evento
    track("download_dynamic_pdf", { plans: selectedPlansNames });
  };

  return (
    <ScreenShell
      title="6.2 Descargar comparativo"
      description="Visualice y descargue el PDF con el comparativo de los planes seleccionados."
    >
      <div className="summary-card" style={{ textAlign: "center", padding: "2rem" }}>
        <h2>Cuadro Comparativo Generado</h2>
        <p style={{ marginBottom: "1.5rem" }}>
          Se ha generado el comparativo para los siguientes planes:
          <br/>
          <strong>{selectedPlansNames.length > 0 ? selectedPlansNames.join(" vs ") : "Ningún plan seleccionado"}</strong>
        </p>

        <button
          className="btn-primary"
          onClick={handleGeneratePDF}
          disabled={selectedPlansNames.length === 0}
        >
          📄 Descargar PDF
        </button>
      </div>

      <div className="success-panel" style={{ marginTop: "2rem" }}>
        <h2>Fin del flujo de comparación</h2>
        <p>El broker puede enviar este documento al cliente para su análisis.</p>
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={props.onBack}>
          Atrás
        </button>
        <button className="btn-primary" onClick={() => track("finish_flow_comparison")}>
          Finalizar
        </button>
      </div>
    </ScreenShell>
  );
}

