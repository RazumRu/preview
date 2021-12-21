import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NgxUiLoaderModule } from 'ngx-ui-loader'
import { PageElbrusPendantCodeComponent } from './code/page-elbrus-pendant-code.component'
import { PageElbrusPendantComponent } from './page-elbrus-pendant.component'

@NgModule({
  declarations: [PageElbrusPendantComponent, PageElbrusPendantCodeComponent],
  imports: [RouterModule, TranslateModule, CommonModule, NgxUiLoaderModule],
  exports: [],
  providers: []
})
export class PageElbrusPendantModule {}
