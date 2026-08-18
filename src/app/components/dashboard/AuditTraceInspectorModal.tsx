import React from "react";
import { X, Download, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";
import { mockAuditTraceLogs, AuditTraceRecord } from "./dashboardData";
import { Button } from "../ui/button";

interface AuditTraceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityName: string;
  entityType: string;
}

export const AuditTraceInspectorModal: React.FC<AuditTraceInspectorModalProps> = ({
  isOpen,
  onClose,
  entityName,
  entityType,
}) => {
  if (!isOpen) return null;

  const logs: AuditTraceRecord[] = mockAuditTraceLogs[entityName] || mockAuditTraceLogs.Default;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scaleUp">
        {/* Dark Header */}
        <div className="p-4 bg-neutral-950 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary-400" />
              <h3 className="text-sm font-extrabold tracking-tight">
                Audit Traces for {entityType}: <span className="text-primary-400">{entityName}</span>
              </h3>
            </div>
            <p className="text-xs text-neutral-400 font-medium">
              Filtered requests associated with {entityName}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => alert(`Exporting audit log CSV for ${entityName}...`)}
              className="h-8 px-3 text-xs bg-neutral-900 border-neutral-700 text-neutral-200 hover:bg-neutral-800"
            >
              <Download className="w-3.5 h-3.5 mr-1.5" />
              Export CSV
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Audit Log Header Strip */}
        <div className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-600 dark:text-neutral-400">
          <span>Showing {logs.length} matching request log records</span>
          <span className="font-mono text-[11px] text-neutral-400">Org: Acme Health · Gateway Log Audit</span>
        </div>

        {/* Table Body */}
        <div className="p-4 overflow-y-auto custom-scrollbar flex-1 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-800 text-[10px] tracking-wider font-extrabold text-neutral-500 dark:text-neutral-400 bg-neutral-50/50 dark:bg-neutral-950/40">
                  <th className="p-3">Request ID / Time</th>
                  <th className="p-3">Team & User</th>
                  <th className="p-3">Virtual Key</th>
                  <th className="p-3">Model & Provider</th>
                  <th className="p-3">Tokens In/Out</th>
                  <th className="p-3">Latency</th>
                  <th className="p-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 font-medium text-neutral-800 dark:text-neutral-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-950/50 transition-colors">
                    <td className="p-3 font-mono text-xs">
                      <div className="font-bold text-neutral-900 dark:text-white">{log.id}</div>
                      <div className="text-[10px] text-neutral-400">{log.timestamp}</div>
                    </td>
                    <td className="p-3 text-xs">{log.teamAndUser}</td>
                    <td className="p-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{log.virtualKey}</td>
                    <td className="p-3 text-xs font-semibold text-primary-600 dark:text-primary-400">{log.modelAndProvider}</td>
                    <td className="p-3 font-mono text-[11px]">
                      {log.tokensIn.toLocaleString()} in / {log.tokensOut.toLocaleString()} out
                    </td>
                    <td className="p-3 font-mono text-xs text-neutral-600 dark:text-neutral-400">{log.latencyMs}ms</td>
                    <td className="p-3 text-right">
                      {log.status === "SUCCESS" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3 h-3" />
                          SUCCESS
                        </span>
                      ) : (
                        <div className="inline-flex flex-col items-end">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                            <AlertTriangle className="w-3 h-3" />
                            FAILED
                          </span>
                          {log.errorCode && (
                            <span className="text-[9px] font-mono text-rose-500 mt-0.5">{log.errorCode}</span>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="text-neutral-500 font-medium">Filtered by Organization Admin parameters</span>
          <Button
            size="sm"
            onClick={onClose}
            className="h-8 px-4 bg-neutral-900 hover:bg-black text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 font-semibold"
          >
            Close Log Inspector
          </Button>
        </div>
      </div>
    </div>
  );
};
