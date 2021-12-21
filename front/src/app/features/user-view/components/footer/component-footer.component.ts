import { Component } from '@angular/core'
import { CONTACTS } from '../../../../config'
import { CustomTranslateService } from '../../../../core/translate/custom-translate.service'

@Component({
  selector: 'app-component-footer',
  templateUrl: './component-footer.component.html',
  styleUrls: ['./component-footer.component.scss']
})
export class FooterComponent {
  public menuDocuments = [
    {
      url: '/privacy',
      title: 'menu.privacy'
    }
  ]

  public menu = [
    {
      url: '/elbrus-pendant',
      title: 'menu.elbrus-pendant'
    },
    {
      url: '/quest',
      title: 'menu.quest'
    }
  ]

  public contacts = CONTACTS

  constructor(private customTranslateService: CustomTranslateService) {}

  public get lang() {
    return this.customTranslateService.lang
  }

  public changeLang() {
    const lang = this.lang

    if (lang === this.customTranslateService.LANG.EN) {
      this.customTranslateService.setLang(this.customTranslateService.LANG.RU)
    } else {
      this.customTranslateService.setLang(this.customTranslateService.LANG.EN)
    }
  }
}
