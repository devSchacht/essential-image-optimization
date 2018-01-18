<<<<<<< HEAD
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
importScripts('/third_party/workbox-sw/workbox-sw.dev.js');

self.workbox = self.workbox || {};
self.workbox.LOG_LEVEL = 0;

const workbox = new WorkboxSW();

// workbox-build will swap out the empty array with a list of files to precache.
workbox.precache([]);

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

=======
// No-op service worker for dev.
>>>>>>> 8617ddead102811108519a85ce54f4de5175fa53
