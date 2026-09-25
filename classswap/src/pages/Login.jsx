import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  CheckCircle2,
  GraduationCap,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const ROLE_CARDS = [
  {
    role: "student",
    icon: GraduationCap,
    title: "Student",
    description: "Request and manage class swaps",
    accounts: [
      { key: "student1", label: "Sign in as Ravi Kumar", meta: "STU001 · MCA · Batch A" },
      { key: "student2", label: "Sign in as Priya Sharma", meta: "STU002 · MCA · Batch B" },
    ],
  },
  {
    role: "faculty",
    icon: UserCog,
    title: "Faculty",
    description: "Review and approve swaps",
    accounts: [{ key: "faculty", label: "Sign in as Dr. Mehta", meta: "FAC001 · 4 courses" }],
  },
  {
    role: "admin",
    icon: ShieldCheck,
    title: "Admin",
    description: "Manage rules and audit activity",
    accounts: [{ key: "admin", label: "Sign in as Admin User", meta: "ADM001 · System owner" }],
  },
];

const HIGHLIGHTS = [
  "Swap requests and offers in one place",
  "Six automatic rule checks before anything moves",
  "Faculty approval with a full audit trail",
];

export default function Login() {
  const { login, user, ready } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pending, setPending] = useState(null);

  useEffect(() => {
    if (ready && user) navigate({ to: `/${user.role}`, replace: true });
  }, [ready, user, navigate]);

  const handleLogin = async (accountKey) => {
    setPending(accountKey);
    const res = await login(accountKey);
    setPending(null);
    if (!res.ok) {
      toast("Unable to sign in", "error", res.error);
      return;
    }
    toast(`Signed in as ${res.data.name}`, "success");
    navigate({ to: `/${res.data.role}`, replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:py-16">
        <section className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
              <ArrowLeftRight className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-lg font-bold tracking-tight text-foreground">
                ClassSwap
              </span>
              <span className="block text-xs text-muted-foreground">
                Controlled class &amp; lab-slot swaps for universities
              </span>
            </span>
          </div>

          <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Fair, controlled, traceable class swaps.
          </h1>
          <p className="mt-3 max-w-lg text-base text-muted-foreground">
            Swap class and lab slots without timetable clashes or endless messages.
          </p>

          <ul className="mt-6 space-y-2.5">
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-success" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

          <p className="mt-6 rounded-lg border border-border bg-card px-4 py-3 text-xs text-muted-foreground">
            Connected to ClassSwap Express API &amp; MongoDB backend · Real-time data. Status flow: OPEN → MATCHED → PENDING APPROVAL → APPROVED / REJECTED.
          </p>
        </section>

        <section className="min-w-0">
          <h2 className="mb-3 text-sm font-semibold text-foreground">Choose a role to continue</h2>
          <div className="grid gap-3">
            {ROLE_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.role}
                  className="rounded-xl border border-border bg-card p-4 shadow-card transition-shadow hover:shadow-elevated sm:p-5"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-accent text-accent-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-card-foreground">{card.title}</h3>
                      <p className="text-sm text-muted-foreground">{card.description}</p>
                      <div className="mt-3 grid gap-2">
                        {card.accounts.map((account) => (
                          <Button
                            key={account.key}
                            variant={card.role === "student" ? "primary" : "secondary"}
                            className="justify-between"
                            loading={pending === account.key}
                            onClick={() => handleLogin(account.key)}
                          >
                            <span className="truncate">{account.label}</span>
                            <span className="hidden text-xs font-normal opacity-80 sm:inline">
                              {account.meta}
                            </span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
