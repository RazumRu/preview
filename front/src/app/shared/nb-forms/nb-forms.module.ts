import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import {
  NbAlertModule,
  NbButtonModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule
} from '@nebular/theme'
import { TranslateModule } from '@ngx-translate/core'
import { NotFoundModule } from '../../features/not-found/not-found.module'
import { NbFormsInputComponent } from './input/nb-forms-input.component'
import { NbFormsParentComponent } from './nb-forms-parent.component'
import { NbFormsComponent } from './nb-forms.component'

@NgModule({
  declarations: [
    NbFormsComponent,
    NbFormsInputComponent,
    NbFormsParentComponent
  ],
  imports: [
    TranslateModule,
    CommonModule,
    RouterModule,
    NbButtonModule,
    FormsModule,
    NbAlertModule,
    NbInputModule,
    NbFormFieldModule,
    NbIconModule,
    NotFoundModule
  ],
  providers: [],
  bootstrap: [],
  exports: [NbFormsComponent, NbFormsInputComponent]
})
export class NbFormsModule {}
