import {AfterViewInit, Component, ElementRef, HostBinding, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AspectRatio, VideoStateModel} from '../../core/modules/ngxs/store/video/video.state';
import Stats from 'stats.js';
import {filter, map, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../base/base.component';
import {wait} from '../../core/helpers/wait/wait';
import {PoseVideoFrame} from '../../core/modules/ngxs/store/models/models.actions';
import {Hand} from '../../core/modules/ngxs/store/settings/settings.state';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss']
})
export class VideoComponent extends BaseComponent implements AfterViewInit {
  @Select(state => state.video) videoState$: Observable<VideoStateModel>;
  @Select(state => state.models.signingProbability) signingProbability$: Observable<number>;
  @Select(state => state.models.isSigning) isSigning$: Observable<boolean>;
  @Select(state => state.settings.dominantHand) dominantHand$: Observable<Hand>;

  @ViewChild('video') videoEl: ElementRef<HTMLVideoElement>;
  @ViewChild('stats') statsEl: ElementRef;

  @HostBinding('class') aspectRatio = 'aspect-16-9';

  fpsStats = new Stats();
  signingStats = new Stats();

  constructor(private store: Store) {
    super();
  }

  ngAfterViewInit(): void {
    this.setCamera();
    this.setStats();

    this.videoEl.nativeElement.addEventListener('loadeddata', this.appLoop.bind(this));
  }

  async appLoop(): Promise<void> {
    const fps = this.store.snapshot().video.cameraSettings.frameRate;
    const video = this.videoEl.nativeElement;
    const poseAction = new PoseVideoFrame(this.videoEl.nativeElement);

    const fpsWait = 1000 / fps - 1;

    while (true) {
      if (video.readyState !== 4) {
        break;
      }

      this.fpsStats.begin();
      const startTime = performance.now();
      await this.store.dispatch(poseAction).toPromise();
      //
      // if (this.poseNet) {
      //   const {keypoints} = await this.poseNet.estimateSinglePose(this.videoEl.nativeElement, {flipHorizontal: this.flipPose});
      //   this.processKeypoints(keypoints);
      // } else {
      //   await wait(1000 / 60);
      // }
      const endTime = performance.now();

      const timePassed = endTime - startTime; // Time passed in milliseconds
      if (timePassed < fpsWait) {
        await wait(fpsWait - timePassed);
      }
      this.fpsStats.end();
    }
  }

  setCamera(): void {
    const video = this.videoEl.nativeElement;
    video.addEventListener('loadedmetadata', e => video.play());

    this.videoState$.pipe(
      map(state => state.camera),
      tap(camera => video.srcObject = camera),
      // tap(camera => {
      //   video.src = 'assets/videos/example_maayan.mp4';
      //   video.muted = true;
      //   setTimeout(() => this.aspectRatio = 'aspect-16-9', 0);
      // }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();

    this.videoState$.pipe(
      map(state => state.cameraSettings && state.cameraSettings.aspectRatio),
      filter(Boolean),
      tap((aspectRatio: AspectRatio) => this.aspectRatio = 'aspect-' + aspectRatio),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  setStats(): void {
    this.fpsStats.showPanel(0);
    this.fpsStats.domElement.style.position = 'absolute';
    this.statsEl.nativeElement.appendChild(this.fpsStats.dom);

    const signingPanel = new Stats.Panel('Signing', '#ff8', '#221');
    this.signingStats.dom.innerHTML = '';
    this.signingStats.addPanel(signingPanel);
    this.signingStats.showPanel(0);
    this.signingStats.domElement.style.position = 'absolute';
    this.signingStats.domElement.style.left = '80px';
    this.statsEl.nativeElement.appendChild(this.signingStats.dom);

    this.setDetectorListener(signingPanel);
  }

  setDetectorListener(panel: Stats.Panel): void {
    this.signingProbability$.pipe(
      tap(v => panel.update(v * 100, 100)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }
}
