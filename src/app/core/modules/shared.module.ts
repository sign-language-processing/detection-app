import {NgModule} from '@angular/core';
import {AppAngularMaterialModule} from './angular-material/angular-material.module';
import {AppNgxsModule} from './ngxs/ngxs.module';
import {AppAngularFireModule} from './angular-fire/angular-fire.module';
import {AppTranslocoModule} from './transloco/transloco.module';
import {CommonModule} from '@angular/common';

const components = [];

const modules = [
  AppNgxsModule,
  AppAngularFireModule,
  AppTranslocoModule,
  AppAngularMaterialModule,
  CommonModule,
];

@NgModule({
  declarations: components,
  imports: modules,
  exports: [
    ...components,
    ...modules
  ]
})
export class AppSharedModule {
}
