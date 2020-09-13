import {Component, Input} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {Observable} from 'rxjs';
import {AuthStateModel} from '../../core/modules/ngxs/store/auth/auth.state';
import {SignInWithGoogle, SignOut} from '../../core/modules/ngxs/store/auth/auth.actions';
import {MatSidenav} from '@angular/material/sidenav';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  @Select(state => state.auth) authState$: Observable<AuthStateModel>;

  @Input() calendarNav: MatSidenav;

  constructor(private store: Store) {
  }

  signIn(): void {
    this.store.dispatch(SignInWithGoogle);
  }

  signOut(): void {
    this.store.dispatch(SignOut);
  }
}
