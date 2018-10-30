import { Component } from '@angular/core';
import { IonicPage, NavController, Platform, LoadingController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { Diagnostic } from '@ionic-native/diagnostic';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Crop } from '@ionic-native/crop';

/**
 * Generated class for the ImageCropPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-image-crop',
  templateUrl: 'image-crop.html',
})
export class ImageCropPage {

  percent="0%";
  loading=null;
  showImg = "assets/imgs/logo.png";
  constructor(
    public navCtrl: NavController, 
    private camera:Camera,
    private imagePicker: ImagePicker,
    private transfer: FileTransfer,
    private loadingCtrl:LoadingController,
    private diagnostic:Diagnostic,
    private openNativeSettings: OpenNativeSettings,    
    private alertCtrl:AlertController,
    private crop:Crop,
    private platform:Platform,

  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ImageCropPage');
  }



  take(){
    console.log('拍照...');
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }
    if(this.platform.is("ios")){
      //在調用照相機前驗證是否有權限
      this.diagnostic.getCameraAuthorizationStatus().then( (status) =>{
        console.log("status:",status);
        if(status == "authorized" || status == "not_determined"){
          this.takePhoto();
        }else{
          this.alertCtrl.create({
            title: "系統提示",
            message:"無法啟動相機，請先開啟權限",
            buttons: [
              {
                text: '取消',
                role: 'cancel',
                handler: () => {
                  console.log('Cancel clicked');
                }
              },
              {
                text: '立即開啟',
                handler: () => {
                  this.openNativeSettings.open("application_details");
                }
              }
            ]
          }).present();
        }
      },(err) =>{
        console.log("getCameraAuthorizationStatus error:",err);
      });
    }else{
      this.takePhoto();
    }
  }


  pick(){
    console.log('從手機相簿選擇...');
    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }

    if(this.platform.is("ios")){
      //ios
      this.diagnostic.isCameraRollAuthorized().then( isAvailable =>{
        if(isAvailable){
          this.pickImage(); 
        }else{
          this.diagnostic.getCameraRollAuthorizationStatus().then( (status) =>{
            console.log("status:",status);
            if(status == "not_determined"){
              this.diagnostic.requestCameraRollAuthorization().then( result =>{
                if(result == "authorized"){
                  this.pickImage();
                }
              });
            }else if(status == "authorized"){
              this.pickImage(); 
            }else{
              this.alertCtrl.create({
                title: "系統提示",
                message:"無法訪問相簿，請先開啟權限",
                buttons: [
                  {
                    text: '取消',
                    role: 'cancel',
                    handler: () => {
                      console.log('Cancel clicked');
                    }
                  },
                  {
                    text: '立即開啟',
                    handler: () => {
                      this.openNativeSettings.open("application_details");
                    }
                  }
                ]
              }).present();
            }
          },(err) =>{
            console.log("getCameraRollAuthorizationStatus error:",err);
          });
        }
      });
    }else{
      //android
      this.pickImage(); 
    }
  }

  //拍照
  takePhoto(){

    var options:CameraOptions = {
      //这些参数可能要配合着使用，比如选择了sourcetype是0，destinationtype要相应的设置
      quality: 100,                                            //相片质量0-100
      destinationType: this.camera.DestinationType.FILE_URI,        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
      sourceType: this.camera.PictureSourceType.CAMERA,             //从哪里选择图片：PHOTOLIBRARY=0，相机拍照=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
      allowEdit: false,                                        //在选择之前允许修改截图
      encodingType: this.camera.EncodingType.JPEG,                   //保存的图片格式： JPEG = 0, PNG = 1
      targetWidth: 800,                                        //照片宽度
      targetHeight: 800,                                       //照片高度
      mediaType: 0,                                             //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
      cameraDirection: 0,                                       //枪后摄像头类型：Back= 0,Front-facing = 1
      saveToPhotoAlbum: true                                   //保存进手机相册
    };

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      this.cropImage(imageData);
     }, (err) => {
      // Handle error
      // this.utils.showAlert(err);
     });

  }

  //圖庫
  pickImage(){
    var options = {  
      maximumImagesCount: 1,  
      width: 800,  
      height: 800,  
      quality: 100
    }; 

    this.imagePicker.getPictures(options).then((results) => {
      console.log("imagePick:",results[0]);
      if(results != "" && results[0] != undefined){
        this.cropImage(results[0]);
      }
      // for (var i = 0; i < results.length; i++) {
      //     console.log('Image URI: ' + results[i]);
      // }
    }, (err) => { 
      // this.utils.showAlert(err);
    });

  }


  //上傳圖片前，裁剪
  cropImage(image){
    this.crop.crop(image, {quality: 100}).then( newImage => {
      console.log('new image path is: ' + newImage)
      // this.uploadImage(newImage);
      this.showImg = newImage;
    },error => {
      console.error('Error cropping image', error);
      // this.utils.showAlert(error);
    });
  }


  //上傳圖片
  uploadImage(image){
    const fileTransfer: FileTransferObject = this.transfer.create(); 
    let options: FileUploadOptions = {
      fileKey: "file",
      fileName: "file",
      chunkedMode: false,
      mimeType: "image/png",
      headers:{Authorization:"Bearer " + localStorage.getItem("httpToken")}
    }

    this.loading = this.loadingCtrl.create({
      spinner:"bubbles",
      content: "正在上傳..."+this.percent
    });
    this.loading.present();

    fileTransfer.upload(image,"url", options).then((data) => {
      this.loading.dismiss();
      let res = JSON.parse(data.response);
      console.log(res);
      
    }, (err) => {
      this.loading.dismiss();
      // error
      // this.utils.showAlert(err);
      console.log("upload-error:",JSON.stringify(err));
    });

    fileTransfer.onProgress( progressEvent =>{
      if (progressEvent.lengthComputable) {
          this.percent = parseInt((progressEvent.loaded*100 / progressEvent.total)+"")+"%";
          this.loading.setContent("正在上傳..."+this.percent)
      }
    });
    
  }



}
