import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';

import {ProductsService } from '../products.service';
import { Product } from '../product.interface';
import { startWith, tap } from 'rxjs/operators';
import { delay } from 'q';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.component.html',
  styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit,OnDestroy,AfterViewInit {

  currentPageProducts: Product[] = [];
  private productsSub: Subscription;
  productsHttpReady:boolean = false;
  itemPerPage:number = 5

  constructor(public productsService: ProductsService,private cd:ChangeDetectorRef) { }

  ngOnInit() {
    this.productsService.getAllProductsHttp()
      .then((res) => {
        this.productsHttpReady = true;//flage to load app
      })
      .catch((err) => {
        //do error
      });

    this.productsSub = this.productsService.getPageProductsListener()
    .subscribe((res)=>{
      this.currentPageProducts = res;
      this.cd.detectChanges();
    });

  }

  ngAfterViewInit(){

  }

  ngOnDestroy() {
    this.productsSub.unsubscribe();
  }

}
