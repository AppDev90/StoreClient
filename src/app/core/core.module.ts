import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component'
import { RouterModule } from '@angular/router';
import { ErrorTestComponent } from './components/error-test/error-test.component';
import { NotFoundErrorComponent } from './components/not-found-error/not-found-error.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';
import { ToastrModule } from 'ngx-toastr';
import { SectionHeaderComponent } from './components/section-header/section-header.component';
import { BreadcrumbModule } from 'xng-breadcrumb';




@NgModule({
  declarations: [
    NavBarComponent,
    ErrorTestComponent,
    NotFoundErrorComponent,
    ServerErrorComponent,
    SectionHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    BreadcrumbModule,
    BreadcrumbModule,
    ToastrModule.forRoot(
      {
        positionClass: 'toast-bottom-right',
        preventDuplicates: true,
      }
    )
  ],
  exports: [
    NavBarComponent,
    SectionHeaderComponent
  ]
})
export class CoreModule { }

