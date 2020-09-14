import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {VideoPoseComponent} from './video-pose.component';

describe('VideoPoseComponent', () => {
  let component: VideoPoseComponent;
  let fixture: ComponentFixture<VideoPoseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [VideoPoseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPoseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
