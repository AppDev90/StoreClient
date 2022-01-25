import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorTestComponent } from './core/error-test/error-test.component';
import { NotFoundErrorComponent } from './core/not-found-error/not-found-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'test-error', component: ErrorTestComponent },
  { path: 'notfound-error', component: NotFoundErrorComponent },
  { path: 'server-error', component: ServerErrorComponent },
  {
    path: 'shop', loadChildren:
      () => import('./shop/shop.module').then(mod => mod.ShopModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
