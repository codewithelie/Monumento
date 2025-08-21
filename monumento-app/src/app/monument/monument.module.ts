import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BorderCardDirective } from './border-card.directive';
import { CountryByColorPipe } from './country-by-color.pipe';
import { ListMonumentComponent } from './list-monument/list-monument.component';
import { DetailMonumentComponent } from './detail-monument/detail-monument.component';
import { RouterModule, Routes } from '@angular/router';
import { MonumentFormComponent } from './monument-form/monument-form.component';
import { FormsModule } from '@angular/forms';
import { EditMonumentComponent } from './edit-monument/edit-monument.component';
import { SearchMonumentComponent } from './search-monument/search-monument.component';
import { authGuard } from '../auth.guard';
import { HttpClientModule } from '@angular/common/http';
import { MonumentService } from './monument.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.intercepor';

const monumentRoutes: Routes = [
  { path: 'edit/monument/:id', component: EditMonumentComponent, canActivate: [authGuard] },
  { path: 'monument/:id', component: DetailMonumentComponent, canActivate: [authGuard] },
  { path: 'monument-form', component: MonumentFormComponent, canActivate: [authGuard] },
  { path: 'monuments', component: ListMonumentComponent, canActivate: [authGuard] },
]

@NgModule({
  declarations: [
    BorderCardDirective,
    CountryByColorPipe,
    ListMonumentComponent,
    DetailMonumentComponent,
    MonumentFormComponent,
    EditMonumentComponent,
    SearchMonumentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(monumentRoutes)
  ],
  providers: [
    MonumentService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
})
export class MonumentModule { }
