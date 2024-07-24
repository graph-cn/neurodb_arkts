// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

import socket from '@ohos.net.socket';
import { ColVal } from './ColVal';
import { Link } from './Link';
import { Node } from './Node';
import { ResultSet } from './ResultSet';
import buffer from '@ohos.buffer';
import { ResultStatus } from './ResultStatus';
import { RecordSet } from './RecordSet';
import { NeurodbType } from './NeurodbType';

export class NeuroDBDriver {
  socket: socket.TCPSocket;
  addr: socket.NetAddress;
  timeout: number = 6000
  onmessage: Promise<any>;

  constructor(addr: socket.NetAddress, timeout?: number) {
    // ip 使用数据库所在机器的ip
    this.addr = addr;
    this.timeout = timeout ?? this.timeout;
  }

  async open() {
    let _ = this;
    let tcp = socket.constructTCPSocketInstance();
    await tcp.connect({ address: _.addr, timeout: this.timeout});
    console.log('connect success')
    _.socket = tcp;
  }

  async close() {
    await this.socket?.close();
  }

  async executeQuery(query: string) : Promise<ResultSet> {
    let _ = this;
    try {
      if (!_.socket) await _.open()
      let onmessage = new Promise((resolve, reject) => {
        _.socket.on('message', resolve);
        _.socket.on('error', (e) => {
          reject(e);
        });
        _.socket.on('close', () => {
          _.socket = null
        })
      })
      await _.socket.send({data: query})
      let result = await onmessage;
      let buf = ((result as any).message as ArrayBuffer)
      console.info(buf.byteLength.toString())
      return _.deserializeReturnData(buf)
    } catch (e) {
      await _.close();
      throw e;
    }
  }

  /**
   * Get node by id from RecordSet which cached in [deserializeReturnData].
   *
   * 从 [deserializeReturnData] 中缓存的RecordSet中根据id获取节点。
   */
  getNodeById(nodes: Array<Node>, id: number) : Node{
    for (var i = 0; i < nodes.length; i++) {
      if (nodes[i].id == id) {
        return nodes[i];
      }
    }
    return null;
  }

  /**
   * Get link by id from RecordSet which cached in [deserializeReturnData].
   *
   * 从 [deserializeReturnData] 中缓存的RecordSet中根据id获取关系。
   */
  getLinkById(links: Array<Link>, id: number) : Link {
    for (var i = 0; i < links.length; i++) {
      if (links[i].id == id) {
        return links[i];
      }
    }
    return null;
  }

  deserializeReturnData(body: ArrayBuffer) : ResultSet {
    let rs = new ResultSet()
    let buf = buffer.from(body, 0, body.byteLength);
    let type = String.fromCharCode(buf.readInt8())
    let cur = [1];
    switch (type) {
      case '@': // 返回的值只有一个成功执行状态位
        rs.status = ResultStatus.PARSER_OK;
        break;
      case '$': // 返回的值包含错误消息的报错数据包
        rs.status = ResultStatus.ERROR_INFO;
        rs.msg = readLine(buf, cur)
        break;
      case '#': // 返回的是包含正常消息的消息数据包
        rs.status = ResultStatus.PARSER_OK;
        let msgLen = rs.msg = readLine(buf, cur)
        let len = parseInt(msgLen);
        rs.msg = readString(buf, cur[0], len)
        cur[0] = cur[0] + len;
        break;
      case '*': // 返回的是图查询结果数据包
        let line: string = readLine(buf, cur);
        let head = line.split(',');
        rs.status = parseInt(head[0])
        rs.cursor = parseInt(head[1])
        rs.results = parseInt(head[2])
        rs.addNodes = parseInt(head[3])
        rs.addLinks = parseInt(head[4])
        rs.modifyNodes = parseInt(head[5])
        rs.modifyLinks = parseInt(head[6])
        rs.deleteNodes = parseInt(head[7])
        rs.deleteLinks = parseInt(head[8])

        if (rs.results > 0) {
          let bodyLen = parseInt(head[9])
          buf = buf.subarray(cur[0], cur[0] + bodyLen)
          let recordSet: RecordSet = this.deserializeRecordSet(buf)
          rs.recordSet = recordSet;
        }
        break;
      defalut:
        throw new Error('reply type error')
    }
    return rs;
  }

