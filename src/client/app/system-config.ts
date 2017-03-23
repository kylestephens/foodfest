declare var System: SystemJSLoader.System;

System.config(JSON.parse('<%= SYSTEM_CONFIG_DEV %>'));

System.config({
  map: {
    'ng2-webstorage': 'ng2-webstorage',
    'ng2-pagination': 'ng2-pagination'
  },
  packages: {
    'ng2-webstorage': {main: 'bundles/core.umd.js', defaultExtension: 'js'},
    'ng2-pagination': {main: 'index.js', defaultExtension: 'js'}
  }
});
