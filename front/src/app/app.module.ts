import { HttpClientModule } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { NbThemeModule } from '@nebular/theme'
import { AngularWebStorageModule } from 'angular-web-storage'
import { NgxUiLoaderModule } from 'ngx-ui-loader'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { GeneratedApiModule } from './core/api/generated-api.module'
import { CustomTranslateModule } from './core/translate/custom-translate.module'
import { UserViewModule } from './features/user-view/user-view.module'

@NgModule({
  declarations: [AppComponent],
  imports: [
    AngularWebStorageModule,
    CustomTranslateModule.forRoot(),
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    UserViewModule,
    HttpClientModule,
    NgxUiLoaderModule,
    GeneratedApiModule,
    NbThemeModule.forRoot({ name: 'dark' })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
