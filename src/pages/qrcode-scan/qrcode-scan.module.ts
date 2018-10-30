import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QrcodeScanPage } from './qrcode-scan';

@NgModule({
  declarations: [
    QrcodeScanPage,
  ],
  imports: [
    IonicPageModule.forChild(QrcodeScanPage),
  ],
})
export class QrcodeScanPageModule {}
