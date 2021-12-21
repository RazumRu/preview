import axios from 'axios'
import _ from 'lodash'
import { NgOpenApiGen } from 'ng-openapi-gen/lib/ng-openapi-gen'
import { environment as devEnvironment } from './environments/environment'
import { environment as prodEnvironment } from './environments/environment.prod'
;(async (env) => {
  const environment: any = (() => {
    switch (env) {
      case 'production':
        return prodEnvironment
      case 'development':
      default:
        return devEnvironment
    }
  })()

  for (const spec of environment.swaggerSpecs) {
    const specData = await axios.get(`${environment.apiUrl}${spec.path}`)
    const gen = new NgOpenApiGen(specData.data, {
      'output': `src/app/core/api/generated/${spec.name}`,
      input: '',
      servicePrefix: _.startCase(spec.name),
      // modelPrefix: _.startCase(spec.name),
      serviceSuffix: 'ApiService',
      indexFile: true,
      module: `${_.startCase(spec.name)}ApiModule`
    })
    gen.generate()
  }
})((process.env.NODE_ENV || 'development').toLowerCase()).catch((e) => {
  console.error(e)
})
