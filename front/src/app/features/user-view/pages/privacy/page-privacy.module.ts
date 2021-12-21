import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { PagePrivacyComponent } from './page-privacy.component'

@NgModule({
  declarations: [PagePrivacyComponent],
  imports: [RouterModule, TranslateModule, CommonModule],
  exports: [],
  providers: []
})
export class PagePrivacyModule {}