  deserializeRecordSet(body: buffer.Buffer) : RecordSet {
    let cursor = new StringCur(body);
    let rd = new RecordSet();
    if (deserializeType(cursor) != NeurodbType.RETURNDATA) {
      throw 'Error Type';
    }
    rd.labels = deserializeStringList(cursor);
    rd.types = deserializeStringList(cursor);
    rd.keyNames = deserializeStringList(cursor);
    /*读取节点列表*/
    if (deserializeType(cursor) != NeurodbType.NODES) {
      throw 'Error Type';
    }
    let cnt_nodes = deserializeUint(cursor);
    for (let i = 0; i < cnt_nodes; i++) {
      rd.nodes.push(deserializeCNode(cursor, rd.labels, rd.keyNames));
    }
    /*读取连线列表*/
    if (deserializeType(cursor)!= NeurodbType.LINKS) {
      throw 'Error Type';
    }
    let cnt_links = deserializeUint(cursor);
    for (let i = 0; i < cnt_links; i++) {
      rd.links.push(deserializeCLink(cursor, rd.types, rd.keyNames));
    }
    /*读取记录列表*/
    if (deserializeType(cursor) != NeurodbType.RECORDS) {
      throw 'Error Type';
    }
    let cnt_records = deserializeUint(cursor);
    for (let i = 0; i < cnt_records; i++) {
      let type, cnt_column;
      if (deserializeType(cursor) != NeurodbType.RECORD) {
        throw 'Error Type';
      }
      cnt_column = deserializeUint(cursor)
      let record: Array<ColVal> = [];
      for (let j = 0; j < cnt_column; j ++) {
        let aryLen = 0;
        type = deserializeType(cursor);
        let val = new ColVal();
        if (type == NeurodbType.NIL) {}
        else if (type == NeurodbType.VO_NODE) {
          let id = deserializeUint(cursor)
          let n = rd.nodes.find(item => item.id == id)
          val.val = n;
        } else if (type == NeurodbType.VO_LINK) {
          let id = deserializeUint(cursor)
          let l = rd.links.find(item => item.id == id)
          val.val = l;
        } else if (type == NeurodbType.VO_PATH) {
          let len = deserializeUint(cursor)
          let path = [];
          for (let k = 0; k < len; k++) {
            let id = deserializeUint(cursor)
            if (k % 2 == 0) {
              let nd = rd.nodes.find(item => item.id)
              path.push(nd);
            } else {
              let lk = rd.links.find(item => item.id == id)
              path.push(lk);
            }
          }
          val.val = path;
        } else if (type == NeurodbType.VO_STRING) {
          val.val = deserializeString(cursor);
        } else if (type == NeurodbType.VO_NUM) {
          let num = deserializeString(cursor);
          val.val = parseFloat(num);
        } else if (type == NeurodbType.VO_STRING_ARRY) {
          aryLen = deserializeUint(cursor);
          let valAry = [];
          for (let k = 0; k < aryLen; k++) {
            let str = deserializeString(cursor)
            valAry.push(str);
          }
          val.val = valAry;
        } else if (type == NeurodbType.VO_NUM_ARRY) {
          aryLen = deserializeUint(cursor);
          let valAry = [];
          for (let k = 0; k < aryLen; k++) {
            let num = deserializeString(cursor);
            valAry.push(parseFloat(num));
          }
          val.val = valAry;
        } else {
          throw 'Error Type';
        }
        record.push(val);
      }
      rd.records.push(record);
    }
    /*读取结束标志*/
    if (deserializeType(cursor) != NeurodbType.EOF)
      throw "Error Type";
    return rd;
  }
}

function deserializeType(cur: StringCur) {
  return cur.getType();
}

function deserializeUint(cur: StringCur): number {
  let buf = [0,0,0];
  buf[0] = cur.get(1).charCodeAt(0);;
  buf[1] = cur.get(1).charCodeAt(0);;
  buf[2] = cur.get(1).charCodeAt(0);;
  return (buf[0]&0x7f)<<14|(buf[1]&0x7f)<<7|buf[2];
}

