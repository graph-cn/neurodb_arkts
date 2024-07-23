// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

import { RecordSet } from './RecordSet';
export class ResultSet {
  status = 0;
  cursor = 0;
  results = 0;
  addNodes = 0;
  addLinks = 0;
  modifyNodes = 0;
  modifyLinks = 0;
  deleteNodes = 0;
  deleteLinks = 0;
  msg: string = null;
  recordSet: RecordSet = null;
}
