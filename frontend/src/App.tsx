import { useId, useState, type FormEvent, type ReactNode } from "react";
import { AlertTriangle, ArrowRight, CarFront, Check, RotateCcw } from "lucide-react";

type ValuationForm = {
  Date: string;
  Gender: string;
  Annual_Income: string;
  Company: string;
  Model: string;
  Engine: string;
  Transmission: string;
  Color: string;
  Body_Style: string;
  Dealer_Region: string;
};

type FieldName = keyof ValuationForm;
type FieldProps = {
  label: FieldName;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children?: ReactNode;
  type?: "text" | "date" | "number";
  placeholder?: string;
  min?: string;
  step?: string;
};

const initialForm: ValuationForm = {
  Date: new Date().toISOString().slice(0, 10),
  Gender: "",
  Annual_Income: "",
  Company: "",
  Model: "",
  Engine: "",
  Transmission: "",
  Color: "",
  Body_Style: "",
  Dealer_Region: "",
};

const fieldLabels: Record<FieldName, string> = {
  Date: "Date",
  Gender: "Gender",
  Annual_Income: "Annual_Income",
  Company: "Company",
  Model: "Model",
  Engine: "Engine",
  Transmission: "Transmission",
  Color: "Color",
  Body_Style: "Body_Style",
  Dealer_Region: "Dealer_Region",
};

const selectOptions: Partial<Record<FieldName, { value: string; label: string }[]>> = {
  Gender: [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ],
  Company: [
    { value: "Audi", label: "Audi" },
    { value: "BMW", label: "BMW" },
    { value: "Ford", label: "Ford" },
    { value: "Honda", label: "Honda" },
    { value: "Mercedes-Benz", label: "Mercedes-Benz" },
    { value: "Toyota", label: "Toyota" },
  ],
  Model: [
    { value: "A4", label: "A4" },
    { value: "3 Series", label: "3 Series" },
    { value: "Explorer", label: "Explorer" },
    { value: "Civic", label: "Civic" },
    { value: "C-Class", label: "C-Class" },
    { value: "Camry", label: "Camry" },
  ],
  Engine: [
    { value: "1.5L", label: "1.5L" },
    { value: "2.0L", label: "2.0L" },
    { value: "2.5L", label: "2.5L" },
    { value: "3.0L", label: "3.0L" },
    { value: "Electric", label: "Electric" },
  ],
  Transmission: [
    { value: "Automatic", label: "Automatic" },
    { value: "Manual", label: "Manual" },
    { value: "CVT", label: "CVT" },
  ],
  Color: [
    { value: "Black", label: "Black" },
    { value: "White", label: "White" },
    { value: "Silver", label: "Silver" },
    { value: "Grey", label: "Grey" },
    { value: "Blue", label: "Blue" },
    { value: "Red", label: "Red" },
  ],
  Body_Style: [
    { value: "Sedan", label: "Sedan" },
    { value: "SUV", label: "SUV" },
    { value: "Hatchback", label: "Hatchback" },
    { value: "Coupe", label: "Coupe" },
    { value: "Wagon", label: "Wagon" },
    { value: "Convertible", label: "Convertible" },
  ],
  Dealer_Region: [
    { value: "North", label: "North" },
    { value: "South", label: "South" },
    { value: "East", label: "East" },
    { value: "West", label: "West" },
    { value: "Central", label: "Central" },
  ],
};

function getApiBaseUrl(): string {
  const configured = import.meta.env.VITE_API_BASE_URL as string | undefined;
  return (configured || "http://127.0.0.1:8000").replace(/\/$/, "");
}

