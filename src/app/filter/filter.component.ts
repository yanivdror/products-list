import { Component, OnInit, OnDestroy } from '@angular/core';

import { ProductsService } from '../products/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit,OnDestroy {


  constructor(public productsService: ProductsService) { }

  ngOnInit() {

  }

  onKey(value?: string) {

    let products = this.productsService.fullProductsListCopy;

    if(!value){
      //get the original products copy
      this.productsService.setStateObj("filter","filterOn",false);
      this.productsService.filteredProducts = products;
    }else{
      //filter products
      this.productsService.setStateObj("filter","filterOn",true);
      let filterdProducts = products.filter(product => product.name.includes(value) || product.description.includes(value));
      this.productsService.filteredProducts = filterdProducts;
    }
    //do sort after filter
    this.productsService.setStateObj("sort","doSort",true);
    this.productsService.updateState();

  }

  ngOnDestroy(){
  }

}
