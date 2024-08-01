
<h1 align="center"> NeuroDB ArkTS Driver </h1>
<p align="center">
  <a title="三方库" href="https://ohpm.openharmony.cn/#/cn/detail/@graph-cn%2Fneurodb_arkts" >
      <img src="https://img.shields.io/badge/三方库-v1.0.0-red?style=popout" />
  </a>
  <a href="https://github.com/graph-cn/neurodb_arkts/stargazers">
      <img src="https://img.shields.io/github/stars/graph-cn/neurodb_arkts" alt="GitHub stars" />
  </a>
  <a href="https://github.com/graph-cn/neurodb_arkts/network/members">
      <img src="https://img.shields.io/github/forks/graph-cn/neurodb_arkts" alt="GitHub forks" />
  </a>
</p>

<p align="center">NeuroDB 的 ArkTS 实现</p>

---

## 如何使用：

### 数据库安装

下载地址：https://neurodb.org/zh/download.html

```shell
ohpm i @graph-cn/neurodb_arkts
```

### 示例

```extendtypescript
import { NeuroDBDriver } from '@graph-cn/neurodb_arkts';

// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

function test() {
  try {
    let driver: NeuroDBDriver = new NeuroDBDriver({address: '172.20.0.234', port: 8839, family: 1});
    let rs = await this.driver.executeQuery('MATCH (n)-[r]->(m) RETURN n, r, m')
    let rsJson = JSON.stringify(rs)
    console.info(rsJson)
  } catch (e) {
    console.error(e)
  }
}
```

### 权限

```json
{
  "requestPermissions": [
    {
      "name": "ohos.permission.INTERNET"
    }
  ],
}
```


## 开源协议

项目遵循 [Apache License, Version 2.0, January 2004](https://www.apache.org/licenses/LICENSE-2.0) 开源协议。