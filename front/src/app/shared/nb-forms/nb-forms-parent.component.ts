import { Component, Input } from '@angular/core'
import { NgModel } from '@angular/forms'
import _ from 'lodash'

@Component({
  template: ''
})
export class NbFormsParentComponent {
  public id = ''
  public element: NgModel

  @Input()
  public name = ''

  @Input()
  public title = ''

  @Input()
  public required = false

  public ngOnInit() {
    this.id = _.uniqueId(`${(this.name || 'nb').toLowerCase()}_`)
  }

  public getValue(): any {
    return ''
  }
}
