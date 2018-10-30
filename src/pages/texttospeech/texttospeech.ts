import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { TextToSpeech,TTSOptions } from '@ionic-native/text-to-speech';
/**
 * Generated class for the TexttospeechPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-texttospeech',
  templateUrl: 'texttospeech.html',
})
export class TexttospeechPage {

  text="hello world";
  language="en-US";

  languages = [
    {
      key:"en-US",text:"en-US"
    },
    {
      key:"zh-CN",text:"zh-CN"
    },
    {
      key:"etc",text:"etc"
    },
    {
      key:"zh-HK",text:"zh-HK"
    },
  ]


  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private tts: TextToSpeech,
    private platform:Platform

  ) {
  }

  // ionViewDidLoad() {
  //   console.log('ionViewDidLoad TexttospeechPage');
  // }

  textToSpeech(){


    let opts = {
      text:this.text,
      locale:this.language,
    }

    console.log(opts);

    if(!this.platform.is("cordova")){
      return console.log("cordova_not_available");
    }

    this.tts.speak(opts).then(() => {

      console.log('Success');

    }).catch((reason: any) => {

      console.log(reason);
      console.log(JSON.stringify(reason));

    });
    
  }

}
