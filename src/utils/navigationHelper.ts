import { useLanguage } from "../i18n/LanguageContext";
import { getNavigationData, MenuItem, SubMenuItem } from "../mockAPI/navigationData";

export interface BreadcrumbStep {
  label: string;
  pageId?: string;
  onClick?: () => void;
  current?: boolean;
}

export function useNavigationHelper() {
  const { t } = useLanguage();

  // Unified translation mapping for page names matching the Sidebar exactly
  const pageLabelMap: Record<string, string> = {
    "dashboard": t.nav.dashboard,
    "site-map": t.nav.siteMap,
    "ui-kit": t.nav.uiKit,
    "sample-design": t.nav.samplePage,
    "user-management": t.nav.users,
    "role-management": t.nav.roleManagement,
    "event-management": t.nav.events,
    "country": t.nav.country,
    "state": t.nav.state,
    "city": t.nav.city,
    "static-pages": t.nav.staticPages,
    "email-templates": t.nav.emailTemplates,
    "system-notifications": t.nav.systemNotifications,
    "system-settings": t.nav.systemSettings,
    "logs": t.nav.logs,
    "user-management-group": t.nav.userManagement,
    "event-management-group": t.nav.eventManagement,
    "organisational-master": t.nav.organisationalMaster,
    "configurations-group": t.nav.configurations,
    "logs-group": t.nav.logs,
    "hb-templates": t.nav.hbTemplates,
  };

  const getPageLabel = (pageId: string, fallback: string = ""): string => {
    return pageLabelMap[pageId] ?? fallback;
  };

  const getSingularName = (pageId: string): string => {
    const singularMap: Record<string, string> = {
      "user-management": "User",
      "role-management": "Role",
      "country": "Country",
      "state": "State",
      "city": "City",
      "event-management": "Event",
      "email-templates": "Email Template",
      "static-pages": "Page",
      "system-notifications": "Notification",
      "logs": "Log",
      "ui-kit": "UI Kit",
      "sample-design": "Employee"
    };
    return singularMap[pageId] ?? "Item";
  };

  /**
   * Generates localized hierarchy breadcrumb steps dynamically based on routing state.
   */
  const getDynamicBreadcrumbs = (
    pageId: string,
    action?: 'list' | 'add' | 'edit' | 'view' | 'detail' | 'history' | 'import' | 'export' | 'settings' | 'clone' | 'audit-logs',
    itemName?: string,
    onNavigate?: (pageId: string) => void,
    onViewClick?: () => void
  ): BreadcrumbStep[] => {
    const steps: BreadcrumbStep[] = [
      {
        label: t.nav.siteMap ?? "Site Map",
        pageId: "site-map",
        onClick: onNavigate ? () => onNavigate("site-map") : undefined
      }
    ];

    if (pageId === "site-map") {
      return [
        {
          label: t.nav.siteMap ?? "Site Map",
          current: true
        }
      ];
    }

    const navTree = getNavigationData(pageId, () => {});
    let foundGroup: MenuItem | null = null;
    let foundItem: SubMenuItem | MenuItem | null = null;

    for (const item of navTree) {
      if (item.id === pageId || (pageId === "logs" && item.id === "logs-group")) {
        foundItem = item;
        break;
      }
      if (item.subItems) {
        const sub = item.subItems.find(s => s.id === pageId);
        if (sub) {
          foundGroup = item;
          foundItem = sub;
          break;
        }
      }
    }

    // 1. Group level (e.g. Master Management, Configurations, User Management)
    // Non-clickable per guidelines: "Parent module labels ... are organizational categories and should not be clickable."
    if (foundGroup) {
      const groupLabel = pageLabelMap[foundGroup.id] ?? foundGroup.label;
      steps.push({
        label: groupLabel
      });
    }

    // 2. Listing level or Current Action
    if (foundItem) {
      const itemLabel = pageLabelMap[foundItem.id] ?? foundItem.label;
      if (!action || action === 'list') {
        steps.push({
          label: itemLabel,
          current: true
        });
      } else {
        steps.push({
          label: itemLabel,
          pageId: pageId,
          onClick: onNavigate ? () => onNavigate(pageId) : undefined
        });

        // 3. Leaf Action screen (e.g. Edit User, View Template)
        const singular = getSingularName(pageId);

        if (action === 'edit' || action === 'clone') {
          // View screen in path must be clickable
          steps.push({
            label: `View ${singular}`,
            onClick: onViewClick
          });
          steps.push({
            label: action === 'edit' ? `Edit ${singular}` : `Clone ${singular}`,
            current: true
          });
        } else {
          let actionLabel = "";
          switch (action) {
            case 'add':
              actionLabel = `Add ${singular}`;
              break;
            case 'view':
            case 'detail':
              actionLabel = `View ${singular}`;
              break;
            case 'history':
              actionLabel = `${singular} History`;
              break;
            case 'import':
              actionLabel = `Import ${singular}`;
              break;
            case 'export':
              actionLabel = `Export ${singular}`;
              break;
            case 'settings':
              actionLabel = `${singular} Settings`;
              break;
            case 'audit-logs':
              actionLabel = `Audit Logs`;
              break;
            default:
              actionLabel = action;
              break;
          }

          steps.push({
            label: actionLabel,
            current: true
          });
        }
      }
    }

    return steps;
  };

  return {
    getPageLabel,
    getSingularName,
    getDynamicBreadcrumbs,
  };
}
