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

/* eslint-env serviceworker */
/* global WorkboxSW */

// This script is added to app/third_party/ by gulp and swapped for a prod
// file name in production build.
importScripts('/third_party/workbox-sw/workbox-sw.prod.v1.3.0.js');

self.workbox = self.workbox || {};
self.workbox.LOG_LEVEL = 0;

const workbox = new WorkboxSW();

// workbox-build will swap out the empty array with a list of files to precache.
workbox.precache([
  {
    "url": "images/touch/android-chrome-192x192.png",
    "revision": "07464b00b199df2081be1879eba8b2d5"
  },
  {
    "url": "images/touch/android-chrome-512x512.png",
    "revision": "5c53e6d8c734a68776bd479f79f04584"
  },
  {
    "url": "images/touch/apple-touch-icon.png",
    "revision": "6c7cb4b2633f537694f896c951e96f9b"
  },
  {
    "url": "images/touch/browserconfig.xml",
    "revision": "8cdede5414e6e7615a261041cea7c393"
  },
  {
    "url": "images/touch/favicon-16x16.png",
    "revision": "d24fc2371be3e18754f94e82a6446e7e"
  },
  {
    "url": "images/touch/favicon-32x32.png",
    "revision": "bc524ec7444b5b1495abbd798ffb0fd3"
  },
  {
    "url": "images/touch/favicon.ico",
    "revision": "f1c194386ae310a898854d2b12fcd307"
  },
  {
    "url": "images/touch/mstile-150x150.png",
    "revision": "fa3db3434294525d4b76b8c32854a5d5"
  },
  {
    "url": "images/touch/safari-pinned-tab.svg",
    "revision": "9a3ded5d0b5ba5bc605f08d8a6489781"
  },
  {
    "url": "scripts/main.min.js",
    "revision": "5859ccfb557928073d12a296279c5fa1"
  },
  {
    "url": "styles/main.css",
    "revision": "f650fd86c970a9a6bb5a49d9fd170cca"
  },
  {
    "url": "book.html",
    "revision": "c60290e088f3cdf0b5e78b454108ec3d"
  },
  {
    "url": "index.html",
    "revision": "a20398687e36a442f7da459727180fac"
  },
  {
    "url": "manifest.json",
    "revision": "127f5f91c51b7cafcbb1a324c695a614"
  }
]);

// Register route for Google static files.
workbox.router
.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/,
workbox.strategies.staleWhileRevalidate());

// Cloudinary-hosted images
workbox.router.registerRoute('https://res.cloudinary.com/(.*)',
workbox.strategies.staleWhileRevalidate({
  cacheName: 'cloudinary-images'
}));

// Any images loaded from the origin
// workbox.router.registerRoute('/\/images\/(.*)/',
// workbox.strategies.staleWhileRevalidate({
//   cacheName: 'site-images'
// }));

