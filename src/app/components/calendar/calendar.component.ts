import {Component} from '@angular/core';
import {Select} from '@ngxs/store';
import {Observable} from 'rxjs';
import {CalendarStateModel} from '../../core/modules/ngxs/store/calendar/calendar.state';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent {
  @Select(state => state.calendar) calendarState$: Observable<CalendarStateModel>;

  constructor() {
  }
}
