import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageCropPage } from './image-crop';

@NgModule({
  declarations: [
    ImageCropPage,
  ],
  imports: [
    IonicPageModule.forChild(ImageCropPage),
  ],
})
export class ImageCropPageModule {}
