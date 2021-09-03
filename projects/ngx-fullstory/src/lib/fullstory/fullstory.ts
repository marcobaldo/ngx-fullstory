import { Inject, PLATFORM_ID, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

import { FullstoryConfig } from '../shared/fullstory-config';

/**
 * A provider with every Fullstory.JS method
 */
export class Fullstory {

  constructor(
    @Inject(FullstoryConfig) private config: FullstoryConfig,
    @Inject(PLATFORM_ID) protected platformId: object,
    @Optional() @Inject(Router) private router: Router
  ) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Run load and attach to window
    this.loadFullstory(config);

    // // Subscribe to router changes
    // if (config && config.updateOnRouterChange) {
    //   this.router.events.subscribe(event => {
    //     this.update()
    //   })
    // }
    // else if (isDevMode()) {
    //   console.warn(`
    //   Common practice in single page applications is to update whenever the route changes.
    //   ng-fullstory supports this functionality out of the box just set 'updateOnRouterChange' to true in your Fullstory Module config.
    //    This warning will not appear in production, if you choose not to use router updating.
    //  `)
    // }
  }

  login(userId: any, data: any) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // This is an example script - don't forget to change it!
    (window as any).FS.identify(userId, data);
  }

  logout() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    // This is an example script - don't forget to change it!
    (window as any).FS.identify(false);
  }

  loadFullstory(config: FullstoryConfig): void {
    const args = arguments;
    const win = (window as any);

    win['_fs_debug'] = (typeof config.fsDebug !== "undefined" ? config.fsDebug : false);
    win['_fs_host'] = config.fsHost || 'fullstory.com';
    win['_fs_script'] = config.fsScript || 'edge.fullstory.com/s/fs.js';
    win['_fs_org'] = config.fsOrg;
    win['_fs_namespace'] = config.fsNameSpace || 'FS';

    const load = (m: any, n: any, e: any, t: any, l: any) => {
        if (e in m) {
            if(m.console?.log) {
                m.console.log('FullStory namespace conflict. Please set window["_fs_namespace"].');
            }
            return;
        }
        const g: any = m[e] = (a: any, b: any, s: any) => { g.q ? g.q.push([a, b, s]) : g._api(a,b, s); };
        g.q = [];
        let o: any = n.createElement(t);
        o.async = 1;
        o.crossOrigin = 'anonymous';
        o.src = 'https://'+ win['_fs_script'];
        let y: any = n.getElementsByTagName(t)[0]; y.parentNode.insertBefore(o, y);
        g.identify = (i: any, v: any, s: any) => { g(l, {uid:i}, s); if(v) g(l, v, s) };
        g.setUserVars = (v: any, s: any) => { g(l, v, s); };
        g.event = (i: any, v: any, s: any) => { g('event', {n: i, p: v}, s); };
        g.anonymize = () => { g.identify(!!0); };
        g.shutdown = () => { g("rec", !1); };
        g.restart = () => { g("rec", !0); };
        g.log = (a: any, b: any) => { g("log", [a, b]); };
        g.consent = (a: any) => { g("consent", !args.length || a); };
        g.identifyAccount = (i: any, v: any) => { o = 'account'; v = v || {}; v.acctId = i; g(o, v); };
        g.clearUserCookie = () => { };
        g.setVars = (nn: any, p: any) => { g('setVars', [nn, p]); };
        g._w = {};
        y = 'XMLHttpRequest';
        g._w[y] = m[y];
        y = 'fetch';
        g._w[y] = m[y];
        if (m[y])
            m[y] = () => g._w[y].apply(this, args);
        g._v = "1.3.0";
    };

    load(win, document, win['_fs_namespace'], 'script', 'user');
  }
}
