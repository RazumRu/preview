import { Component, Input, ViewChild } from '@angular/core'
import { NgModel } from '@angular/forms'
import { NbFormsParentComponent } from '../nb-forms-parent.component'

@Component({
  selector: 'app-nb-form-input',
  templateUrl: './nb-forms-input.component.html',
  styleUrls: ['./nb-forms-input.component.scss']
})
export class NbFormsInputComponent extends NbFormsParentComponent {
  public value = ''
  public _pattern = ''
  public showPassword = false

  @ViewChild('val') public element: NgModel

  @Input()
  public pattern = ''

  @Input()
  public format: 'email' | 'password' | undefined

  get type() {
    if (this.format === 'password') {
      return this.showPassword ? 'text' : 'password'
    }

    return 'text'
  }

  public toggleShowPassword() {
    this.showPassword = !this.showPassword
  }

  public getValue() {
    return this.value
  }

  public ngOnInit() {
    super.ngOnInit()

    this.setupPattern()
  }

  private setupPattern() {
    if (this.pattern) {
      this._pattern = this.pattern
    } else if (this.format) {
      switch (this.format) {
        case 'email':
          this._pattern = '.+@.+\\..+'
          break
      }
    }
  }
}
