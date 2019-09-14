import { Component, OnInit } from '@angular/core';
import { PopUpService } from './pop-up.service';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.scss']
})
export class PopUpComponent implements OnInit {

  productName:string;

  constructor(public popUpService:PopUpService) { }

  ngOnInit() {

    this.productName = this.popUpService.productName;
  }

  closePopUp(){
    this.popUpService.togglePopUp("close");
  }



}
