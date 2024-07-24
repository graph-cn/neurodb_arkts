// Copyright (c) 2024- All neurodb_arkts authors. All rights reserved.
//
// This source code is licensed under Apache 2.0 License.

import { NeuroDBDriver, ResultSet } from '@graph-cn/neurodb_arkts';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'
  driver: NeuroDBDriver = new NeuroDBDriver({address: '172.20.0.234', port: 8839, family: 1});
  script: string = 'MATCH (n)-[r]->(m) RETURN n, r, m'

  build() {
    Column({space: 0}) {
      TextInput({ text: this.script })
        .onChange(v => this.script = v)
        .margin(10)
        .flexGrow(1)
      Button('运行', { type: ButtonType.Capsule, stateEffect: true }).backgroundColor(0x317aff).width(90)
        .onClick(async () => {
          try {
            let rs: ResultSet = await this.driver.executeQuery(this.script)
            this.message = JSON.stringify(rs)
            console.info(this.message)
          } catch (e) {
            console.error(e);
          }
        })
      Scroll() {
        Text(this.message)
          .fontSize(30)
      }
      .flexGrow(1)
    }
    .width('100%')
  }
}