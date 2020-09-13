import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {Pose} from '../../../core/services/pose/models/base.pose-model';
import {BaseComponent} from '../../base/base.component';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {PoseService} from '../../../core/services/pose/pose.service';

const POSE_LIMBS = [
  [1, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [1, 8], [0, 16], [0, 15], [0, 18], [0, 17], [1, 0], [8, 9],
  [9, 10], [10, 11], [8, 12], [12, 13], [13, 14], [11, 24], [11, 22], [22, 23], [14, 21], [14, 19], [19, 20]
];

@Component({
  selector: 'app-video-pose',
  templateUrl: './video-pose.component.html',
  styleUrls: ['./video-pose.component.css']
})
export class VideoPoseComponent extends BaseComponent implements AfterViewInit {
  @ViewChild('canvas') canvasEl: ElementRef<HTMLCanvasElement>;
  @Select(state => state.models.pose) pose$: Observable<Pose>;

  ctx: CanvasRenderingContext2D;

  constructor(private elementRef: ElementRef, private poseService: PoseService) {
    super();
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvasEl.nativeElement.getContext('2d');

    this.pose$.pipe(
      filter(Boolean),
      tap((pose: Pose) => this.draw(pose)),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }

  draw(pose: Pose): void {
    const canvas = this.canvasEl.nativeElement;
    const {width, height} = this.elementRef.nativeElement.getBoundingClientRect();
    // const {width, height} = this.poseService.model;
    if (canvas.width !== width) {
      canvas.width = width;
    }
    if (canvas.height !== height) {
      canvas.height = height;
    }
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = 'red';

    for (const [p1i, p2i] of POSE_LIMBS) {
      const p1 = pose[p1i];
      const p2 = pose[p2i];
      if (p1.x !== 0 && p2.x !== 0) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
      }
    }

    for (const keypoint of pose) {
      if (keypoint.x !== 0) {
        this.ctx.beginPath();
        this.ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        this.ctx.fill();
      }
    }
  }

}
