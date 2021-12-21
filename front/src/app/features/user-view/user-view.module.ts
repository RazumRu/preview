import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { FooterComponent } from './components/footer/component-footer.component'
import { PageElbrusPendantModule } from './pages/elbrus-pendant/page-elbrus-pendant.module'
import { PageMainModule } from './pages/main/page-main.module'
import { PagePrivacyModule } from './pages/privacy/page-privacy.module'
import { UserViewComponent } from './user-view.component'

@NgModule({
  declarations: [FooterComponent, UserViewComponent],
  imports: [
    PageMainModule,
    TranslateModule,
    CommonModule,
    RouterModule,
    PagePrivacyModule,
    PageElbrusPendantModule
  ],
  providers: [],
  bootstrap: [UserViewComponent]
})
export class UserViewModule {}
