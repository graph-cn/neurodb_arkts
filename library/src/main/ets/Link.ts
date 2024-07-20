import { ColVal } from './ColVal';
export class Link {
  id: number;
  startNodeId: number;
  endNodeId: number;

  type: string;
  properties: Map<string, ColVal>;

  constructor(id: number, startNodeId: number, endNodeId: number, type: string, properties: Map<string, ColVal>) {
    this.id = id;
    this.startNodeId = startNodeId;
    this.endNodeId = endNodeId;
    this.type = type;
    this.properties = properties;
  }
}
