import { Component, OnInit, OnDestroy } from '@angular/core';

import { ProductsService } from '../products/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.scss']
})
export class SortComponent implements OnInit,OnDestroy {

  private stateSub: Subscription;
  private sortBy:string = "none";

  constructor(public productsService: ProductsService) { }

  ngOnInit() {

    this.stateSub = this.productsService.getStateListener()
    .subscribe((stateObj)=>{

      if(stateObj.sort.doSort){
        this.productsService.setStateObj("sort","doSort",false);
        this.onSortChange();
      }
    });
  }

  onSortChange(e?){

    if(e){
      this.sortBy = e.target.value;
    }

    let products;
    let currentState = this.productsService.theStateObj;

    if(!currentState.filter.filterOn){
      //filter off get the original copy
      products = this.productsService.fullProductsListCopy;

    }else{
      //filter on get the filtered copy
      products = this.productsService.filteredProducts;
    }

    this.sortProducts(products);
  }

  private sortProducts(products){

    if(this.sortBy !== "none"){
      this.productsService.setStateObj("sort","sortOn",true);
      const sortedProducts = products.sort((a, b) => (a[this.sortBy] > b[this.sortBy]) ? 1 : -1);
      this.productsService.filteredProducts = sortedProducts;
    }else{
      this.productsService.setStateObj("sort","sortOn",false);
      //push original not sorted as is
      this.productsService.filteredProducts = products;
    }

    //publish to pagination
    this.productsService.setStateObj("pagination","doPagination",true);
    this.productsService.updateState();

  }

  ngOnDestroy(){
    this.stateSub.unsubscribe();
  }

}
