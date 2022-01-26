import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorTestComponent } from './core/error-test/error-test.component';
import { NotFoundErrorComponent } from './core/not-found-error/not-found-error.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { title: 'Home', breadcrumb: 'Home' } },
  { path: 'test-error', component: ErrorTestComponent, data: { breadcrumb: "Test Errors" } },
  { path: 'notfound-error', component: NotFoundErrorComponent, data: { breadcrumb: "Not Found" } },
  { path: 'server-error', component: ServerErrorComponent, data: { breadcrumb: "Server Error" } },
  {
    path: 'shop', loadChildren:
      () => import('./shop/shop.module').then(mod => mod.ShopModule), data: { breadcrumb: "Shop" }
  },
  { path: '**', redirectTo: 'notfound-error', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
