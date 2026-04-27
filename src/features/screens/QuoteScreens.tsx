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

interface ActionsProps
  extends Pick<ScreenProps, "onBack" | "onNext" | "isFirst" | "isLast"> {
  nextDisabled?: boolean;
  nextLabel?: string;
}

function Actions({
  onBack,
  onNext,
  isFirst,
  isLast,
  nextDisabled = false,
  nextLabel = "Continuar"
}: ActionsProps) {
  return (
    <div className="actions">
      {!isFirst && (
        <button className="btn-secondary" onClick={onBack}>
          Atras
        </button>
      )}

      {!isLast && (
        <button className="btn-primary" onClick={onNext} disabled={nextDisabled}>
          {nextLabel}
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
      title="Seleccionar a quien cotizar"
      description="Primer paso del flujo. Aqui se define el tipo de cotizacion."
    >
      <div className="option-grid">
        {["Para mi", "Para otra persona", "Grupo familiar"].map((item) => (
          <button
            key={item}
            className={`option-card ${data.quoteTarget === item ? "selected" : ""}`}
            onClick={() => selectTarget(item)}
          >
            <strong>{item}</strong>
            <span>Cotizacion medica integral</span>
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
      description="Captura de datos basicos del titular de la cotizacion."
    >
      <div className="form-grid">
        <label>
          Tipo de documento
          <select
            value={data.documentType ?? ""}
            onChange={(e) => updateData({ documentType: e.target.value })}
          >
            <option value="">Seleccione</option>
            <option value="CC">Cedula</option>
            <option value="PAS">Pasaporte</option>
            <option value="RUC">RUC</option>
          </select>
        </label>

        <label>
          Numero de documento
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
          Telefono
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
            <option>Conyuge</option>
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
      description: "Proteccion medica para el grupo familiar."
    },
    {
      name: "Humana Contigo",
      description: "Acompanamiento medico y servicios complementarios."
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
      benefits: "Cobertura basica, consultas y emergencias."
    },
    {
      name: "Plus",
      price: "$75 / mes",
      benefits: "Mayor cobertura, especialistas y hospitalizacion."
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

  const selectAction = (nextAction: "sale" | "send-quote") => {
    updateData({ nextAction });
    track("select_next_action", { nextAction });
  };

  return (
    <ScreenShell
      title="Promociones y resumen de cotizacion"
      description="Paso 8 del flujo. Selecciona la accion para continuar."
    >
      <div className="summary-card">
        <h2>Resumen</h2>
        <p>
          <strong>Cotizacion:</strong> {data.quoteTarget || "No seleccionado"}
        </p>
        <p>
          <strong>Titular:</strong> {data.fullName || "Sin datos"}
        </p>
        <p>
          <strong>Producto:</strong> {data.selectedProduct || "No seleccionado"}
        </p>
        <p>
          <strong>Plan:</strong> {data.selectedPlan || "No seleccionado"}
        </p>
      </div>

      <div className="promotion-box">
        <strong>Promocion disponible</strong>
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
          Aplicar promocion
        </button>
      </div>

      <div className="promotion-box">
        <strong>Que deseas hacer?</strong>
        <p>Define la ruta desde el paso 8 para continuar la simulacion.</p>

        <div className="option-grid">
          <button
            className={`option-card ${data.nextAction === "send-quote" ? "selected" : ""}`}
            onClick={() => selectAction("send-quote")}
          >
            <strong>Enviar cotizacion</strong>
            <span>Flujo 8 - 8.2 - 8.2.1</span>
          </button>

          <button
            className={`option-card ${data.nextAction === "sale" ? "selected" : ""}`}
            onClick={() => selectAction("sale")}
          >
            <strong>Iniciar venta</strong>
            <span>Flujo 8 - 8.3 - etapa de venta</span>
          </button>
        </div>
      </div>

      <Actions {...props} nextDisabled={!data.nextAction} />
    </ScreenShell>
  );
}

export function QuoteSendLoginScreen(props: ScreenProps) {
  const { track } = props;

  return (
    <ScreenShell
      title="Iniciar sesion para enviar cotizacion"
      description="Paso 8.2: validacion de credenciales personales."
    >
      <div className="login-box">
        <label>
          Usuario
          <input placeholder="usuario.broker" />
        </label>

        <label>
          Contrasena
          <input type="password" placeholder="********" />
        </label>

        <button
          className="btn-primary full"
          onClick={() =>
            track("quote_send_login_attempt", { result: "mock_success" })
          }
        >
          Validar credenciales
        </button>
      </div>

      <Actions {...props} />
    </ScreenShell>
  );
}

export function QuoteSendFollowupScreen(props: ScreenProps) {
  const { data, updateData, track } = props;

  const channels = [
    { id: "email", title: "Correo electronico", detail: "Enviar PDF al cliente" },
    { id: "whatsapp", title: "Whatsapp", detail: "Compartir enlace y cotizacion" },
    { id: "call", title: "Llamada", detail: "Registrar contacto telefonico" }
  ];

  return (
    <ScreenShell
      title="Enviar cotizacion y dar seguimiento"
      description="Paso 8.2.1: envio de propuesta y registro de seguimiento."
    >
      <div className="summary-card">
        <h2>Cotizacion lista para envio</h2>
        <p>
          <strong>Titular:</strong> {data.fullName || "Sin datos"}
        </p>
        <p>
          <strong>Producto:</strong> {data.selectedProduct || "No seleccionado"}
        </p>
        <p>
          <strong>Plan:</strong> {data.selectedPlan || "No seleccionado"}
        </p>
      </div>

      <div className="promotion-box">
        <strong>Canal de seguimiento</strong>
        <p>Selecciona el canal para enviar y registrar la cotizacion.</p>

        <div className="option-grid">
          {channels.map((channel) => (
            <button
              key={channel.id}
              className={`option-card ${
                data.followupChannel === channel.id ? "selected" : ""
              }`}
              onClick={() => {
                updateData({ followupChannel: channel.id });
                track("select_followup_channel", { channel: channel.id });
              }}
            >
              <strong>{channel.title}</strong>
              <span>{channel.detail}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className="btn-primary full"
        onClick={() =>
          track("send_quote_followup", {
            channel: data.followupChannel ?? "not_selected"
          })
        }
      >
        Enviar cotizacion y registrar seguimiento
      </button>

      <div className="actions">
        <button className="btn-secondary" onClick={props.onBack}>
          Atras
        </button>
      </div>
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
          Contrasena
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
      description="Pantalla final de la POC. Aqui iniciaria el flujo real de venta."
    >
      <div className="success-panel">
        <div className="success-icon">OK</div>
        <h2>Venta iniciada correctamente</h2>
        <p>La POC llego hasta la etapa de venta siguiendo la secuencia definida.</p>
      </div>

      <div className="actions">
        <button className="btn-secondary" onClick={props.onBack}>
          Atras
        </button>
      </div>
    </ScreenShell>
  );
}
