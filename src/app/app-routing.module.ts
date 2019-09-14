import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductsListComponent } from './products/products-list/products-list.component';
import { EditProductComponent } from './products/edit-product/edit-product.component';

const routes: Routes = [
  {
    path: '',
    component: ProductsListComponent,
    children:[
      {
        path: 'edit/:productId',
        component: EditProductComponent
      }
    ]
  }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
