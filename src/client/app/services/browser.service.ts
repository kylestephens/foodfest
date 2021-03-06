import { Injectable } from '@angular/core';

// TODO - fix -> Typescript does not like using 'new' on a function
@Injectable()
export class BrowserService {

  get() {
    let EMPTY = '',
      UNKNOWN = '?',
      FUNC_TYPE = 'function',
      UNDEF_TYPE = 'undefined',
      OBJ_TYPE = 'object',
      MAJOR = 'major',
      MODEL = 'model',
      NAME = 'name',
      TYPE = 'type',
      VENDOR = 'vendor',
      VERSION = 'version',
      ARCHITECTURE = 'architecture',
      CONSOLE = 'console',
      MOBILE = 'mobile',
      TABLET = 'tablet',
      SMARTTV = 'smarttv';

    let util = {
      has(str1: string, str2: string) {
        if (typeof str1 === 'string') {
          return str2.toLowerCase().indexOf(str1.toLowerCase()) !== -1;
        }
        return null;
      },
      lowerize: function(str: string) {
        return str.toLowerCase();
      }
    };

    let mapper = {
      rgx: function() {
        for (var result: any, i = 0, j, k, p, q, matches, match, args = arguments; i < args.length; i += 2) {
          var regex = args[i],
            props = args[i + 1];
          if (typeof result === UNDEF_TYPE) {
            result = {};
            for (p in props) {
              q = props[p];
              if (typeof q === OBJ_TYPE) {
                result[q[0]] = undefined;
              } else {
                result[q] = undefined;
              }
            }
          }
          for (j = k = 0; j < regex.length; j++) {
              matches = regex[j].exec(this.getUA());
              if (!!matches) {
                for (p = 0; p < props.length; p++) {
                  match = matches[++k];
                  q = props[p];
                  if (typeof q === OBJ_TYPE && q.length > 0) {
                      if (q.length === 2) {
                        if (typeof q[1] === FUNC_TYPE) {
                            result[q[0]] = q[1].call(this, match);
                        } else {
                            result[q[0]] = q[1];
                        }
                    } else if (q.length === 3) {
                        if (typeof q[1] === FUNC_TYPE && !(q[1].exec && q[1].test)) {
                            result[q[0]] = match ? q[1].call(this, match, q[2]) : undefined;
                        } else {
                            result[q[0]] = match ? match.replace(q[1], q[2]) : undefined;
                        }
                    } else if (q.length === 4) {
                        result[q[0]] = match ? q[3].call(this, match.replace(q[1], q[2])) : undefined;
                    }
                  } else {
                    result[q] = match ? match : undefined;
                  }
                }
                break;
              }
          }
          if (!!matches) {
            break;
          }
        }
        return result;
      },
      str: function(str: string, map: any) {
        for (var i in map) {
          if (typeof map[i] === OBJ_TYPE && map[i].length > 0) {
            for (var j = 0; j < map[i].length; j++) {
              if (util.has(map[i][j], str)) {
                return i === UNKNOWN ? undefined : i;
              }
            }
          } else if (util.has(map[i], str)) {
            return i === UNKNOWN ? undefined : i;
          }
        }
        return str;
      }
    };
    let maps = {
      browser: {
        oldsafari: {
          major: { 1: ['/8', '/1', '/3'], 2: '/4', '?': '/' },
          version: {
            '1.0': '/8',
            1.2: '/1',
            1.3: '/3',
            '2.0': '/412',
            '2.0.2': '/416',
            '2.0.3': '/417',
            '2.0.4': '/419',
            '?': '/'
          }
        }
      },
      device: { sprint: { model: { 'Evo Shift 4G': '7373KT' }, vendor: { HTC: 'APA', Sprint: 'Sprint' } } },
      os: {
        windows: {
          version: {
            ME: '4.90',
            'NT 3.11': 'NT3.51',
            'NT 4.0': 'NT4.0',
            2000: 'NT 5.0',
            XP: ['NT 5.1', 'NT 5.2'],
            Vista: 'NT 6.0',
            7: 'NT 6.1',
            8: 'NT 6.2',
            8.1: 'NT 6.3',
            RT: 'ARM'
          }
        }
      }
    };
    let regexes = {
      browser: [
        [/APP-([\w\s-\d]+)\/((\d+)?[\w\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(opera\smini)\/((\d+)?[\w\.-]+)/i, /(opera\s[mobiletab]+).+version\/((\d+)?[\w\.-]+)/i, /(opera).+version\/((\d+)?[\w\.]+)/i, /(opera)[\/\s]+((\d+)?[\w\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/\s(opr)\/((\d+)?[\w\.]+)/i],
        [
          [NAME, 'Opera'], VERSION, MAJOR
        ],
        [/(kindle)\/((\d+)?[\w\.]+)/i, /(lunascape|maxthon|netfront|jasmine|blazer)[\/\s]?((\d+)?[\w\.]+)*/i, /(avant\s|iemobile|slim|baidu)(?:browser)?[\/\s]?((\d+)?[\w\.]*)/i, /(?:ms|\()(ie)\s((\d+)?[\w\.]+)/i, /(rekonq)((?:\/)[\w\.]+)*/i, /(chromium|flock|rockmelt|midori|epiphany|silk|skyfire|ovibrowser|bolt|iron)\/((\d+)?[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(trident).+rv[:\s]((\d+)?[\w\.]+).+like\sgecko/i],
        [
          [NAME, 'IE'], VERSION, MAJOR
        ],
        [/(yabrowser)\/((\d+)?[\w\.]+)/i],
        [
          [NAME, 'Yandex'], VERSION, MAJOR
        ],
        [/(comodo_dragon)\/((\d+)?[\w\.]+)/i],
        [
          [NAME, /_/g, ' '], VERSION, MAJOR
        ],
        [/(chrome|omniweb|arora|[tizenoka]{5}\s?browser)\/v?((\d+)?[\w\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(dolfin)\/((\d+)?[\w\.]+)/i],
        [
          [NAME, 'Dolphin'], VERSION, MAJOR
        ],
        [/((?:android.+)crmo|crios)\/((\d+)?[\w\.]+)/i],
        [
          [NAME, 'Chrome'], VERSION, MAJOR
        ],
        [/version\/((\d+)?[\w\.]+).+?mobile\/\w+\s(safari)/i],
        [VERSION, MAJOR, [NAME, 'Mobile Safari']],
        [/version\/((\d+)?[\w\.]+).+?(mobile\s?safari|safari)/i],
        [VERSION, MAJOR, NAME],
        [/webkit.+?(mobile\s?safari|safari)((\/[\w\.]+))/i],
        [NAME, [MAJOR, mapper.str, maps.browser.oldsafari.major],
          [VERSION, mapper.str, maps.browser.oldsafari.version]
        ],
        [/(konqueror)\/((\d+)?[\w\.]+)/i, /(webkit|khtml)\/((\d+)?[\w\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(navigator|netscape)\/((\d+)?[\w\.-]+)/i],
        [
          [NAME, 'Netscape'], VERSION, MAJOR
        ],
        [/(swiftfox)/i, /(icedragon|iceweasel|camino|chimera|fennec|maemo\sbrowser|minimo|conkeror)[\/\s]?((\d+)?[\w\.\+]+)/i, /(firefox|seamonkey|k-meleon|icecat|iceape|firebird|phoenix)\/((\d+)?[\w\.-]+)/i, /(mozilla)\/((\d+)?[\w\.]+).+rv\:.+gecko\/\d+/i, /(uc\s?browser|polaris|lynx|dillo|icab|doris|amaya|w3m|netsurf|qqbrowser)[\/\s]?((\d+)?[\w\.]+)/i, /(links)\s\(((\d+)?[\w\.]+)/i, /(gobrowser)\/?((\d+)?[\w\.]+)*/i, /(ice\s?browser)\/v?((\d+)?[\w\._]+)/i, /(mosaic)[\/\s]((\d+)?[\w\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(apple(?:coremedia|))\/((\d+)[\w\._]+)/i, /(coremedia) v((\d+)[\w\._]+)/i],
        [NAME, VERSION, MAJOR],
        [/(aqualung|lyssna|bsplayer)\/((\d+)*[\w\.-]+)/i],
        [NAME, VERSION],
        [/(ares|ossproxy)\s((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(audacious|audimusicstream|amarok|bass|core|dalvik|gnomemplayer|music on console|nsplayer|psp-internetradioplayer|videos)\/((\d+)[\w\.-]+)/i, /(clementine|music player daemon)\s((\d+)[\w\.-]+)/i, /(lg player|nexplayer)\s((\d+)[\d\.]+)/i, /player\/(nexplayer|lg player)\s((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(nexplayer)\s((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(flrp)\/((\d+)[\w\.-]+)/i],
        [
          [NAME, 'Flip Player'], VERSION, MAJOR
        ],
        [/(fstream|nativehost|queryseekspider|ia-archiver|facebookexternalhit)/i],
        [NAME],
        [/(gstreamer) souphttpsrc (?:\([^\)]+\)){0,1} libsoup\/((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(htc streaming player)\s[\w_]+\s\/\s((\d+)[\d\.]+)/i, /(java|python-urllib|python-requests|wget|libcurl)\/((\d+)[\w\.-_]+)/i, /(lavf)((\d+)[\d\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(htc_one_s)\/((\d+)[\d\.]+)/i],
        [
          [NAME, /_/g, ' '], VERSION, MAJOR
        ],
        [/(mplayer)(?:\s|\/)(?:(?:sherpya-){0,1}svn)(?:-|\s)(r\d+(?:-\d+[\w\.-]+){0,1})/i],
        [NAME, VERSION],
        [/(mplayer)(?:\s|\/|[unkow-]+)((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(mplayer)/i, /(yourmuze)/i, /(media player classic|nero showtime)/i],
        [NAME],
        [/(nero (?:home|scout))\/((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(nokia\d+)\/((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/\s(songbird)\/((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(winamp)3 version ((\d+)[\w\.-]+)/i, /(winamp)\s((\d+)[\w\.-]+)/i, /(winamp)mpeg\/((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(ocms-bot|tapinradio|tunein radio|unknown|winamp|inlight radio)/i],
        [NAME],
        [/(quicktime|rma|radioapp|radioclientapplication|soundtap|totem|stagefright|streamium)\/((\d+)[\w\.-]+)/i],
        [NAME, VERSION, MAJOR],
        [/(smp)((\d+)[\d\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(vlc) media player - version ((\d+)[\w\.]+)/i, /(vlc)\/((\d+)[\w\.-]+)/i, /(xbmc|gvfs|xine|xmms|irapp)\/((\d+)[\w\.-]+)/i, /(foobar2000)\/((\d+)[\d\.]+)/i, /(itunes)\/((\d+)[\d\.]+)/i],
        [NAME, VERSION, MAJOR],
        [/(wmplayer)\/((\d+)[\w\.-]+)/i, /(windows-media-player)\/((\d+)[\w\.-]+)/i],
        [
          [NAME, /-/g, ' '], VERSION, MAJOR
        ],
        [/windows\/((\d+)[\w\.-]+) upnp\/[\d\.]+ dlnadoc\/[\d\.]+ (home media server)/i],
        [VERSION, MAJOR, [NAME, 'Windows']],
        [/(com\.riseupradioalarm)\/((\d+)[\d\.]*)/i],
        [NAME, VERSION, MAJOR],
        [/(rad.io)\s((\d+)[\d\.]+)/i, /(radio.(?:de|at|fr))\s((\d+)[\d\.]+)/i],
        [
          [NAME, 'rad.io'], VERSION, MAJOR
        ]
      ],
      cpu: [
        [/(?:(amd|x(?:(?:86|64)[_-])?|wow|win)64)[;\)]/i],
        [
          [ARCHITECTURE, 'amd64']
        ],
        [/(ia32(?=;))/i],
        [
          [ARCHITECTURE, util.lowerize]
        ],
        [/((?:i[346]|x)86)[;\)]/i],
        [
          [ARCHITECTURE, 'ia32']
        ],
        [/windows\s(ce|mobile);\sppc;/i],
        [
          [ARCHITECTURE, 'arm']
        ],
        [/((?:ppc|powerpc)(?:64)?)(?:\smac|;|\))/i],
        [
          [ARCHITECTURE, /ower/, '', util.lowerize]
        ],
        [/(sun4\w)[;\)]/i],
        [
          [ARCHITECTURE, 'sparc']
        ],
        [/(ia64(?=;)|68k(?=\))|arm(?=v\d+;)|(?:irix|mips|sparc)(?:64)?(?=;)|pa-risc)/i],
        [ARCHITECTURE, util.lowerize]
      ],
      device: [
        [/\((ipad|playbook);[\w\s\);-]+(rim|apple)/i],
        [MODEL, VENDOR, [TYPE, TABLET]],
        [/applecoremedia\/[\w\.]+ \((ipad)/],
        [MODEL, [VENDOR, 'Apple'],
          [TYPE, TABLET]
        ],
        [/(apple\s{0,1}tv)/i],
        [
          [MODEL, 'Apple TV'],
          [VENDOR, 'Apple']
        ],
        [/(hp).+(touchpad)/i, /(kindle)\/([\w\.]+)/i, /\s(nook)[\w\s]+build\/(\w+)/i, /(dell)\s(strea[kpr\s\d]*[\dko])/i],
        [VENDOR, MODEL, [TYPE, TABLET]],
        [/(kf[A-z]+)\sbuild\/[\w\.]+.*silk\//i],
        [MODEL, [VENDOR, 'Amazon'],
          [TYPE, TABLET]
        ],
        [/\((ip[honed|\s\w*]+);.+(apple)/i],
        [MODEL, VENDOR, [TYPE, MOBILE]],
        [/\((ip[honed|\s\w*]+);/i],
        [MODEL, [VENDOR, 'Apple'],
          [TYPE, MOBILE]
        ],
        [/(blackberry)[\s-]?(\w+)/i, /(blackberry|benq|palm(?=\-)|sonyericsson|acer|asus|dell|huawei|meizu|motorola)[\s_-]?([\w-]+)*/i, /(hp)\s([\w\s]+\w)/i, /(asus)-?(\w+)/i],
        [VENDOR, MODEL, [TYPE, MOBILE]],
        [/\((bb10);\s(\w+)/i],
        [
          [VENDOR, 'BlackBerry'], MODEL, [TYPE, MOBILE]
        ],
        [/android.+((transfo[prime\s]{4,10}\s\w+|eeepc|slider\s\w+|nexus 7))/i],
        [
          [VENDOR, 'Asus'], MODEL, [TYPE, TABLET]
        ],
        [/(sony)\s(tablet\s[ps])/i],
        [VENDOR, MODEL, [TYPE, TABLET]],
        [/(nintendo)\s([wids3u]+)/i],
        [VENDOR, MODEL, [TYPE, CONSOLE]],
        [/((playstation)\s[3portablevi]+)/i],
        [
          [VENDOR, 'Sony'], MODEL, [TYPE, CONSOLE]
        ],
        [/(sprint\s(\w+))/i],
        [
          [VENDOR, mapper.str, maps.device.sprint.vendor],
          [MODEL, mapper.str, maps.device.sprint.model],
          [TYPE, MOBILE]
        ],
        [/(htc)[;_\s-]+([\w\s]+(?=\))|\w+)*/i, /(zte)-(\w+)*/i, /(alcatel|geeksphone|huawei|lenovo|nexian|panasonic|(?=;\s)sony)[_\s-]?([\w-]+)*/i],
        [VENDOR, [MODEL, /_/g, ' '],
          [TYPE, MOBILE]
        ],
        [/\s((milestone|droid(?:[2-4x]|\s(?:bionic|x2|pro|razr))?(:?\s4g)?))[\w\s]+build\//i, /(mot)[\s-]?(\w+)*/i],
        [
          [VENDOR, 'Motorola'], MODEL, [TYPE, MOBILE]
        ],
        [/android.+\s((mz60\d|xoom[\s2]{0,2}))\sbuild\//i],
        [
          [VENDOR, 'Motorola'], MODEL, [TYPE, TABLET]
        ],
        [/android.+((sch-i[89]0\d|shw-m380s|gt-p\d{4}|gt-n8000|sgh-t8[56]9|nexus 10))/i],
        [
          [VENDOR, 'Samsung'], MODEL, [TYPE, TABLET]
        ],
        [/((s[cgp]h-\w+|gt-\w+|galaxy\snexus))/i, /(sam[sung]*)[\s-]*(\w+-?[\w-]*)*/i, /sec-((sgh\w+))/i],
        [
          [VENDOR, 'Samsung'], MODEL, [TYPE, MOBILE]
        ],
        [/(sie)-(\w+)*/i],
        [
          [VENDOR, 'Siemens'], MODEL, [TYPE, MOBILE]
        ],
        [/(maemo|nokia).*(n900|lumia\s\d+)/i, /(nokia)[\s_-]?([\w-]+)*/i],
        [
          [VENDOR, 'Nokia'], MODEL, [TYPE, MOBILE]
        ],
        [/android\s3\.[\s\w-;]{10}((a\d{3}))/i],
        [
          [VENDOR, 'Acer'], MODEL, [TYPE, TABLET]
        ],
        [/android\s3\.[\s\w-;]{10}(lg?)-([06cv9]{3,4})/i],
        [
          [VENDOR, 'LG'], MODEL, [TYPE, TABLET]
        ],
        [/((nexus\s[45]))/i, /(lg)[e;\s-\/]+(\w+)*/i],
        [
          [VENDOR, 'LG'], MODEL, [TYPE, MOBILE]
        ],
        [/android.+((ideatab[a-z0-9\-\s]+))/i],
        [
          [VENDOR, 'Lenovo'], MODEL, [TYPE, TABLET]
        ],
        [/(lg) netcast\.tv/i],
        [VENDOR, [TYPE, SMARTTV]],
        [/(mobile|tablet);.+rv\:.+gecko\//i],
        [TYPE, VENDOR, MODEL]
      ],
      engine: [
        [/APP-([\w\s-\d]+)\/((\d+)?[\w\.]+)/i],
        [
          [NAME, 'Mobile-App'], VERSION
        ],
        [/(presto)\/([\w\.]+)/i, /(webkit|trident|netfront|netsurf|amaya|lynx|w3m)\/([\w\.]+)/i, /(khtml|tasman|links)[\/\s]\(?([\w\.]+)/i, /(icab)[\/\s]([23]\.[\d\.]+)/i],
        [NAME, VERSION],
        [/rv\:([\w\.]+).*(gecko)/i],
        [VERSION, NAME]
      ],
      os: [
        [/microsoft\s(windows)\s(vista|xp)/i],
        [NAME, VERSION],
        [/(windows)\snt\s6\.2;\s(arm)/i, /(windows\sphone(?:\sos)*|windows\smobile|windows)[\s\/]?([ntce\d\.\s]+\w)/i],
        [NAME, [VERSION, mapper.str, maps.os.windows.version]],
        [/(win(?=3|9|n)|win\s9x\s)([nt\d\.]+)/i],
        [
          [NAME, 'Windows'],
          [VERSION, mapper.str, maps.os.windows.version]
        ],
        [/\((bb)(10);/i],
        [
          [NAME, 'BlackBerry'], VERSION
        ],
        [/(blackberry)\w*\/?([\w\.]+)*/i, /(tizen)\/([\w\.]+)/i, /(android|webos|palm\os|qnx|bada|rim\stablet\sos|meego)[\/\s-]?([\w\.]+)*/i],
        [NAME, VERSION],
        [/(symbian\s?os|symbos|s60(?=;))[\/\s-]?([\w\.]+)*/i],
        [
          [NAME, 'Symbian'], VERSION
        ],
        [/mozilla.+\(mobile;.+gecko.+firefox/i],
        [
          [NAME, 'Firefox OS'], VERSION
        ],
        [/(nintendo|playstation)\s([wids3portablevu]+)/i, /(mint)[\/\s\(]?(\w+)*/i, /(joli|[kxln]?ubuntu|debian|[open]*suse|gentoo|arch|slackware|fedora|mandriva|centos|pclinuxos|redhat|zenwalk)[\/\s-]?([\w\.-]+)*/i, /(hurd|linux)\s?([\w\.]+)*/i, /(gnu)\s?([\w\.]+)*/i],
        [NAME, VERSION],
        [/(cros)\s[\w]+\s([\w\.]+\w)/i],
        [
          [NAME, 'Chromium OS'], VERSION
        ],
        [/(sunos)\s?([\w\.]+\d)*/i],
        [
          [NAME, 'Solaris'], VERSION
        ],
        [/\s([frentopc-]{0,4}bsd|dragonfly)\s?([\w\.]+)*/i],
        [NAME, VERSION],
        [/(ip[honead]+)(?:.*os\s*([\w]+)*\slike\smac|;\sopera)/i],
        [
          [NAME, 'iOS'],
          [VERSION, /_/g, '.']
        ],
        [/(mac\sos\sx)\s?([\w\s\.]+\w)*/i],
        [NAME, [VERSION, /_/g, '.']],
        [/(haiku)\s(\w+)/i, /(aix)\s((\d)(?=\.|\)|\s)[\w\.]*)*/i, /(macintosh|mac(?=_powerpc)|plan\s9|minix|beos|os\/2|amigaos|morphos|risc\sos)/i, /(unix)\s?([\w\.]+)*/i],
        [NAME, VERSION]
      ]
    };

    class UAParser {
      ua: any;
      constructor(uastring?: any) {
        let ua = uastring || (window && window.navigator && window.navigator.userAgent ? window.navigator.userAgent.toLowerCase() : EMPTY);
        if (!(this instanceof UAParser)) {
          /* tslint:disable */
          // return
          new UAParser(uastring).getResult();
          /* tslint:enable */
        }
        this.setUA(ua);
      }

      getBrowser() {
        return mapper.rgx.apply(this, regexes.browser);
      };
      getCPU() {
        return mapper.rgx.apply(this, regexes.cpu);
      };
      getDevice() {
        return mapper.rgx.apply(this, regexes.device);
      };
      getEngine() {
        return mapper.rgx.apply(this, regexes.engine);
      };
      getOS() {
        return mapper.rgx.apply(this, regexes.os);
      };
      getResult() {
        return {
          ua: this.getUA(),
          browser: this.getBrowser(),
          engine: this.getEngine(),
          os: this.getOS(),
          device: this.getDevice(),
          cpu: this.getCPU()
        };
      };
      getUA() {
        return this.ua;
      };

      setUA(uastring: any) {
        this.ua = uastring;
        return this;
      };
    }

    /* tslint:disable */
    // Run parser.
    let parser = new UAParser();
    /* tslint:enable */

    // check device type
    let isPhone = true,
        isTablet = false,
        isMobile = true,
        isDesktop = false;
    // TEST 1 - screen size - vague indicator
    let pixelratio = window.devicePixelRatio || 1;

    let comparator = ((window.screen.height > window.screen.width) ? window.screen.height : window.screen.width) / pixelratio;
    if(comparator > 500) {
      isPhone = false;
      isTablet = true;
    }
    if(comparator > 768) {
      isTablet = false;
      isMobile = false;
      isDesktop = true;
    }

     // TEST 2 - ua - more specific
    if (/mobile|android|midp|iphone|ipod|(windows nt 6\.2.+arm|touch)/.test(parser.getUA())) {
      isMobile = true;
      isDesktop = false;
    }
    if (/ipad/.test(parser.getUA())) {
      isPhone = false;
      isTablet = true;
      isMobile = true;
      isDesktop = false;
    }
    if (/Macintosh/.test(parser.getUA())) {
      isPhone = false;
      isTablet = false;
      isMobile = false;
      isDesktop = true;
    }

    // tidy variable to simplify certain if statements
    let is = isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop';

    return {
      'name': parser.getResult().browser.name,
      'version': parser.getResult().browser.version,
      'versionMajor': parser.getResult().browser.major,
      'engineName': parser.getResult().engine.name,
      'engineVersion': parser.getResult().engine.version,
      'osName': parser.getResult().os.name,
      'osVersion': parser.getResult().os.version,
      'deviceVendor': parser.getResult().device.vendor,
      'deviceModel': parser.getResult().device.model,
      'deviceType': is,
      'deviceTouch': ('ontouchstart' in window || navigator.msMaxTouchPoints) || false,
      'screen': {
          'width': window.screen.width,
          'height': window.screen.height,
          'pixelRatio': pixelratio
      }
    };
  }

};
