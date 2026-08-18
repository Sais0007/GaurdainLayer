import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Clock,
  Plane,
  Palette,
  Layers,
  Calendar,
  Map,
  LogIn,
  ShieldCheck,
  Cpu,
} from "lucide-react";

export interface SubMenuItem {
  id: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: any;
  onClick?: () => void;
  active?: boolean;
  subItems?: SubMenuItem[];
}

export const getNavigationData = (
  currentPage: string = "directory",
  onNavigate: (pageId: string) => void = () => {},
): MenuItem[] => {
  return [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      onClick: () => onNavigate("dashboard"),
      active: currentPage === "dashboard",
    },
    {
      id: "access-control",
      label: "Access Control",
      icon: ShieldCheck,
      subItems: [
        {
          id: "teams",
          label: "Teams",
          onClick: () => onNavigate("teams"),
          active: currentPage === "teams",
        },
        {
          id: "internal-users",
          label: "Users",
          onClick: () => onNavigate("internal-users"),
          active: currentPage === "internal-users",
        },
      ],
    },
    {
      id: "ai-gateway",
      label: "AI Gateway",
      icon: Cpu,
      subItems: [
        {
          id: "security-monitoring",
          label: "Security Monitoring",
          onClick: () => onNavigate("security-monitoring"),
          active: currentPage === "security-monitoring",
        },
        {
          id: "policies",
          label: "Policies",
          onClick: () => onNavigate("policies"),
          active: currentPage === "policies",
        },
        {
          id: "guardrails",
          label: "Guardrails",
          onClick: () => onNavigate("guardrails"),
          active: currentPage === "guardrails",
        },
        {
          id: "virtual-key",
          label: "Virtual Key",
          onClick: () => onNavigate("virtual-key"),
          active: currentPage === "virtual-key",
        },
        {
          id: "credentials-management",
          label: "Credentials Management",
          onClick: () => onNavigate("credentials-management"),
          active: currentPage === "credentials-management",
        },
        {
          id: "model-management",
          label: "Model Management",
          onClick: () => onNavigate("model-management"),
          active: currentPage === "model-management",
        },
        {
          id: "playground",
          label: "Playground",
          onClick: () => onNavigate("playground"),
          active: currentPage === "playground",
        },
      ],
    },
    {
      id: "logs-group",
      label: "Logs",
      icon: FileText,
      subItems: [
        {
          id: "request-log",
          label: "Request Log",
          onClick: () => onNavigate("request-log"),
          active: currentPage === "request-log" || currentPage === "request-logs" || currentPage === "logs",
        },
        {
          id: "audit-log",
          label: "Audit Log",
          onClick: () => onNavigate("audit-log"),
          active: currentPage === "audit-log" || currentPage === "audit-logs",
        },
      ],
    },
  ];
};
