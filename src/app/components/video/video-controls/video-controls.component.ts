import {Component} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BaseSettingsComponent} from '../../settings/settings.component';
import {Hand} from '../../../core/modules/ngxs/store/settings/settings.state';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-video-controls',
  templateUrl: './video-controls.component.html',
  styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent extends BaseSettingsComponent {
  @Select(state => state.models.isSigning) isSigning$: Observable<boolean>;

  constructor(store: Store) {
    super(store);
  }

  flipDominantHand(currentHand: Hand): void {
    if (currentHand === 'right') {
      this.applySetting('dominantHand', 'left');
    } else {
      this.applySetting('dominantHand', 'right');
    }
  }
}
