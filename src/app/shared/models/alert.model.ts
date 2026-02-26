import { Severity } from "@enums/severity";

export interface AlertCardProps {
  title: string;
  description?: string;
  severity: Severity;
  count: number;
}
