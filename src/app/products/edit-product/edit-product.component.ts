import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Product } from '../product.interface';
import { ProductsService } from '../products.service';
import { PopUpService } from 'src/app/pop-up/pop-up.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {

  public product: Product;
  private productId: string;
  form: FormGroup;

  initValName:string;
  initValDesc:string;
  initValPrice:number;

  constructor(
    public productsService: ProductsService,
     public route: ActivatedRoute,
     public popUpService:PopUpService) { }

  ngOnInit() {

    this.form = new FormGroup({
      name: new FormControl(null, {validators: [Validators.required]}),
      description: new FormControl(null, {validators: [Validators.required]}),
      price: new FormControl(null, {validators: [Validators.required,Validators.min(1)]})
    });

    this.form.setValidators(this.comparisonValidator());

    this.route.paramMap
    .subscribe((paramMap: ParamMap) => {
      this.productId = paramMap.get('productId');
      this.product = this.productsService.getSingleProduct(parseInt(this.productId))

      this.setFormAndInitVals(this.product.name,this.product.description,this.product.price);

    });
  }

  comparisonValidator() : ValidatorFn{
      return (group: FormGroup): ValidationErrors => {

        const nameCtrl = group.controls['name'].value;
        const descCtrl = group.controls['description'].value;
        const priceCtrl = group.controls['price'].value;

        if(nameCtrl === this.initValName && descCtrl === this.initValDesc && priceCtrl === this.initValPrice){
          //init values
          return {'sameValues': true};
        }else{
          return null
        }
      };
  }

  onSave(){
    if (this.form.invalid) {
      return;
    }

    this.productsService.updateProduct(
      parseInt(this.productId),
      this.form.value.name,
      this.form.value.description,
      this.form.value.price
      );

    this.product.name = this.form.value.name;

    this.setFormAndInitVals(this.form.value.name,this.form.value.description,this.form.value.price);

    this.popUpService.productName = this.product.name;
    this.popUpService.togglePopUp("open");
  }

  //util function
  private setFormAndInitVals(name:string,descr:string,price:number){

    this.initValName = name;
    this.initValDesc = descr;
    this.initValPrice = price;

    this.form.setValue({
      name: name,
      description: descr,
      price: price
    });
  }
}
