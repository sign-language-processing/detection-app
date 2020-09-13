import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VideoControlsComponent} from './video-controls.component';
import {AppModule} from '../../../app.module';

describe('VideoControlsComponent', () => {
  let component: VideoControlsComponent;
  let fixture: ComponentFixture<VideoControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VideoControlsComponent],
      imports: [AppModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
