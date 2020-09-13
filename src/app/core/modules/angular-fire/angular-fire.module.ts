import {NgModule} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {AngularFireAnalyticsModule, ScreenTrackingService, UserTrackingService} from '@angular/fire/analytics';
import {AngularFireModule} from '@angular/fire';
import {AngularFirestoreModule} from '@angular/fire/firestore';


@NgModule({
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,
  ],
  providers: [
    UserTrackingService,
    ScreenTrackingService
  ]
})
export class AppAngularFireModule {
}
