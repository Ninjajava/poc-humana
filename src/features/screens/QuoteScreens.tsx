import type { QuoteData } from "../types";
import { ScreenShell } from "../../shared/components/ScreenShell";

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

  const plans = [
    {
      name: "Esencial",
      price: "$45 / mes",
      benefits: "Cobertura básica, consultas y emergencias."
    },
    {
      name: "Plus",
      price: "$75 / mes",
      benefits: "Mayor cobertura, especialistas y hospitalización."
    },
    {
      name: "Premium",
      price: "$110 / mes",
      benefits: "Cobertura ampliada, red preferente y beneficios extra."
    }
  ];

  return (
    <ScreenShell
      title="Visualizar planes y seleccionar plan"
      description="Agrupa los pasos 5 y 6 del flujo."
    >
      <div className="plan-grid">
        {plans.map((plan) => (
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