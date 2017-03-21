declare var System: SystemJSLoader.System;

System.config(JSON.parse('<%= SYSTEM_CONFIG_DEV %>'));

System.config({
  map: {
    'ng2-webstorage': 'ng2-webstorage'
  },
  packages: {
    'ng2-webstorage': {main: 'bundles/core.umd.js', defaultExtension: 'js'}
  }
});
