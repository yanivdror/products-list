import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopUpService {

  private theProductName:string;
  private subject = new Subject<any>();
  static instance?: PopUpService;


  constructor() {
    if (PopUpService.instance !== undefined) {
      throw new Error('Import PopUpService only once.');
    }

    PopUpService.instance = this;
  }

  togglePopUp(toggleText: string) {
      this.subject.next(toggleText);
  }

  getPopUpState(): Observable<any> {
      return this.subject.asObservable();
  }

  get productName(){
    return this.theProductName;
  }

  set productName(str:string){
    this.theProductName = str;
  }

}
