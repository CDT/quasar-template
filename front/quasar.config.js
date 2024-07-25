const { configure } = require('quasar/wrappers');


module.exports = configure(function () {
  return {
    boot: [ 'axios' ],
    css: [ 'app.scss' ],
    extras: [ 'roboto-font', 'material-icons' ],
    build: {
      target: {
        browser: [ 'es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1' ],
        node: 'node20'
      },
      vueRouterMode: 'history',
      env: {
        PROJECT_NAME: 'Quasar项目'
      }
    },
    devServer: {
      open: false
    },
    framework: {
      config: {},
      plugins: ['Notify', 'Loading']
    },
    animations: [],
    ssr: {
      pwa: true,
      prodPort: 3000,
      middlewares: [
        'render'
      ]
    },

    pwa: {
      workboxMode: 'generateSW', // or 'injectManifest'
      injectPwaMetaTags: true,
      swFilename: 'sw.js',
      manifestFilename: 'manifest.json',
      useCredentialsForManifestTag: false
    },

    cordova: {
    },

    capacitor: {
      hideSplashscreen: true
    },

    electron: {
      inspectPort: 5858,
      bundler: 'packager', // 'packager' or 'builder'
      packager: {
      },

      builder: {
        appId: 'quasar-project'
      }
    },

    bex: {
      contentScripts: [
        'my-content-script'
      ],
    }
  }
});
