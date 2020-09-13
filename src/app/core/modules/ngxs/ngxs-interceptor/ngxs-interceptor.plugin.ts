import {Inject, Injectable, InjectionToken, ModuleWithProviders, NgModule} from '@angular/core';
import {AngularFireAnalytics} from '@angular/fire/analytics';
import {NGXS_PLUGINS, NgxsPlugin} from '@ngxs/store';

export const NGXS_INTERCEPTOR_PLUGIN_OPTIONS = new InjectionToken('NGXS_INTERCEPTOR_PLUGIN_OPTIONS');

@Injectable()
export class NgxsInterceptorPlugin implements NgxsPlugin {
  private ignoredActions = [
    '@@INIT',
    '@@UPDATE_STATE',
    '[Models] Pose Video Frame',
    '[Models] Detect Signing'
  ];

  constructor(@Inject(NGXS_INTERCEPTOR_PLUGIN_OPTIONS) private options: any,
              private analytics: AngularFireAnalytics) {
  }

  handle(before, action, next): any {

    const type = action.type || action.constructor.type;
    const params = this.getEventParams(action, type);

    if (this.ignoredActions.indexOf(type) === -1) {
      this.analytics.logEvent(type, params)
        .then(() => console.debug('logEvent', {type, params}))
        .catch(err => console.error(err));
    }
    return next(before, action);
  }

  private getEventParams(action, type: string): any {
    const ret: any = {};
    if (type.indexOf('[Router]') > -1) {
      for (const k of ['id', 'url', 'urlAfterRedirects']) {
        ret[k] = action.event[k];
      }
    }

    if (action.constructor.eventParams) {
      for (const k of action.constructor.eventParams) {
        ret[k] = action[k];
      }
    }

    return ret;
  }
}

@NgModule()
export class NgxsInterceptorPluginModule {
  static forRoot(config?: any): ModuleWithProviders<NgxsInterceptorPluginModule> {
    return {
      ngModule: NgxsInterceptorPluginModule,
      providers: [
        {
          provide: NGXS_PLUGINS,
          useClass: NgxsInterceptorPlugin,
          multi: true
        },
        {
          provide: NGXS_INTERCEPTOR_PLUGIN_OPTIONS,
          useValue: config
        }
      ]
    };
  }
}
