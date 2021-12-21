import { HttpClient } from '@angular/common/http'
import { NgModule } from '@angular/core'
import { TranslateLoader, TranslateModule } from '@ngx-translate/core'
import { TranslateHttpLoader } from '@ngx-translate/http-loader'
import { CustomTranslateService } from './custom-translate.service'

@NgModule({
  declarations: [],
  imports: [],
  providers: [CustomTranslateService]
})
export class CustomTranslateModule {
  public static forRoot() {
    return TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient): TranslateLoader => {
          return new TranslateHttpLoader(http, './assets/locale/', '.json')
        },
        deps: [HttpClient]
      },
      useDefaultLang: false
    })
  }
}
