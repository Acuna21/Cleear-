import { Criticality } from "@enums/criticality";

export interface Report {
  titulo: string;
  usuario: string;
  criticidad: Criticality;
  progreso: number;
  tiempo: string;
}
