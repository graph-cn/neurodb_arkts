import { ColVal } from './ColVal';
export class Node {
  id: number;
  labels: Array<string>;
  properties: Map<string, ColVal>;

  constructor(id: number, labels: Array<string>, properties: Map<string, ColVal>) {
    this.id = id;
    this.labels = labels;
    this.properties = properties;
  }
}
