import { Component } from '@angular/core';
import { NavController,Platform } from 'ionic-angular';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio';
// import { AppRate } from '@ionic-native/app-rate';
import { NativeAudio } from '@ionic-native/native-audio';
import { Alipay, AlipayOrder } from '@ionic-native/alipay';
// import * as $ from 'jquery' ;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  list = [
    {id:1,name:"導航欄漸變"},
    {id:2,name:"指紋識別"},
    {id:3,name:"SQLite Demo"},
    {id:4,name:"自定義掃描"},
    {id:5,name:"圖片裁剪"},
    {id:6,name:"輪播圖自適應"},
    {id:7,name:"文字轉語音"},
    {id:8,name:"音頻播放"},
    {id:9,name:"Alipay"},
    {id:10,name:"ion-gallery"},

  ];
  

  constructor(public navCtrl: NavController,
    private faio: FingerprintAIO ,
    private platform:Platform,
    // private appRate: AppRate,
    private nativeAudio: NativeAudio,
    private alipay: Alipay
    
  ) {

  }

  ngOnInit(){


  }
  
  itemClick(index){

    switch(index){
      case 1: this.navCtrl.push("HeaderGradientPage"); break;
      case 2: this.fingerprint(); break;
      case 3: this.navCtrl.push("SqliteDemoPage"); break;
      case 4: this.navCtrl.push("QrcodeScanPage"); break;
      case 5: this.navCtrl.push("ImageCropPage"); break;
      case 6: this.navCtrl.push("SlidesPage"); break;
      case 7: this.navCtrl.push("TexttospeechPage"); break;
      case 8: this.playAudio(); break;
      case 9: this.aliPay(); break;
      case 10: this.navCtrl.push("GalleryPage"); break;

    }

  }


  // 指紋識別
  fingerprint(){
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }

    this.faio.show({
      clientId: 'Fingerprint-Demo',
      clientSecret: 'password', //Only necessary for Android
      disableBackup:true,  //Only for Android(optional)
      localizedFallbackTitle: 'Use Pin', //Only for iOS
      localizedReason: 'Please authenticate' //Only for iOS
    }).then((result: any) => {
      console.log(JSON.stringify(result));
      alert(JSON.stringify(result));
    }).catch((error: any) => {
      console.log(error);
      alert(error);
    });
  }

  playAudio(){
    console.log("音頻播放...");

    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }

    this.nativeAudio.preloadComplex('myScanQrcode', 'assets/audio/di.mp3',1,1,0).then(()=>{
      console.log("開始播放...");

      this.nativeAudio.play('myScanQrcode').then(() =>{
        console.log("播放完畢");


        setTimeout(() => {

          this.nativeAudio.unload('myScanQrcode').then(() =>{
            console.log("从内存中卸载音频文件-成功");
  
          },unloadErr =>{
            console.log("从内存中卸载音频文件-錯誤:"+JSON.stringify(unloadErr));
  
          });
          
        }, 1000);
        
      }, payErr =>{
        console.log("播放錯誤:"+JSON.stringify(payErr));
      });

    }, err =>{
      console.log("加載錯誤:"+JSON.stringify(err));
    });


  }

  aliPay(){

    const alipayOrder: AlipayOrder = {
      app_id:"321312313131",
      method:"alipay.trade.app.pay",
      format:"JSON",
      charset:"UTF-8",
      sign_type:"RSA",
      sign:"RSA",
      timestamp:"2018-06-1 03:07:50",
      version:"1.0",
      notify_url:"",
      biz_content:"支付说明",
    };

    this.alipay.pay(alipayOrder)
    .then(result => {
        console.log(result); // Success
    })
    .catch(error => {
        console.log(error); // Failed
    });


  }

}
