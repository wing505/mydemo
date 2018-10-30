import { Component,ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


import * as $ from 'jquery' ;
/**
 * Generated class for the HeaderGradientPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-header-gradient',
  templateUrl: 'header-gradient.html',
})
export class HeaderGradientPage {

  list = [];
  @ViewChild("header") header;

  constructor(public navCtrl: NavController,) {

  }
  ngOnInit(){
    for(let i=0;i< 20 ;i++){
      this.list.push(i* (i+i) );
    }
  }

  scrollEvent(event){
    let opacity = (event.scrollTop / 300);//设置滚动距离300的时候导航栏消失
    let temp = $(".navbar-btn");
    if(opacity < 0.4){
      this.header._elementRef.nativeElement.style.opacity = 1;
      this.header._elementRef.nativeElement.style.background = "transparent";
      temp.addClass("btn-cls");
    }else{
      this.header._elementRef.nativeElement.style.background = "#f4f4f4";
      this.header._elementRef.nativeElement.style.opacity = opacity;
      temp.removeClass("btn-cls");
    }

  }

}
