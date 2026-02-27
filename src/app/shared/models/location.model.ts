export interface Location {
  id: string;
  name: string;
  type: string;
  childs?: Location[];
}
