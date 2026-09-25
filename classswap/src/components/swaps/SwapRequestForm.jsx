import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Send, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { LoadingState } from "@/components/ui/States";
import RuleChecks from "@/components/swaps/RuleChecks";
import { SwapPair } from "@/components/swaps/SwapSlots";
import { useSwaps } from "@/context/SwapContext";
import { cn, slotLabel, slotTime, sleep } from "@/utils/helpers";

const STEPS = [
  "Current slot",
  "Desired slot",
  "Reason",
  "Rule Checks",
  "Summary",
];

function SelectableSlot({ slot, selected, onSelect, meta }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(slot)}
      aria-pressed={selected}
      className={cn(
        "w-full rounded-lg border p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        selected
          ? "border-primary bg-accent ring-1 ring-primary/30"
          : "border-border bg-card hover:border-primary/40",
      )}
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{slotLabel(slot)}</p>
          <p className="text-xs text-muted-foreground">{slotTime(slot)}</p>
          {meta ? <p className="mt-1 text-xs text-muted-foreground">{meta}</p> : null}
        </div>
        {selected ? (
          <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-primary" aria-hidden="true" />
        ) : null}
      </div>
    </button>
  );
}

export default function SwapRequestForm({ user, initialSlotId, onSubmitted }) {
  const { getTimetable, slotCatalog, getSlotInfo, evaluateSwap, createSwapRequest } = useSwaps();

  const mySlots = useMemo(
    () => getTimetable(user.id).filter((s) => s.swappable),
    [getTimetable, user.id],
  );

  const [step, setStep] = useState(1);
  const [fromSlot, setFromSlot] = useState(
    () => mySlots.find((s) => s.id === initialSlotId) ?? null,
  );
  const [toSlot, setToSlot] = useState(null);
  const [reason, setReason] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialSlotId) {
      const match = mySlots.find((s) => s.id === initialSlotId);
      if (match) {
        setFromSlot(match);
        setStep(2);
      }
    }
  }, [initialSlotId, mySlots]);

  const targets = useMemo(
    () =>
      fromSlot
        ? slotCatalog.filter(
            (c) => c.course === fromSlot.course && c.batch !== fromSlot.batch,
          )
        : [],
    [slotCatalog, fromSlot],
  );

  const runChecks = async () => {
    setChecking(true);
    setResult(null);
    await sleep(600);
    const checkRes = await evaluateSwap({ requesterId: user.id, fromSlot, toSlot });
    setResult(checkRes);
    setChecking(false);
  };

  useEffect(() => {
    if (step === 4 && !result && !checking) runChecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const submit = async () => {
    setSubmitting(true);
    setError(null);
    const res = await createSwapRequest({
      requester: user,
      fromSlot,
      toSlot,
      reason,
      checks: result,
    });
    setSubmitting(false);
    if (!res.ok) {
      setError(res.error || "Unable to create the swap request.");
      return;
    }
    onSubmitted?.(res.data);
  };

  const canContinue =
    (step === 1 && fromSlot) ||
    (step === 2 && toSlot) ||
    (step === 3 && reason.trim().length > 3) ||
    (step === 4 && result?.passed);

  if (!mySlots.length) {
    return (
      <EmptyState
        title="No swappable slots"
        description="None of your current classes are marked as swappable this semester."
      />
    );
  }

  return (
    <div className="space-y-4">
      <ol className="flex flex-wrap gap-2" aria-label="Swap request steps">
        {STEPS.map((label, i) => {
          const n = i + 1;
          return (
            <li
              key={label}
              className={cn(
                "flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
                n === step
                  ? "border-primary bg-primary text-primary-foreground"
                  : n < step
                    ? "border-success/20 bg-success/10 text-success"
                    : "border-border bg-card text-muted-foreground",
              )}
            >
              <span aria-hidden="true">{n}</span>
              {label}
            </li>
          );
        })}
      </ol>

      <Card className="p-4 sm:p-5">
        {step === 1 ? (
          <div>
            <h2 className="text-base font-semibold text-card-foreground">
              Step 1 · Select your current slot
            </h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              Only slots marked swappable can be exchanged.
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {mySlots.map((slot) => (
                <SelectableSlot
                  key={slot.id}
                  slot={slot}
                  selected={fromSlot?.id === slot.id}
                  onSelect={(s) => {
                    setFromSlot(s);
                    setToSlot(null);
                    setResult(null);
                  }}
                  meta={`${slot.type} · ${slot.room}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <h2 className="text-base font-semibold text-card-foreground">
              Step 2 · Select the desired slot
            </h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              Same course only — {fromSlot ? fromSlot.course : ""}.
            </p>
            {targets.length ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {targets.map((slot) => {
                  const info = getSlotInfo(slot);
                  return (
                    <SelectableSlot
                      key={slot.id}
                      slot={slot}
                      selected={toSlot?.id === slot.id}
                      onSelect={(s) => {
                        setToSlot(s);
                        setResult(null);
                      }}
                      meta={info ? `Seats: ${info.enrolled} / ${info.capacity}` : undefined}
                    />
                  );
                })}
              </div>
            ) : (
              <EmptyState
                title="No alternative slots"
                description="There is no other batch offering this course right now."
              />
            )}
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <h2 className="text-base font-semibold text-card-foreground">
              Step 3 · Why do you need this swap?
            </h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              Faculty see this reason during approval.
            </p>
            <Textarea
              label="Reason"
              placeholder="e.g. Family event on Mondays"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              hint="Minimum 4 characters."
            />
          </div>
        ) : null}

        {step === 4 ? (
          <div>
            <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-card-foreground">
                  Step 4 · Rule Checks
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Validated against the university swap rules.
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={runChecks} disabled={checking}>
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Re-run
              </Button>
            </div>
            {checking ? <LoadingState label="Running rule checks…" /> : <RuleChecks result={result} />}
          </div>
        ) : null}

        {step === 5 ? (
          <div>
            <h2 className="text-base font-semibold text-card-foreground">Step 5 · Summary</h2>
            <p className="mt-1 mb-4 text-sm text-muted-foreground">
              Review and submit your swap request for approval.
            </p>
            <SwapPair fromSlot={fromSlot} toSlot={toSlot} />
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border p-3">
                <dt className="text-xs text-muted-foreground">Requested by</dt>
                <dd className="text-sm font-medium text-foreground">
                  {user.name} · {user.studentId}
                </dd>
              </div>
              <div className="rounded-lg border border-border p-3">
                <dt className="text-xs text-muted-foreground">Reason</dt>
                <dd className="text-sm font-medium text-foreground">{reason}</dd>
              </div>
            </dl>
            <div className="mt-4">
              <RuleChecks result={result} />
            </div>
            {error ? (
              <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-border pt-4">
          <Button
            variant="ghost"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={!canContinue}>
              Continue
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button onClick={submit} loading={submitting} disabled={!result?.passed}>
              <Send className="h-4 w-4" aria-hidden="true" />
              Submit for approval
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
