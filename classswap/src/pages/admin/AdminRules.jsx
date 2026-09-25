import { CalendarClock, Layers, Repeat, ShieldCheck, Users } from "lucide-react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { RULE_DEFINITIONS } from "@/data/rules";
import { useSwaps } from "@/context/SwapContext";

export default function AdminRules() {
  const { rules } = useSwaps();

  const activeRule = Array.isArray(rules) ? rules[0] || {} : rules || {};
  const maxSwaps = activeRule.maxSwapsPerStudent || 2;
  const sameCourseOnly = activeRule.sameCourseOnly !== false;
  const sameProgramOnly = activeRule.sameProgramOnly !== false;
  const requireCapacity = activeRule.capacityCheckEnabled !== false;

  const CONFIG = [
    {
      icon: CalendarClock,
      label: "Swap window",
      value: "Semester 3 (Active)",
      hint: "Requests close automatically after semester end",
    },
    {
      icon: Repeat,
      label: "Maximum swaps",
      value: `${maxSwaps} per student`,
      hint: "Counted per semester, approved swaps only",
    },
    {
      icon: Layers,
      label: "Course restriction",
      value: sameCourseOnly ? "Same course only" : "Any course",
      hint: "Swaps may not move a student across courses",
    },
    {
      icon: Users,
      label: "Capacity",
      value: requireCapacity ? "Target slot must have seats" : "Not enforced",
      hint: "Lab batches are capped at 30 seats",
    },
    {
      icon: ShieldCheck,
      label: "Eligibility",
      value: sameProgramOnly ? "Same program" : "Any program",
      hint: "Both students must belong to the same program",
    },
  ];

  return (
    <AppLayout role="admin">
      <PageHeader
        title="Swap Rules"
        description="Configuration applied by the rule engine before any swap is matched."
      />

      <div className="grid gap-3 md:grid-cols-2">
        {CONFIG.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.label} className="p-4 sm:p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-card-foreground">{item.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{item.hint}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-4">
        <CardHeader
          title="Rule Checks executed per request"
          description="All six checks must pass before a swap can be matched"
          action={<Badge tone="success">6 checks</Badge>}
        />
        <CardBody>
          <ol className="grid gap-2 sm:grid-cols-2">
            {RULE_DEFINITIONS.map((rule, i) => (
              <li key={rule.key} className="flex gap-3 rounded-lg border border-border p-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">{rule.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </CardBody>
      </Card>
    </AppLayout>
  );
}
