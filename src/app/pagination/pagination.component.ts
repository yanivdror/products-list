import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProductsService } from '../products/products.service';


@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit,OnDestroy {

  private stateSub: Subscription;
  private pagesArr = [];
  @Input() itemsPerPage: number;
  //:number = 5;
  private currentPageIndex = 0;
  public showPagination:boolean = false;

  constructor(public productsService: ProductsService) { }

  ngOnInit() {

    //init first time
    this.createPagination();
    this.pushCurrentPageProducts();

    //subscribe to changes
    this.stateSub = this.productsService.getStateListener()
    .subscribe((stateObj)=>{

      if(stateObj.pagination.doPagination){

        this.productsService.setStateObj("pagination","doPagination",false);
        this.pagesArr = [];//reset pages
        this.createPagination();
        this.pushCurrentPageProducts();
      }
    });
  }


  createPagination(){

    let products;
    let currentState = this.productsService.theStateObj;

    if(currentState.filter.filterOn || currentState.sort.sortOn){
      //filter on get the filtered copy
      products = this.productsService.filteredProducts;
      //get back to page 1
      this.currentPageIndex = 0;
    }else{
      //filter off get the original copy
      products = this.productsService.fullProductsListCopy;
    }

    for(let i=0;i<products.length;i=i+this.itemsPerPage){

      let currentPageArr = products.slice(i,i+this.itemsPerPage);
      this.pagesArr.push(currentPageArr);
    }

    if(this.itemsPerPage >= products.length){
      //hide pagination
      this.showPagination = false;
      return;
    }else{
      this.showPagination = true;
    }
  }

  goNext(){
    this.currentPageIndex = this.currentPageIndex + 1;
    this.pushCurrentPageProducts();
  }

  goPrev(){
    this.currentPageIndex = this.currentPageIndex - 1;
    this.pushCurrentPageProducts();
  }

  showNext(){
    if(this.currentPageIndex === this.pagesArr.length - 1){
      return false;
    }
    return true;
  }

  showPrev(){

    if(this.currentPageIndex < 1){
      return false;
    }
    return true;
  }

  pushCurrentPageProducts(){

    if(!this.pagesArr.length){
      this.productsService.pushPageProducts(this.pagesArr);
      return;
    }
    this.productsService.pushPageProducts(this.pagesArr[this.currentPageIndex]);
  }

  ngOnDestroy(){
    this.stateSub.unsubscribe();
  }

}
