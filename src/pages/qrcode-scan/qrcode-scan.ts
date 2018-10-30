import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { QRScanner,QRScannerStatus } from '@ionic-native/qr-scanner';

/**
 * Generated class for the QrcodeScanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-qrcode-scan',
  templateUrl: 'qrcode-scan.html',
})
export class QrcodeScanPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private platform:Platform,
    private qrScanner: QRScanner,

  ) {
  }

  //ionic中当页面进入初始化的时候触发的生命周期方法
  ionViewDidEnter(){
    // setting status bar style

    (window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
    this.scan();

    // 隱藏tabs
    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
      Object.keys(elements).map((key) => {
          elements[key].style.display = 'none';
      });
    }   
  }
  //ionic当退出页面的时候触发的方法
  ionViewWillLeave() {
    // 顯示tabs
    let elements = document.querySelectorAll(".tabbar");
    if (elements != null) {
    Object.keys(elements).map((key) => {
      elements[key].style.display = 'flex';
    });
    }

    (window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
  }   

  scan() {
  
    if(!this.platform.is("cordova")){
      return console.log("this is not a platform for cordova");
    }

    console.log("qrScanner...");
    // Optionally request the permission early
    this.qrScanner.prepare().then((status: QRScannerStatus) => {
        if (status.authorized) {
         
          // start scanning
          let scanSub = this.qrScanner.scan().subscribe((text: string) => {
            this.qrScanner.hide();
            scanSub.unsubscribe();
            this.navCtrl.push("QrcodeScanResultPage",{scanResult:text});
          });

          this.qrScanner.resumePreview();
          // show camera preview
          this.qrScanner.show();
  
        } else if (status.denied) {
          alert('denied');
          // camera permission was permanently denied
          // you must use QRScanner.openSettings() method to guide the user to the settings page
          // then they can grant the permission from there
        } else {
          // permission was denied, but not permanently. You can ask for permission again at a later time.
          alert('else');
        }
      })
      .catch((e: any) => {
        console.error(e);
      });
  
  }


  ngOnDestroy(){
    if(this.platform.is("cordova")){
      if(this.qrScanner != undefined && this.qrScanner != null){
        this.qrScanner.destroy();
      }
    }
  }


}
