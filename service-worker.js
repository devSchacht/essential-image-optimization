/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/YYPcyY
 */


importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.0.0-alpha.2/workbox-sw.js");









/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "images/hamburger.svg",
    "revision": "d2cb0dda3e8313b990e8dcf5e25d2d0f"
  },
  {
    "url": "images/icons/lightbulb.svg",
    "revision": "8c9fa41fd10124bd50ff27a026372ae2"
  },
  {
    "url": "images/icons/logo.svg",
    "revision": "a1e23ac638258bc05f84eebcd3ee0f1c"
  },
  {
    "url": "images/icons/star.svg",
    "revision": "5de8294cfcc3ced51cc478287fed403b"
  },
  {
    "url": "images/touch/safari-pinned-tab.svg",
    "revision": "9a3ded5d0b5ba5bc605f08d8a6489781"
  },
  {
    "url": "scripts/main.min.js",
    "revision": "f5d2d1888d2ebd32b086a4aa0e379c81"
  },
  {
    "url": "styles/main.css",
    "revision": "f650fd86c970a9a6bb5a49d9fd170cca"
  },
  {
    "url": "book.html",
    "revision": "818c3e09d068e9e5b470afc32f790436"
  },
  {
    "url": "index.html",
    "revision": "fa95dc63e8487d513102f250c9d3bbc4"
  }
].concat(self.__precacheManifest || []);

if (Array.isArray(self.__precacheManifest)) {
  workbox.precaching.suppressWarnings();
  workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
}



workbox.routing.registerRoute(/^https:\/\/res.cloudinary.com/, workbox.strategies.staleWhileRevalidate({ cacheName: "cloudinary-images", plugins: [] }), 'GET');
