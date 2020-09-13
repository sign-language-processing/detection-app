import {Injectable} from '@angular/core';
import {Action, NgxsOnInit, State, StateContext} from '@ngxs/store';
import {catchError, first, switchMap, tap} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import 'firebase/auth';
import {Observable, of} from 'rxjs';
import {FetchCalendar, ResetCalendar} from './calendar.actions';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../../../environments/environment';

export interface CalendarEvent {
  summary: string;
  status: 'confirmed';
  start: Date;
  end: Date;
  conference?: {
    type: string;
    id: string;
    url: string;
  };
}

export interface CalendarStateModel {
  isInitialized: boolean;
  events: CalendarEvent[];
  error: string;
}

const initialState: CalendarStateModel = {
  isInitialized: false,
  events: undefined,
  error: undefined
};

@Injectable()
@State<CalendarStateModel>({
  name: 'calendar',
  defaults: initialState
})
export class CalendarState implements NgxsOnInit {

  constructor(private afAuth: AngularFireAuth, private http: HttpClient) {
  }

  ngxsOnInit({dispatch}: StateContext<CalendarStateModel>): void {
    this.afAuth.authState.pipe(
      tap((state) => {
        if (state) {
          dispatch(FetchCalendar);
        } else {
          dispatch(ResetCalendar);
        }
      })
    ).subscribe();
  }

  // this.af.auth.currentUser.getIdToken(true)

  @Action(FetchCalendar)
  fetch({patchState}: StateContext<CalendarStateModel>): Observable<any> {
    patchState({isInitialized: false});


    // TODO make this an HTTP Interceptor
    return this.afAuth.idToken.pipe(
      first(),
      tap(token => console.log({token})),
      switchMap(token => {
        const headers = {authorization: 'Bearer ' + token};
        const url = environment.baseUrl + '/google-calendar';
        return this.http.get<any>(url, {headers}).pipe(first());
      }),
      tap((events: any[]) => {
        events.forEach(event => {
          event.start = new Date(event.start);
          event.end = new Date(event.end);
        });
        patchState({isInitialized: true, events});
      }),
      catchError((e) => {
        patchState({isInitialized: true, error: e.message});
        return of(e);
      })
    );
  }

  @Action(ResetCalendar)
  reset({patchState}: StateContext<CalendarStateModel>): void {
    patchState({isInitialized: false});
  }
}
