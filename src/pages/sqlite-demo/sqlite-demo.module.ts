import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SqliteDemoPage } from './sqlite-demo';

@NgModule({
  declarations: [
    SqliteDemoPage,
  ],
  imports: [
    IonicPageModule.forChild(SqliteDemoPage),
  ],
})
export class SqliteDemoPageModule {}
