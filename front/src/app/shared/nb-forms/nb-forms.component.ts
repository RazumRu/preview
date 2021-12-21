import {
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChild
} from '@angular/core'
import { NgForm } from '@angular/forms'
import { NbFormsInputComponent } from './input/nb-forms-input.component'
import { NbFormsParentComponent } from './nb-forms-parent.component'

@Component({
  selector: 'app-nb-form',
  templateUrl: './nb-forms.component.html',
  styleUrls: ['./nb-forms.component.scss']
})
export class NbFormsComponent {
  @Input()
  public errorMessage = ''

  @Input()
  public successMessage = ''

  @ViewChild(NgForm) public form: NgForm

  @ContentChildren(NbFormsInputComponent)
  public inputComponents: QueryList<NbFormsInputComponent>

  @Input()
  public buttonName = 'Submit'

  @Output()
  public sent = new EventEmitter<{ [key: string]: any }>()

  public get components(): NbFormsParentComponent[] {
    return [...this.inputComponents.toArray()]
  }

  public get submitted() {
    return !!(this.form?.submitted && !this.errorMessage)
  }

  public ngAfterViewInit(): void {
    this.components.forEach((c) => {
      this.form.addControl(c.element)
    })
  }

  public getValues() {
    return this.components.reduce((res: any, v: NbFormsParentComponent) => {
      res[v.name] = v.getValue()

      return res
    }, {})
  }

  public async submitForm() {
    const values = this.getValues()

    this.sent.emit(values)
  }
}
