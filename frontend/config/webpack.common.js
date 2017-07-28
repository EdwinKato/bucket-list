const webpack = require('webpack');
const helpers = require('./helpers');

const AssetsPlugin = require('assets-webpack-plugin');
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CheckerPlugin = require('awesome-typescript-loader').CheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin');
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ngcWebpack = require('ngc-webpack');

/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const AOT = process.env.BUILD_AOT || helpers.hasNpmFlag('aot');
const METADATA = {
  title: 'yobucketlist',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
  HMR: HMR
};

module.exports = function (options) {
  isProd = options.env === 'production';
  return {

    entry: {

      'polyfills': './src/polyfills.browser.ts',
      'main':      AOT ? './src/main.browser.aot.ts' :
                  './src/main.browser.ts'

    },

    resolve: {

      extensions: ['.ts', '.js', '.json'],

      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [helpers.root('src'), helpers.root('node_modules')],

    },


    module: {

      rules: [

        {
          test: /\.ts$/,
          use: [
            {
              loader: '@angularclass/hmr-loader',
              options: {
                pretty: !isProd,
                prod: isProd
              }
            },
            {
              /**
               *  MAKE SURE TO CHAIN VANILLA JS CODE, I.E. TS COMPILATION OUTPUT.
               */
              loader: 'ng-router-loader',
              options: {
                loader: 'async-import',
                genDir: 'compiled',
                aot: AOT
              }
            },
            {
              loader: 'awesome-typescript-loader',
              options: {
                configFileName: 'tsconfig.webpack.json',
                useCache: !isProd
              }
            },
            {
              loader: 'angular2-template-loader'
            }
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        /**
         * Json loader support for *.json files.
         */
        {
          test: /\.json$/,
          use: 'json-loader'
        },

        /**
         * To string and css loader support for *.css files (from Angular components)
         * Returns file content as string
         *
         */
        {
          test: /\.css$/,
          use: ['to-string-loader', 'css-loader'],
          exclude: [helpers.root('src', 'styles')]
        },

        /**
         * To string and sass loader support for *.scss files (from Angular components)
         * Returns compiled css content as string
         *
         */
        {
          test: /\.scss$/,
          use: ['to-string-loader', 'css-loader', 'sass-loader'],
          exclude: [helpers.root('src', 'styles')]
        },

        {
          test: /\.html$/,
          use: 'raw-loader',
          exclude: [helpers.root('src/index.html')]
        },

        /**
         * File loader for supporting images, for example, in CSS files.
         */
        {
          test: /\.(jpg|png|gif)$/,
          use: 'file-loader'
        },

        /* File loader for supporting fonts, for example, in CSS files.
        */
        {
          test: /\.(eot|woff2?|svg|ttf)([\?]?.*)$/,
          use: 'file-loader'
        }

      ],

    },

    plugins: [
      new CheckerPlugin(),

      new CommonsChunkPlugin({
        name: 'polyfills',
        chunks: ['polyfills']
      }),

      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       */
      new ContextReplacementPlugin(
        /**
         * The (\\|\/) piece accounts for path separators in *nix and Windows
         */
        /angular(\\|\/)core(\\|\/)@angular/,
        helpers.root('src'), // location of your src
        {
        }
      ),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack.
       */
      new CopyWebpackPlugin([
        { from: 'src/assets', to: 'assets' },
        { from: 'src/meta'}
      ],
        isProd ? { ignore: [ 'mock-data/**/*' ] } : undefined
      ),

      /**
       * Plugin: ScriptExtHtmlWebpackPlugin
       * Description: Enhances html-webpack-plugin functionality
       * with different deployment options for your scripts including:
       */
      new ScriptExtHtmlWebpackPlugin({
        sync: /polyfill|vendor/,
        defaultAttribute: 'async',
        preload: [/polyfill|vendor|main/],
        prefetch: [/chunk/]
      }),

      /*
      * Plugin: HtmlWebpackPlugin
      * Description: Simplifies creation of HTML files to serve your webpack bundles.
      * This is especially useful for webpack bundles that include a hash in the filename
      * which changes every compilation.
      */
      new HtmlWebpackPlugin({
        template: 'src/index.html',
        title: METADATA.title,
        chunksSortMode: 'dependency',
        metadata: METADATA,
        inject: 'body'
      }),

      /**
       * Plugin: HtmlElementsPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require('./head-config.common')
      }),

      new LoaderOptionsPlugin({}),

      new ngcWebpack.NgcWebpackPlugin({
        /**
         * If false the plugin is a ghost, it will not perform any action.
         * This property can be used to trigger AOT on/off depending on your build target (prod, staging etc...)
         *
         * The state can not change after initializing the plugin.
         * @default true
         */
        disabled: !AOT,
        tsConfig: helpers.root('tsconfig.webpack.json'),
        /**
         * A path to a file (resource) that will replace all resource referenced in @Components.
         * For each `@Component` the AOT compiler compiles it creates new representation for the templates (html, styles)
         * of that `@Components`. It means that there is no need for the source templates, they take a lot of
         * space and they will be replaced by the content of this resource.
         *
         * To leave the template as is set to a falsy value (the default).
         *
         * TIP: Use an empty file as an overriding resource. It is recommended to use a ".js" file which
         * usually has small amount of loaders hence less performance impact.
         *
         * > This feature is doing NormalModuleReplacementPlugin for AOT compiled resources.
         *
         * ### resourceOverride and assets
         * If you reference assets in your styles/html that are not inlined and you expect a loader (e.g. url-loader)
         * to copy them, don't use the `resourceOverride` feature as it does not support this feature at the moment.
         * With `resourceOverride` the end result is that webpack will replace the asset with an href to the public
         * assets folder but it will not copy the files. This happens because the replacement is done in the AOT compilation
         * phase but in the bundling it won't happen (it's being replaced with and empty file...)
         *
         * @default undefined
         */
        resourceOverride: helpers.root('config/resource-override.js')
      }),

      /**
       * Plugin: InlineManifestWebpackPlugin
       * Inline Webpack's manifest.js in index.html
       *
       */
      new InlineManifestWebpackPlugin(),
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     */
    node: {
      global: true,
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }

  };
}
