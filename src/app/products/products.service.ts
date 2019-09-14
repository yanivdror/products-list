import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Product, AdvancedProduct } from './product.interface';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private fullProductsList: Product[];
  private filteredProductsList: Product[];
  private currentPageProductsUpdate = new Subject<Product[]>();
  private stateUpdate = new Subject<any>();
  private firstTimeNavigation:boolean = true;

  private stateObj = {
    filter:{
      filterOn:false
    },
    sort:{
      sortOn:false,
      doSort:false
    },
    pagination:{
      doPagination:false
    }
  }

  static instance?: ProductsService;


  constructor(private httpClient: HttpClient,private router: Router) {
    if (ProductsService.instance !== undefined) {
      throw new Error('Import ProductsService only once.');
    }

    ProductsService.instance = this;
  }


  getAllProductsHttp() {

    return new Promise((resolve, reject) => {

      this.httpClient.get<AdvancedProduct[]>('/assets/products.json')
      .pipe(map((productsData) => {
        return productsData.map((item) => {

          if(item.fedex){

            item = item.fedex;

            return {
              creationDate: item.creationDate,
              description: item.description,
              id: item.id,
              name: item.name,
              price: item.price,
              thumbnailUrl: item.thumbnailUrl,
              url: item.url
            }

          }else if(item.ups){

            if (Array.isArray(item.ups)) {
              for(let i=0;i<item.ups.length;i++){

                return {
                  creationDate: item.ups[i].creationDate,
                  description: item.ups[i].description,
                  id: item.ups[i].id,
                  name: item.ups[i].name,
                  price: item.ups[i].price,
                  thumbnailUrl: item.ups[i].thumbnailUrl,
                  url: item.ups[i].url
                }
              }
            }

          }else{
            //other products
            return {
              creationDate: item.creationDate,
              description: item.description,
              id: item.id,
              name: item.name,
              price: item.price,
              thumbnailUrl: item.thumbnailUrl,
              url: item.url
            }
          }
        });
      }))
      .subscribe((transformedProducts) => {
        this.fullProductsList =  transformedProducts;
        this.filteredProductsList = [...this.fullProductsList];

        if(this.firstTimeNavigation){

          this.firstTimeNavigation = false;
          this.router.navigate(['/edit/1']);
        }

        resolve(true);
      });

    });

  }


  getSingleProduct(id:number){

    return {...this.fullProductsList.find((p) => {
      return p.id === id;
    })};
  }

  updateProduct(productId: number, name: string, description: string, price: number) {

        const updatedProducts: Product[] = [...this.fullProductsList];
        const productIndex = updatedProducts.findIndex((p) => {
          return p.id === productId;
        });

        let newProduct = {
          ...updatedProducts[productIndex],
          name:name,
          description:description,
          price:price
        }

        updatedProducts[productIndex] = newProduct;
        this.fullProductsList = updatedProducts;
        this.filteredProductsList = [...this.fullProductsList];

        this.setStateObj("pagination","doPagination",true);
        this.updateState();
  }

  getPageProductsListener() {
    return this.currentPageProductsUpdate.asObservable();
  }

  getStateListener(){
    return this.stateUpdate.asObservable();
  }

  get fullProductsListCopy(){
    return [...this.fullProductsList];
  }

  get filteredProducts(){
    return this.filteredProductsList;
  }

  set filteredProducts(products:Product[]){
    this.filteredProductsList = products;
  }

  get theStateObj(){
    return this.stateObj;
  }

  setStateObj(key:string,innerKey:string,bool:boolean){
    this.stateObj[key][innerKey] = bool;
  }

  updateState(){
    this.stateUpdate.next(this.theStateObj);
  }

  pushPageProducts(products:Product[]){
    this.currentPageProductsUpdate.next([...products]);
  }

}
