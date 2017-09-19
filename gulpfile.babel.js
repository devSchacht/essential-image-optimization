/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import path from 'path';
import gulp from 'gulp';
import util from 'gulp-util';
import del from 'del';
import uncss from 'uncss';
import {stream as critical} from 'critical';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import workboxBuild from 'workbox-build';
import gulpLoadPlugins from 'gulp-load-plugins';
import {output as pagespeed} from 'psi';
import pkg from './package.json';
import template from 'gulp-md-template';
import imageminJpegRecompress from 'imagemin-jpeg-recompress';
import imageminSVGO from 'imagemin-svgo';
import rename from 'gulp-rename';
import puppeteer from 'puppeteer';
import glob from 'glob';
import replace from 'replace';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Lint JavaScript
gulp.task('lint', () =>
  gulp.src(['app/scripts/**/*.js','!node_modules/**'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.if(!browserSync.active, $.eslint.failAfterError()))
);

// Optimize images
gulp.task('images', () =>
  gulp.src('app/images/**/*')
    .pipe($.cache($.imagemin([
      imageminJpegRecompress({
        loops: 16, // More loops can take longer, but can sometimes yield smaller JPEGs.
        min: 60,
        max: 80,
        quality: 'high'
      }),
      imageminSVGO({
        precision: 1,
        multipass: true
      })
    ])))
    .pipe(gulp.dest('dist/images'))
    .pipe($.size({title: 'images'}))
);

// Copy all files at the root level (app)
gulp.task('copy', () =>
  gulp.src([
    'app/*',
    '!app/*.html',
    'node_modules/apache-server-configs/dist/.htaccess'
  ], {
    dot: true
  }).pipe(gulp.dest('dist'))
    .pipe($.size({title: 'copy'}))
);

// Compile and automatically prefix stylesheets
gulp.task('styles', () => {
  const AUTOPREFIXER_BROWSERS = [
    'ie >= 10',
    'ie_mob >= 10',
    'ff >= 30',
    'chrome >= 34',
    'safari >= 7',
    'opera >= 23',
    'ios >= 7',
    'android >= 4.4',
    'bb >= 10'
  ];

  // For best performance, don't add Sass partials to `gulp.src`
  return gulp.src([
    'app/styles/**/*.scss',
    'app/styles/**/*.css'
  ])
    .pipe($.newer('.tmp/styles'))
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      precision: 10
    }).on('error', $.sass.logError))
    .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
    .pipe(gulp.dest('.tmp/styles'))
    // Remove unused styles with UnCSS
    .pipe($.if('*.css', $.uncss({
      html: ['dist/*.html']
    })))
    // Minify and optimize styles with cssnano
    .pipe($.if('*.css', $.cssnano()))
    // Concatenate styles
    .pipe($.if('*.css', $.concat('main.css')))
    .pipe($.size({title: 'styles'}))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(gulp.dest('.tmp/styles'));
});

// Concatenate and minify JavaScript. Optionally transpiles ES2015 code to ES5.
// to enable ES2015 support remove the line `"only": "gulpfile.babel.js",` in the
// `.babelrc` file.
gulp.task('scripts', () =>
    gulp.src([
      // Note: Since we are not using useref in the scripts build pipeline,
      //       you need to explicitly list your scripts here in the right order
      //       to be correctly concatenated
      './app/scripts/main.js',
      './node_modules/lazysizes/lazysizes.min.js'
      // Other scripts
    ])
      .pipe($.newer('.tmp/scripts'))
      .pipe($.sourcemaps.init())
      .pipe($.babel())
      .pipe($.sourcemaps.write())
      .pipe(gulp.dest('.tmp/scripts'))
      .pipe($.concat('main.min.js'))
      .pipe($.uglify({preserveComments: 'some'}))
      // Output files
      .pipe($.size({title: 'scripts'}))
      .pipe($.sourcemaps.write('.'))
      .pipe(gulp.dest('dist/scripts'))
      .pipe(gulp.dest('.tmp/scripts'))
);

// Process markdown
gulp.task('markdown', () => {
  // Read the template
  gulp.src('app/index.html')
    // Read the partials for book content
    .pipe(template('app/partials'))
    // Rename this output to book.html
    .pipe(rename('book.html'))
    .pipe(gulp.dest('.tmp'))
    .pipe(gulp.dest('dist'));
});

// Scan your HTML for assets & optimize them
gulp.task('html', () => {
  // return gulp.src('.tmp/*.html')
  return gulp.src('app/index.html')
    // Read the partials for book content
    .pipe(template('app/partials'))

    .pipe($.useref({
      searchPath: '{.tmp,app}',
      noAssets: true
    }))

    // Minify any HTML
    .pipe($.if('*.html', $.htmlmin({
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      removeOptionalTags: true
    })))

    // Output files
    .pipe($.if('*.html', $.size({title: 'html', showFiles: true})))
    .pipe(gulp.dest('.tmp'))

    // Inline critical CSS
    .pipe(critical({
      width: 1440,
      height: 900,
      inline: true,
      css: [
        'app/styles/main.css',
        'app/styles/google-blue.css'
      ],
      base: 'app/',
      minify: true
    }))
    .on('error', (err) => util.log(util.colors.red(err.message)))
    .pipe(gulp.dest('dist'));
});

