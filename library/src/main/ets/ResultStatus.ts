// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

export class ResultStatus {
  // 错误消息
  static ERROR_INFO: number = 0;
  // 运行成功
  static PARSER_OK: number = 1;
  // 内存分配异常
  static NO_MEM_ERR: number = 2;
  // 普通语法错误
  static SYNTAX_ERR: number = 3;
  // 未找到此指令
  static NO_Exp_ERR: number = 4;
  // 缺少关系
  static NO_LNK_ERR: number = 5;
  // 缺少箭头
  static NO_ARROW_ERR: number = 6;
  // 关系双箭头错误
  static DOU_ARROW_ERR: number = 7;
  // 缺少头节点
  static NO_HEAD_ERR: number = 8;
  // 缺少尾结点
  static NO_TAIL_ERR: number = 9;
  // 必须是字母数字下划线
  static CHAR_NUM_UL_ERR: number = 10;
  // 不是模式表达式
  static NOT_PATTERN_ERR: number = 11;
  // 变量已被使用
  static DUP_VAR_NM_ERR: number = 12;
  // 数组中含有不相同的类型
  static NO_SM_TYPE_ERR: number = 13;
  // 不支持的数据类型
  static NO_SUP_TYPE: number = 14;
  // 指令搭配错误
  static WRON_EXP: number = 15;
  // 暂不支持的指令
  static NOT_SUPPORT: number = 16;
  // where 语句语法
  static WHERE_SYN_ERR: number = 17;
  // where 运算语法
  static WHERE_RUN_ERR: number = 18;
  // 未找到变量
  static NO_VAR_ERR: number = 19;
  // 缺失配对括号
  static NO_PAIR_BRK: number = 20;
  // 删除带有关边的节点
  static CLIST_HAS_LINK_ERR: number = 21;
  // 数据操作错误
  static CLIST_OPR_ERR: number = 22;
  // order by 语句语法
  static ORDER_BY_SYN_ERR: number = 23;
  // 不可删除路径
  static DEL_PATH_ERR: number = 24;
  // 未定义的变量
  static UNDEFINED_VAR_ERR: number = 25;
  // where 模式条件，独立连通图缺少变量
  static WHERE_PTN_NO_VAR_ERR: number = 26;
  // 不支持的存储过程
  static NO_PROC_ERR: number = 27;
  // csv 文件读取错误
  static CSV_FILE_ERR: number = 28;
  // csv 变量属性名在列中未找到
  static CSV_ROW_VAR_ERR: number = 29;
  // 查询过载超时
  static QUREY_TIMEOUT_ERR: number = 30;
}
