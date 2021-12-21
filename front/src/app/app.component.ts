import { Component } from '@angular/core'
import { CustomTranslateService } from './core/translate/custom-translate.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private customTranslateService: CustomTranslateService) {
    customTranslateService.init()
  }
}