function deserializeString(cur: StringCur): string {
  let len = deserializeUint(cur);
  return cur.get(len);
}

function deserializeStringList(cur: StringCur): Array<string> {
  let listlen = deserializeUint(cur);
  let l = [];
  while (listlen-- > 0) {
    let s = deserializeString(cur);
    l.push(s);
  }
  return l;
}

function deserializeLabels(cur: StringCur, labelList: Array<any>): Array<string> {
  let listlen = deserializeUint(cur);
  let l = [];
  while (listlen-- > 0) {
    let i = deserializeUint(cur);
    l.push(labelList[i]);
  }
  return l;
}

function deserializeKVList(cur: StringCur, keyNames: Array<string>): Map<string, ColVal> {
  let listlen = deserializeUint(cur);
  let properties = new Map<string, ColVal>();
  while (listlen-- > 0) {
    let index = deserializeUint(cur);
    let key = keyNames[index];
    let type = deserializeUint(cur);
    let aryLen = 0;
    let val = new ColVal();
    if (type == NeurodbType.VO_STRING) {
      val.val = deserializeString(cur);
    } else if (type == NeurodbType.VO_NUM) {
      let num = deserializeString(cur);
      val.val = parseFloat(num);
    } else if (type == NeurodbType.VO_STRING_ARRY) {
      aryLen = deserializeUint(cur);
      let valAry = [];
      for (let k = 0; k < aryLen; k++) {
        let str = deserializeString(cur)
        valAry.push(str);
      }
      val.val = valAry;
    } else if (type == NeurodbType.VO_NUM_ARRY) {
      aryLen = deserializeUint(cur);
      let valAry = [];
      for (let k = 0; k < aryLen; k++) {
        let doubleStr = deserializeString(cur);
        let doubleVal = parseFloat(doubleStr);
        valAry.push(doubleVal);
      }
      val.val = valAry;
    } else {
      throw "Error Type";
    }
    properties.set(key, val)
  }
  return properties;
}

function deserializeCNode(cur: StringCur, labels: Array<string>, keyNames: Array<string>) : Node {
  let id = deserializeUint(cur);
  let nlabels = deserializeLabels(cur, labels);
  let properties = deserializeKVList(cur, keyNames);
  return new Node(id, nlabels, properties)
}

function deserializeCLink(cur: StringCur, types: Array<string>, keyNames: Array<string>) : Link {
  let id = deserializeUint(cur);
  let hid = deserializeUint(cur);
  let tid = deserializeUint(cur);
  let ty = deserializeType(cur);
  let type = null;
  if (ty == NeurodbType.EXIST) {
    let typeIndex = deserializeUint(cur);
    type = types[typeIndex];
  } else if (ty == NeurodbType.NIL) {
  }
  let properties = deserializeKVList(cur, keyNames);
  let l = new Link(id, hid, tid, type, properties);
  return l;
}
function readLine(body: buffer.Buffer, cur: number[]) : string {
  let builder = '';
  while (cur[0] < body.length) {
    let c = String.fromCharCode(body.readInt8(cur[0]));
    cur[0] = cur[0] + 1;
    builder += c;
    if (c == '\n') {
      break;
    }
  }
  return builder.replace('\r\n', '');
}

function readString(buf: buffer.Buffer, offset: number, length: number): string {
  let sub = new Array(length)
  let subBuffer = buffer.from(sub)
  buf.copy(subBuffer, 0, offset, offset + length)
  let subStr = subBuffer.toString('utf8')
  return subStr
}

class StringCur {
  s: buffer.Buffer;
  cur: number;
  byteIndex: number;

  constructor(body: buffer.Buffer, cur: number = 0) {
    this.s = body;
    this.cur = cur;
    this.byteIndex = 0;
  }

  get(size: number) : string {
    if (size == 0) return '';
    let start = this.cur
    let sub = new Array(size)
    let subBuffer = buffer.from(sub)
    this.s.copy(subBuffer, 0, start, start + size)
    let subStr = subBuffer.toString('utf8')
    this.cur += size;
    return subStr;
  }

  getType() : number {
    let type = this.s.readInt8(this.cur)
    this.cur ++;
    return type;
  }
}