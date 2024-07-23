// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

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
