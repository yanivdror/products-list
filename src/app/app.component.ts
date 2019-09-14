import { Component, OnInit, OnDestroy } from '@angular/core';

import { PopUpService } from './pop-up/pop-up.service';
import { Subscription } from 'rxjs';
import { ProductsService } from './products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,OnDestroy {

  title = 'msbits';
  subscription: Subscription;
  openPopUp:boolean = false;

  constructor(private popUpService:PopUpService, public productsService:ProductsService){

  }

  ngOnInit(){
    this.subscription = this.popUpService.getPopUpState()
    .subscribe(toggleText => {
      console.log(toggleText);
      if(toggleText === "open"){
        this.openPopUp = true;
      }else if(toggleText === "close"){
        this.openPopUp = false;
      }
    });
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

}
