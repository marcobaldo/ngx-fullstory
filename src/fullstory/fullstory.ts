import { Inject, Injectable, PLATFORM_ID, Optional } from '@angular/core'
import { Router } from '@angular/router'
import { isPlatformBrowser } from '@angular/common'

import { FullstoryConfig } from '../shared/fullstory-config'

@Injectable()
export class Fullstory {

  private id: string

  constructor(
    @Inject(FullstoryConfig) private config: FullstoryConfig,
    @Inject(PLATFORM_ID) protected platformId: Object,
    @Optional() @Inject(Router) private router: Router
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }

    this.loadFullstory(config)
  }

  login(userId: any, data: any) {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }
    (<any>window).FS.identify(userId, data)
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) {
      return
    }
    (<any>window).FS.identify(false)
  }

  loadFullstory(config: FullstoryConfig): void {
    let win = (<any>window);

    win['_fs_debug'] = config.fsDebug || false;
    win['_fs_host'] = config.fsHost || 'fullstory.com';
    win['_fs_org'] = config.fsOrg;
    win['_fs_namespace'] = config.fsNameSpace || 'FS';

    let load = (m: any, n: any, e: any, t: any, l: any) => {
      if (e in m) {
        if (m.console && m.console.log) {
          m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
        }
        return;
      }
      let g: any = m[e] = function (a: any, b: any) {
        g.q ? g.q.push([a, b]) : g._api(a, b);
      };
      g.q = [];
      let o: any = n.createElement(t);
      o.async = 1;
      o.src = 'https://' + win['_fs_host'] + '/s/fs.js';
      let y: any = n.getElementsByTagName(t)[0];
      y.parentNode.insertBefore(o, y);
      g.identify = function (i: any, v: any) {
        g(l, { uid: i });
        if (v) g(l, v)
      };
      g.setUserVars = function (v: any) {
        g(l, v)
      };
      g.shutdown = function () {
        g("rec", !1)
      };
      g.restart = function () {
        g("rec", !0)
      };
      g.consent = function (a: any) {
        g("consent", !arguments.length || a)
      };
      g.identifyAccount = function (i: any, v: any) {
        o = 'account'; v = v || {}; v.acctId = i; g(o, v)
      };
      g.clearUserCookie = function () { };
    };

    load(win, document, win['_fs_namespace'], 'script', 'user');
  }
}
