import { Component } from '@angular/core'
import { ELBRUS_PENDANT_LINKS } from '../../../../../config'

@Component({
  selector: 'app-page-elbrus-pendant-code',
  templateUrl: './page-elbrus-pendant-code.component.html',
  styleUrls: ['./page-elbrus-pendant-code.component.scss']
})
export class PageElbrusPendantCodeComponent {
  public promoVideoUrl = ELBRUS_PENDANT_LINKS.promoVideo
}
