import { Component } from '@angular/core'
import { CONTACTS, SITE } from '../../../../config'

@Component({
  selector: 'app-page-privacy',
  templateUrl: './page-privacy.component.html',
  styleUrls: ['./page-privacy.component.scss']
})
export class PagePrivacyComponent {
  public site = SITE

  public contacts = CONTACTS
}
