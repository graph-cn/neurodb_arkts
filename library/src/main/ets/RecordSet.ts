import { ColVal } from './ColVal';
import { Link } from './Link';
import { Node } from './Node';
export class RecordSet {
  labels: Array<string>;
  types: Array<string>;
  keyNames: Array<string>;
  nodes: Array<Node>;
  links: Array<Link>;
  records: Array<Array<ColVal>>;

  constructor() {
    this.nodes = <Node[]>[];
    this.links = <Link[]>[];
    this.records = <Array<Array<ColVal>>>[];
  }
}