// Clean output directory
gulp.task('clean', () => del(['.tmp', 'dist/*', 'app/third_party/', '!dist/.git'], {dot: true}));

// Watch files for changes & reload
gulp.task('serve', ['scripts', 'styles', 'html', 'third-party:dev'], () => {
  browserSync({
    notify: false,
    // Customize the Browsersync console logging prefix
    logPrefix: 'WSK',
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: ['.tmp', 'app'],
    port: 3000
  });

  gulp.watch(['app/**/*.html'], reload);
  gulp.watch(['app/**/*.md'], ['html', reload]);
  gulp.watch(['app/styles/**/*.{scss,css}'], ['styles', reload]);
  gulp.watch(['app/scripts/**/*.js'], ['lint', 'scripts', reload]);
  gulp.watch(['app/images/**/*'], reload);
});

// Build and serve the output from the dist build
gulp.task('serve:dist', ['default'], () =>
  browserSync({
    notify: false,
    logPrefix: 'WSK',
    // Allow scroll syncing across breakpoints
    scrollElementMapping: ['main', '.mdl-layout'],
    // Run as an https by uncommenting 'https: true'
    // Note: this uses an unsigned certificate which on first access
    //       will present a certificate warning in the browser.
    // https: true,
    server: 'dist',
    port: 3001
  })
);

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

gulp.task('generate-pdf', async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://images.guide', {
      waitUntil: 'networkidle',
      fullPage: true});

    await page.evaluate(() => {
      const images = document.querySelectorAll('img');
      for (var i = 0; i < images.length; i++) {
        var image = images[i];
        lazySizes.loader.unveil(image);
      }
      return images.length;
    });
    await timeout(10000);

    await page.pdf({path: 'dist/book.pdf', format: 'A4'});
    browser.close();
});

// Build production files, the default task
gulp.task('default', ['clean'], cb =>
  runSequence(
    ['markdown', 'lint', 'html', 'scripts', 'images', 'copy'],
    'styles',
    ['third-party:prod', 'generate-service-worker'],
    'service-worker:prod',
    cb
  )
);

// Run PageSpeed Insights
gulp.task('pagespeed', cb =>
  // Update the below URL to the public URL of your site
  pagespeed('example.com', {
    strategy: 'mobile'
    // By default we use the PageSpeed Insights free (no API key) tier.
    // Use a Google Developer API key if you have one: http://goo.gl/RkN0vE
    // key: 'YOUR_API_KEY'
  }, cb)
);

// Copy over the scripts that are used in importScripts as part of the generate-service-worker task.
gulp.task('third-party:dev', () => {
  return gulp.src(['node_modules/workbox-sw/build/importScripts/workbox-sw.dev.*.js'])
    .pipe($.rename('workbox-sw.dev.js'))
    .pipe(gulp.dest('app/third_party/workbox-sw/'));
});

gulp.task('third-party:prod', () => {
  return gulp.src(['node_modules/workbox-sw/build/importScripts/workbox-sw.prod.*.js'])
    .pipe(gulp.dest('dist/third_party/workbox-sw/'));
});

// See http://www.html5rocks.com/en/tutorials/service-worker/introduction/ for
// an in-depth explanation of what service workers are and why you should care.
// Generate a service worker file that will provide offline functionality for
// local resources. This should only be done for the 'dist' directory, to allow
// live reload to work as expected when serving from the 'app' directory.
gulp.task('generate-service-worker', () => {
  return workboxBuild.injectManifest({
    swSrc: `app/service-worker.js`,
    swDest: `dist/service-worker.js`,
    globDirectory: `dist`,
    // Add/remove glob patterns to match your directory setup.
    globPatterns: [
      // Images will be cached on the fly
      // as they are lazy-loaded in
      `images/touch/**/*`,
      `scripts/**/*.js`,
      `styles/**/*.css`,
      `*.{html,json}`
    ],
    // Translates a static file path to the relative URL that it's served from.
    // This is '/' rather than path.sep because the paths returned from
    // glob always use '/'.
    modifyUrlPrefix: {
      'dist/': ''
    }
  });
});

gulp.task('service-worker:prod', () => {
  const globResults = glob.sync('node_modules/workbox-sw/build/importScripts/workbox-sw.prod.*.js');
  if (globResults.length !== 1) {
    throw new Error('Unable to find the workbox-sw production file.');
  }

  return replace({
    regex: 'workbox-sw.dev.js',
    replacement: path.basename(globResults[0]),
    paths: [
      'dist/service-worker.js'
    ],
    recursive: true,
    silent: true
  });
});

// Load custom tasks from the `tasks` directory
// Run: `npm install --save-dev require-dir` from the command-line
// try { require('require-dir')('tasks'); } catch (err) { console.error(err); }
