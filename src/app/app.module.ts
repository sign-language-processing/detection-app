import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AppSharedModule} from './core/modules/shared.module';
import {HeaderComponent} from './components/header/header.component';
import {VideoComponent} from './components/video/video.component';
import {MainPageComponent} from './pages/main/main.component';
import {SettingsComponent} from './components/settings/settings.component';
import {VideoControlsComponent} from './components/video/video-controls/video-controls.component';
import {VideoHelpComponent} from './components/video/video-help/video-help.component';
import {NavigatorService} from './core/services/navigator/navigator.service';
import {HelpPageComponent} from './pages/help/help.component';
import {BroadcastTestComponent} from './components/audio/broadcast-test/broadcast-test.component';
import {VideoPoseComponent} from './components/video/video-pose/video-pose.component';
import {AudioComponent} from './components/audio/audio.component';
import {AudioInstructionsComponent} from './components/audio/audio-instructions/audio-instructions.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    VideoComponent,
    SettingsComponent,
    VideoControlsComponent,
    VideoHelpComponent,
    MainPageComponent,
    HelpPageComponent,
    BroadcastTestComponent,
    VideoPoseComponent,
    AudioComponent,
    AudioInstructionsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppSharedModule,
  ],
  providers: [
    NavigatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
