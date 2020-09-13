import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext} from '@ngxs/store';
import {filter, first, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';
import 'firebase/auth';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {SignInWithGoogle, SignOut, StreamAuth} from './auth.actions';
import {DisplayError, StartLoading, StopLoading} from '../app/app.actions';
import {interval, Observable} from 'rxjs';
import {User} from 'firebase';
import {environment} from '../../../../../../environments/environment';
import {AngularFirestore} from '@angular/fire/firestore';

export interface AuthStateModel {
  isInitialized: boolean;
  isLoggedIn: boolean;
  user: Partial<User>;
}

const initialState: AuthStateModel = {
  isInitialized: false,
  isLoggedIn: undefined,
  user: undefined
};

@Injectable()
@State<AuthStateModel>({
  name: 'auth',
  defaults: initialState
})
export class AuthState implements NgxsOnInit {

  constructor(private afAuth: AngularFireAuth,
              private afFirestore: AngularFirestore,
              private afAnalytics: AngularFireAnalytics) {
  }

  ngxsOnInit({dispatch}: StateContext<AuthStateModel>): void {
    dispatch(StreamAuth);
  }

  @Action(StreamAuth)
  stream({patchState}: StateContext<AuthStateModel>): Observable<User> {
    return this.afAuth.authState.pipe(
      tap(async (user: User) => {
        const userData = !user ? null : {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
          photoURL: user.photoURL
        };
        patchState({isInitialized: true, isLoggedIn: Boolean(user), user: userData});
        const uid = user ? user.uid : null;
        await this.afAnalytics.setUserId(uid);
      })
    );
  }

  /**
   * Open a popup to sign in with Google Provider.
   */
  @Action(SignInWithGoogle)
  async signInWithGoogle({dispatch}: StateContext<AuthStateModel>): Promise<void> {
    const windowListener = async ({data}) => {
      const credentials = auth.GoogleAuthProvider.credential(data.tokens.id_token, null);
      try {
        const result = await this.afAuth.signInWithCredential(credentials);
        await this.afFirestore.collection('users').doc(result.user.uid).set({token: data.tokens}, {merge: true});
      } catch (e) {
        dispatch(new DisplayError(e));
      }
      window.removeEventListener('message', windowListener);
    };
    window.addEventListener('message', windowListener);
    const authWindow = window.open(`${environment.baseUrl}/auth-authorize`, 'google-auth', 'height=800,width=600');
    if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') { // POPUP BLOCKED
      dispatch(new DisplayError('Your browser have blocked the authentication popup window. For instructions, go to https://support.google.com/chrome/answer/95472'));
    } else {
      dispatch(StartLoading);
      authWindow.addEventListener('close', () => dispatch(StopLoading));
      // Close event might not fire
      interval(100).pipe(
        filter(() => authWindow && authWindow.closed),
        first(),
        tap(() => dispatch(StopLoading))
      ).subscribe();
    }
  }

  /**
   * Sign out the current authenticated user.
   */
  @Action(SignOut)
  signOut(): Promise<void> {
    return this.afAuth.signOut();
  }
}
