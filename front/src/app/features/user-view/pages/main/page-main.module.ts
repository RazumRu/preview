import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { PageMainComponent } from './page-main.component'

@NgModule({
  declarations: [PageMainComponent],
  imports: [RouterModule, TranslateModule, CommonModule],
  exports: [],
  providers: []
})
export class PageMainModule {}
