import { HTTP_INTERCEPTORS } from '@angular/common/http'
import { forwardRef, NgModule, Provider } from '@angular/core'
import { environment } from '../../../environments/environment'
import { AuthInterceptor } from './auth-interceptor'
import { AuthGuard } from './auth.guard'
import { UsersApiModule } from './generated/users'
import { FilesApiModule } from './generated/files'
import { JewelryApiModule } from './generated/jewelry'

const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => AuthInterceptor),
  multi: true
}

@NgModule({
  imports: [
    UsersApiModule.forRoot({ rootUrl: environment.apiUrl }),
    FilesApiModule.forRoot({ rootUrl: environment.apiUrl }),
    JewelryApiModule.forRoot({ rootUrl: environment.apiUrl })
  ],
  providers: [AuthInterceptor, API_INTERCEPTOR_PROVIDER, AuthGuard]
})
export class GeneratedApiModule {}
