import { Component } from '@angular/core'
import { NgxUiLoaderService } from 'ngx-ui-loader'
import { CONTACTS, ELBRUS_PENDANT_LINKS } from '../../../../config'

@Component({
  selector: 'app-page-elbrus-pendant',
  templateUrl: './page-elbrus-pendant.component.html',
  styleUrls: ['./page-elbrus-pendant.component.scss']
})
export class PageElbrusPendantComponent {
  public contacts = CONTACTS

  public videoUrl = ELBRUS_PENDANT_LINKS.promoVideo

  constructor(private ngxService: NgxUiLoaderService) {}

  ngOnInit() {
    this.ngxService.start()
  }

  public onLoadVideo() {
    this.ngxService.stop()
  }
}