function formatPrice(value: unknown): string | null {
  const amount =
    typeof value === "number"
      ? value
      : typeof value === "string" && value.trim() !== ""
        ? Number(value)
        : Number.NaN;

  if (!Number.isFinite(amount)) return null;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Field({
  label,
  value,
  onChange,
  error,
  children,
  type = "text",
  placeholder,
  min,
  step,
}: FieldProps) {
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const options = selectOptions[label];
  const sharedClassName =
    "mt-2 h-12 w-full border bg-[var(--autovalue-graphite)] px-3.5 text-[15px] text-[var(--autovalue-ink)] outline-none transition-colors duration-200 placeholder:text-[var(--autovalue-ink-dim)] focus:border-[var(--autovalue-accent)] focus:ring-1 focus:ring-[var(--autovalue-accent)]";

  return (
    <label htmlFor={fieldId} className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--autovalue-ink-soft)]">
        {fieldLabels[label]}
        <span className="ml-1 text-[var(--autovalue-accent)]" aria-hidden="true">*</span>
      </span>
      {options ? (
        <select
          id={fieldId}
          name={label}
          value={value}
          required
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          data-testid={`select-${label}`}
          className={`${sharedClassName} appearance-none rounded-none bg-[length:12px_12px] bg-[right_14px_center] bg-no-repeat pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23adb5b3' d='M2.1 4.25 6 8.15l3.9-3.9.85.85L6 9.85 1.25 5.1z'/%3E%3C/svg%3E\")",
          }}
        >
          <option value="" disabled>
            Select {fieldLabels[label].toLowerCase()}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={fieldId}
          name={label}
          type={type}
          value={value}
          required
          min={min}
          step={step}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => onChange(event.target.value)}
          data-testid={`input-${label}`}
          className={`${sharedClassName} rounded-none`}
        />
      )}
      {children}
      {error ? (
        <span id={errorId} className="mt-1.5 block text-[11px] text-[var(--autovalue-danger)]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function VehicleContour() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 620 150"
      className="autovalue-contour absolute bottom-0 left-1/2 w-[115%] min-w-[520px] -translate-x-1/2 text-[var(--autovalue-accent)] opacity-70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M35 103.8c21-4.5 40.4-7.9 58.3-10.1 15.6-1.9 31.8-4.7 45-12.6 9.8-5.8 20.8-18.5 31.5-25.8 13.7-9.4 29.5-12.1 48.7-13.5l95.1-6.8c17.8-1.3 28.8.7 40.2 7.4 11 6.5 22.1 17.8 31.1 24.6 8.1 6.2 18.1 8.6 31.3 10.6l69.9 10.6c15.6 2.4 30.3 5.2 46.5 15.6"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M158 92.9c10.1-1.1 18.8-6.9 23.5-14.4m253.2 15.6c-8.2-2-15-6.4-19.4-13.3"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        opacity=".58"
      />
      <circle cx="180" cy="104" r="16.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="180" cy="104" r="5" stroke="currentColor" strokeWidth="1" opacity=".7" />
      <circle cx="433" cy="104" r="16.5" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="433" cy="104" r="5" stroke="currentColor" strokeWidth="1" opacity=".7" />
      <path d="M48 123.5h524" stroke="currentColor" strokeWidth=".8" opacity=".35" />
    </svg>
  );
}

function Home() {
  const [form, setForm] = useState<ValuationForm>(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [price, setPrice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<FieldName, string>>>({});

  const updateField = (field: FieldName, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    if (error) setError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isLoading) return;

    const missing = Object.keys(form).reduce<Partial<Record<FieldName, string>>>(
      (errors, field) => {
        const key = field as FieldName;
        if (!form[key].trim()) errors[key] = "Required";
        return errors;
      },
      {},
    );

    if (Object.keys(missing).length > 0) {
      setFieldErrors(missing);
      setError("Complete every field before requesting a valuation.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setPrice(null);

    try {
      const response = await fetch(`${getApiBaseUrl()}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("service-unavailable");

      const payload: unknown = await response.json();
      const predictedPrice = formatPrice(
        payload && typeof payload === "object" && "predicted_price" in payload
          ? payload.predicted_price
          : undefined,
      );
      if (!predictedPrice) throw new Error("service-unavailable");

      setPrice(predictedPrice);
    } catch (submissionError) {
      const isUnavailable =
        submissionError instanceof TypeError ||
        (submissionError instanceof Error && submissionError.message === "service-unavailable");
      setError(
        isUnavailable
          ? "AutoValue is temporarily unavailable. Check that the valuation service is running and try again."
          : "We could not complete this valuation. Please review the details and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setForm({ ...initialForm, Date: new Date().toISOString().slice(0, 10) });
    setPrice(null);
    setError(null);
    setFieldErrors({});
  };

  return (
    <main className="autovalue-shell min-h-[100dvh] overflow-hidden">
      <div className="autovalue-grain fixed inset-0 z-0" />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col px-5 py-5 sm:px-8 sm:py-7 lg:px-12">
        <header className="flex items-center justify-between border-b border-[var(--autovalue-line)] pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center border border-[var(--autovalue-line-strong)] text-[var(--autovalue-accent)]">
              <CarFront size={18} strokeWidth={1.35} />
            </div>
            <div>
              <p className="text-[14px] font-medium tracking-[0.08em] text-[var(--autovalue-ink)]">
                AutoValue <span className="text-[var(--autovalue-accent)]">AI</span>
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--autovalue-ink-dim)]">
                Vehicle valuation instrument
              </p>
            </div>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.15em] text-[var(--autovalue-ink-dim)] sm:block">
            Model endpoint / predict
          </span>
        </header>

        <div className="flex flex-1 flex-col justify-center py-10 lg:py-14">
          <div className="autovalue-reveal mb-10 max-w-[660px] sm:mb-14">
            <p className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--autovalue-accent)]">
              <span className="h-px w-8 bg-[var(--autovalue-accent)]" />
              Market reference
            </p>
            <h1 className="max-w-[600px] text-[clamp(2.5rem,6vw,5.6rem)] font-light leading-[0.96] tracking-[-0.065em] text-[var(--autovalue-ink)]">
              Find the number
              <br />
              <span className="text-[var(--autovalue-ink-soft)]">behind the car.</span>
            </h1>
            <p className="mt-6 max-w-[480px] text-[15px] leading-7 text-[var(--autovalue-ink-soft)]">
              Enter the vehicle and customer context. AutoValue returns one grounded price for the decision in front of you.
            </p>
          </div>

          <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(330px,.75fr)] lg:gap-16 xl:gap-24">
            <section className="autovalue-reveal autovalue-stagger-1" aria-labelledby="details-heading">
              <div className="mb-5 flex items-end justify-between border-b border-[var(--autovalue-line)] pb-3">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--autovalue-accent)]">01 / 02</p>
                  <h2 id="details-heading" className="mt-2 text-xl font-medium tracking-[-0.02em]">Vehicle details</h2>
                </div>
                <p className="font-mono text-[10px] text-[var(--autovalue-ink-dim)]">All fields required</p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
                <Field label="Date" type="date" value={form.Date} error={fieldErrors.Date} onChange={(value) => updateField("Date", value)} />
                <Field label="Gender" value={form.Gender} error={fieldErrors.Gender} onChange={(value) => updateField("Gender", value)} />
                <Field label="Annual_Income" type="number" value={form.Annual_Income} error={fieldErrors.Annual_Income} onChange={(value) => updateField("Annual_Income", value)} placeholder="e.g. 72000" min="0" step="1" />
                <Field label="Company" value={form.Company} error={fieldErrors.Company} onChange={(value) => updateField("Company", value)} />
                <Field label="Model" value={form.Model} error={fieldErrors.Model} onChange={(value) => updateField("Model", value)} />
                <Field label="Engine" value={form.Engine} error={fieldErrors.Engine} onChange={(value) => updateField("Engine", value)} />
                <Field label="Transmission" value={form.Transmission} error={fieldErrors.Transmission} onChange={(value) => updateField("Transmission", value)} />
                <Field label="Color" value={form.Color} error={fieldErrors.Color} onChange={(value) => updateField("Color", value)} />
                <Field label="Body_Style" value={form.Body_Style} error={fieldErrors.Body_Style} onChange={(value) => updateField("Body_Style", value)} />
                <Field label="Dealer_Region" value={form.Dealer_Region} error={fieldErrors.Dealer_Region} onChange={(value) => updateField("Dealer_Region", value)} />

                <div className="mt-2 flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-mono text-[10px] leading-5 text-[var(--autovalue-ink-dim)]">
                    POST /predict
                    <br />
                    Context stays with this valuation.
                  </p>
                  <button
                    type="submit"
                    disabled={isLoading}
                    data-testid="button-submit-valuation"
                    className="autovalue-button-sheen group flex min-h-12 w-full items-center justify-center gap-4 bg-[var(--autovalue-accent)] px-5 text-left text-[13px] font-medium text-[#20201c] transition-colors duration-200 hover:bg-[var(--autovalue-accent-light)] focus:outline-none focus:ring-2 focus:ring-[var(--autovalue-accent)] focus:ring-offset-2 focus:ring-offset-[var(--autovalue-graphite)] disabled:cursor-wait disabled:opacity-60 sm:w-auto sm:min-w-[208px]"
                  >
                    {isLoading ? "Reading the market..." : "Predict price"}
                    {isLoading ? (
                      <span aria-hidden="true" className="h-3.5 w-3.5 animate-pulse border border-[#20201c] border-t-transparent" />
                    ) : (
                      <ArrowRight size={16} strokeWidth={1.5} className="transition-transform duration-200 group-hover:translate-x-1" />
                    )}
                  </button>
                </div>
              </form>
            </section>

            <section
              className="autovalue-reveal autovalue-stagger-2 relative min-h-[330px] overflow-hidden border border-[var(--autovalue-line)] bg-[var(--autovalue-panel)]"
              aria-live="polite"
              aria-label="Valuation result"
              data-testid="panel-valuation-result"
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-[var(--autovalue-accent)]" />
              <div className="relative flex min-h-[330px] flex-col justify-between p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--autovalue-accent)]">02 / 02</p>
                    <h2 className="mt-2 text-xl font-medium tracking-[-0.02em]">Predicted price</h2>
                  </div>
                  {price ? (
                    <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--autovalue-success)]" data-testid="status-ready">
                      <Check size={12} />
                      Ready
                    </span>
                  ) : (
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--autovalue-ink-dim)]" data-testid="status-awaiting-input">
                      Awaiting input
                    </span>
                  )}
                </div>

                {error ? (
                  <div className="autovalue-reveal relative z-10 my-8 border-l-2 border-[var(--autovalue-danger)] pl-4" data-testid="status-error">
                    <div className="flex items-center gap-2 text-[var(--autovalue-danger)]">
                      <AlertTriangle size={16} strokeWidth={1.5} />
                      <p className="text-sm font-medium">Valuation unavailable</p>
                    </div>
                    <p className="mt-2 max-w-[320px] text-[13px] leading-6 text-[var(--autovalue-ink-soft)]">{error}</p>
                    <button
                      type="button"
                      onClick={() => setError(null)}
                      data-testid="button-dismiss-error"
                      className="mt-4 inline-flex min-h-10 items-center gap-2 border-b border-[var(--autovalue-line-strong)] pb-1 text-[12px] text-[var(--autovalue-ink)] transition-colors hover:border-[var(--autovalue-accent)] hover:text-[var(--autovalue-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--autovalue-accent)]"
                    >
                      Dismiss
                    </button>
                  </div>
                ) : price ? (
                  <div className="autovalue-price relative z-10 my-8" data-testid="text-predicted-price">
                    <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--autovalue-ink-dim)]">Estimated market value</p>
                    <p className="mt-3 text-[clamp(3.25rem,6vw,5.6rem)] font-light leading-none tracking-[-0.07em] text-[var(--autovalue-accent-light)]">{price}</p>
                    <p className="mt-4 max-w-[280px] text-[12px] leading-5 text-[var(--autovalue-ink-soft)]">A single model prediction from the context you provided.</p>
                  </div>
                ) : (
                  <div className="relative z-10 my-8 max-w-[275px]" data-testid="text-empty-result">
                    <p className="text-[26px] font-light leading-tight tracking-[-0.04em] text-[var(--autovalue-ink-soft)]">Your valuation will appear here.</p>
                    <p className="mt-4 text-[13px] leading-6 text-[var(--autovalue-ink-dim)]">Complete the vehicle profile, then ask the model for its read.</p>
                  </div>
                )}

                <div className="relative z-10 flex items-center justify-between border-t border-[var(--autovalue-line)] pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--autovalue-ink-dim)]">Grounded response only</p>
                  {price ? (
                    <button
                      type="button"
                      onClick={handleReset}
                      data-testid="button-new-valuation"
                      className="inline-flex min-h-9 items-center gap-2 text-[11px] text-[var(--autovalue-ink-soft)] transition-colors hover:text-[var(--autovalue-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--autovalue-accent)]"
                    >
                      <RotateCcw size={13} />
                      New valuation
                    </button>
                  ) : null}
                </div>
              </div>
              <VehicleContour />
            </section>
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-[var(--autovalue-line)] pt-4 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--autovalue-ink-dim)] sm:flex-row sm:items-center sm:justify-between">
          <span>AutoValue AI / Decision support</span>
          <span>One vehicle. One grounded price.</span>
        </footer>
      </div>
    </main>
  );
}

export default function App() {
  return <Home />;
}