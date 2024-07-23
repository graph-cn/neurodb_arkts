// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

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
