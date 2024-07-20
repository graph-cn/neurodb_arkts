import hilog from '@ohos.hilog';
import { NeuroDBDriver } from 'neurodb_arkts';

@Entry
@Component
struct Index {
  @State message: string = 'Hello World'
  driver: NeuroDBDriver = new NeuroDBDriver();

  build() {
    Row() {
      Column() {
        Text(this.message)
          .fontSize(30)
          .fontWeight(FontWeight.Bold)
          .onClick(async () => {
            try {
              let rs = await this.driver.executeQuery("match (n)-[r]-(m) return n,r,m")
              this.message = JSON.stringify(rs)
            } catch (e) {
              console.error(e.msg);
            }
          })
      }
      .width('100%')
    }
    .height('100%')
  }
}