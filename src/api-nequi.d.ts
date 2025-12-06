export interface IData {
  page: Page;
  components: Component[];
  incidents: any[];
  scheduled_maintenances: any[];
  status: StatusClass;
}

export interface Component {
  id: string;
  name: string;
  status: StatusEnum;
  created_at: Date;
  updated_at: Date;
  position: number;
  description: null;
  showcase: boolean;
  start_date: Date | null;
  group_id: null | string;
  page_id: ID;
  group: boolean;
  only_show_if_degraded: boolean;
  components?: string[];
}

export type ID = "kp0nsmcjl5pg";

export type StatusEnum =
  | "operational"
  | "degraded_performance"
  | "partial_outage"
  | "major_outage"
  | "under_maintenance";

export interface Page {
  id: ID;
  name: string;
  url: string;
  time_zone: string;
  updated_at: Date;
}

export interface StatusClass {
  indicator: PageStatusEnum;
  description: string;
}

export type PageStatusEnum =
  | "none"
  | "minor"
  | "major"
  | "critical"
  | "maintenance";

export const ComponentStatusTranslations: Record<StatusEnum, string> = {
  operational: "✅ Operativo",
  degraded_performance: "⚠️ Desempeño degradado",
  partial_outage: "🔶 Interrupción parcial",
  major_outage: "🔴 Interrupción mayor",
  under_maintenance: "🔧 En mantenimiento",
};

export const PageStatusTranslations: Record<PageStatusEnum, string> = {
  none: "✅ Todos los sistemas operativos",
  minor: "⚠️ Problemas menores",
  major: "🔴 Interrupción mayor",
  critical: "🚨 Caída crítica",
  maintenance: "🔧 En mantenimiento",
};
