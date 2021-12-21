import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { NotFoundComponent } from './features/not-found/not-found.component'
import { PageElbrusPendantCodeComponent } from './features/user-view/pages/elbrus-pendant/code/page-elbrus-pendant-code.component'
import { PageElbrusPendantComponent } from './features/user-view/pages/elbrus-pendant/page-elbrus-pendant.component'
import { PageMainComponent } from './features/user-view/pages/main/page-main.component'
import { PagePrivacyComponent } from './features/user-view/pages/privacy/page-privacy.component'
import { UserViewComponent } from './features/user-view/user-view.component'

const routes: Routes = [
  {
    path: '',
    component: UserViewComponent,
    children: [
      {
        path: '',
        component: PageMainComponent
      },
      {
        path: 'elbrus-pendant',
        component: PageElbrusPendantComponent
      },
      {
        path: 'elbrus-pendant/code',
        component: PageElbrusPendantCodeComponent
      },
      {
        path: 'privacy',
        component: PagePrivacyComponent
      }
    ]
  },
  { path: '**', component: NotFoundComponent }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
