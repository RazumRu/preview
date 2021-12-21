import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { NotFoundComponent } from './not-found.component'

@NgModule({
  declarations: [NotFoundComponent],
  imports: [TranslateModule, CommonModule, RouterModule],
  providers: [],
  bootstrap: []
})
export class NotFoundModule {}
