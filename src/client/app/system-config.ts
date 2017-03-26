declare var System: SystemJSLoader.System;

System.config(JSON.parse('<%= SYSTEM_CONFIG_DEV %>'));

System.config({
  map: {
    'ng2-webstorage': 'ng2-webstorage',
    'ng2-pagination': 'ng2-pagination',
    'angular2-google-maps': 'angular2-google-maps',
    'ng2-select': 'ng2-select'
  },
  packages: {
    'ng2-webstorage': {main: 'bundles/core.umd.js', defaultExtension: 'js'},
    'ng2-pagination': {main: 'index.js', defaultExtension: 'js'},
    'angular2-google-maps/core': {main: 'index.js', defaultExtension: 'js'},
    'ng2-select': {main: 'ng2-select.js', defaultExtension: 'js'}
  }
});
