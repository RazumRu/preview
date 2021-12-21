import { animate, state, style, transition, trigger } from '@angular/animations'
import { Component } from '@angular/core'
import { CONTACTS } from '../../../../config'
import { CustomTranslateService } from '../../../../core/translate/custom-translate.service'

@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.component.html',
  styleUrls: ['./page-main.component.scss'],
  animations: [
    trigger('step-1', [
      state(
        'opened-1',
        style({
          opacity: 1,
          left: 0
        })
      ),
      state(
        'opened-2',
        style({
          opacity: 1,
          left: 0
        })
      ),
      state(
        'opened-3',
        style({
          opacity: 1,
          left: 0
        })
      ),
      state(
        'opened-4',
        style({
          opacity: 1
        })
      ),
      state(
        'opened-5',
        style({
          opacity: 1
        })
      ),
      transition('void => opened-1', [animate('0.4s ease-out')]),
      transition('void => opened-2', [
        animate('0.4s ease-out'),
        animate('0.4s ease-out')
      ]),
      transition('void => opened-3', [
        animate('0.8s ease-out'),
        animate('0.3s ease-out')
      ]),
      transition('void => opened-4', [
        animate('1.2s ease-out'),
        animate('0.3s ease-out')
      ]),
      transition('void => opened-5', [
        animate('1.6s ease-out'),
        animate('0.3s ease-out')
      ])
    ]),
    trigger('step-2', [
      state(
        'opened-1',
        style({
          opacity: 1
        })
      ),
      state(
        'opened-2',
        style({
          opacity: 1
        })
      ),
      state(
        'opened-3',
        style({
          opacity: 1,
          left: 50
        })
      ),
      state(
        'opened-4',
        style({
          opacity: 1,
          right: 50
        })
      ),
      state(
        'opened-5',
        style({
          opacity: 1,
          marginTop: 20
        })
      ),
      transition('* => opened-1', [animate('0.4s ease-out')]),
      transition('* => opened-2', [
        animate('0.4s ease-out'),
        animate('0.4s ease-out')
      ]),
      transition('* => opened-3, * => opened-4', [
        animate('0.8s ease-out'),
        animate('0.4s ease-out')
      ]),
      transition('* => opened-5', [
        animate('1.2s ease-out'),
        animate('0.4s ease-out')
      ])
    ]),
    trigger('step-3', [
      state(
        'opened-1',
        style({
          opacity: 1
        })
      ),
      state(
        'opened-2',
        style({
          opacity: 1
        })
      ),
      state(
        'opened-3',
        style({
          opacity: 1,
          marginLeft: 0
        })
      ),
      state(
        'opened-4',
        style({
          opacity: 1,
          marginLeft: 0
        })
      ),
      state(
        'opened-5',
        style({
          opacity: 1
        })
      ),
      transition('* => opened-1', [animate('0.4s ease-out')]),
      transition('* => opened-2', [
        animate('0.4s ease-out'),
        animate('0.4s ease-out')
      ]),
      transition('* => opened-3', [
        animate('0.8s ease-out'),
        animate('0.4s ease-out')
      ]),
      transition('* => opened-4', [
        animate('1.2s ease-out'),
        animate('0.4s ease-out')
      ]),
      transition('* => opened-5', [
        animate('1.6s ease-out'),
        animate('0.4s ease-out')
      ])
    ])
  ]
})
export class PageMainComponent {
  public contacts = CONTACTS

  public step = 1

  public collection = [
    {
      name: 'elbrus-pendant-page.preview-name',
      description: 'elbrus-pendant-page.preview-description',
      proofs: [
        'elbrus-pendant-page.preview-proof-1',
        'elbrus-pendant-page.preview-proof-2',
        'elbrus-pendant-page.preview-proof-3'
      ],
      url: '/elbrus-pendant',
      photo: 'collection/elbrus-pendant/preview.jpg',
      soon: false
    }
  ]

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

  public scrollTo(selector: string) {
    const el = document.querySelector(selector)

    el?.scrollIntoView({ behavior: 'smooth' })
  }

  ngOnInit() {
    const offset = 300
    const aboutPos =
      document.querySelector('#about')?.getBoundingClientRect().top || 0
    const collectionPos =
      document.querySelector('#collection')?.getBoundingClientRect().top || 0

    window.onscroll = () => {
      const y = window.scrollY + offset

      if (aboutPos && this.step < 2 && y >= aboutPos) {
        this.step = 2
      }

      if (collectionPos && this.step < 3 && y >= collectionPos) {
        this.step = 3
      }
    }
  }

  ngOnDestroy() {
    window.onscroll = null
  }
}
