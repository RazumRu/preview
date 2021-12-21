import { Injectable } from '@angular/core'
import { TranslateService } from '@ngx-translate/core'
import { LocalStorageService } from 'angular-web-storage'

@Injectable({
  providedIn: 'root'
})
export class CustomTranslateService {
  public LANG = {
    EN: 'en',
    RU: 'ru'
  }

  constructor(
    private translate: TranslateService,
    private local: LocalStorageService
  ) {
    //
  }

  public init() {
    const lang = this.local.get('lang') || this.LANG.RU
    this.translate.setDefaultLang(lang)
    this.translate.use(lang)
  }

  public setLang(lang: string) {
    this.local.set('lang', lang)
    this.init()
  }

  public get lang() {
    return this.translate.currentLang
  }
}
