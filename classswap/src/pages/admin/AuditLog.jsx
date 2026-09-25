import { useState } from "react";
import AppLayout, { PageHeader } from "@/components/layout/AppLayout";
import Card, { CardBody, CardHeader } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import Input from "@/components/ui/Input";
import { useSwaps } from "@/context/SwapContext";
import { formatDateTime, formatTime } from "@/utils/helpers";

export default function AuditLog() {
  const { auditLogs } = useSwaps();
  const [query, setQuery] = useState("");

  const entries = auditLogs.filter((log) =>
    `${log.actor} ${log.action} ${log.detail ?? ""}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <AppLayout role="admin">
      <PageHeader
        title="Audit Log"
        description="Every action in the swap workflow, in order."
      />

      <Card>
        <CardHeader
          title={`${entries.length} entries`}
          description="Filter by actor, action or detail"
          action={
            <div className="w-44 sm:w-64">
              <Input
                placeholder="Search audit log…"
                aria-label="Search audit log"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          }
        />
        <CardBody>
          {entries.length ? (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs tracking-wide text-muted-foreground uppercase">
                      <th scope="col" className="py-2 pr-3 font-medium">Time</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Actor</th>
                      <th scope="col" className="py-2 pr-3 font-medium">Action</th>
                      <th scope="col" className="py-2 font-medium">Detail</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((log) => (
                      <tr key={log.id} className="border-b border-border last:border-0">
                        <td className="py-2.5 pr-3 whitespace-nowrap text-muted-foreground">
                          {formatTime(log.at)}
                        </td>
                        <td className="py-2.5 pr-3 font-medium text-foreground">{log.actor}</td>
                        <td className="py-2.5 pr-3 text-foreground">{log.action}</td>
                        <td className="py-2.5 text-muted-foreground">{log.detail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <ul className="space-y-2 md:hidden">
                {entries.map((log) => (
                  <li key={log.id} className="rounded-lg border border-border p-3">
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{log.actor}</p>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatDateTime(log.at)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-foreground">{log.action}</p>
                    {log.detail ? (
                      <p className="text-xs text-muted-foreground">{log.detail}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <EmptyState
              title="No matching audit entries"
              description="Try a different search term."
            />
          )}
        </CardBody>
      </Card>
    </AppLayout>
  );
}
