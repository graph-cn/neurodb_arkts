// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

import { Link } from './Link';
import { Node } from './Node';
export class ColVal {

  val: number | number[] | string | string[] | Node | Link | Array<Object>;
  type: number;
  aryLen: number = 8;

  getNum() : number {
    return parseFloat(this.val as string);
  }

  getNumArray() : number[] {
    return this.val as number[];
  }

  getString() : string {
    return this.val.toString();
  }

  getStringArray() : string[] {
    return this.val as string[];
  }

  getNode() : Node {
    return this.val as Node;
  }

  getLink() : Link {
    return this.val as Link;
  }

  getPath(): Array<Object> {
    return this.val as Array<Object>;
  }
}
