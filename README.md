# Essential Image Optimisation

[![Build Status](https://travis-ci.com/addyosmani/essential-image-optimisation.svg?token=psYsstqxcc6sppMcnY8H&branch=master)](https://travis-ci.com/addyosmani/essential-image-optimisation)

## Prerequisites

### [Node.js](https://nodejs.org)

Bring up a terminal and type `node --version`.
Node should respond with a version at or above 0.10.x.

If you require Node, go to [nodejs.org](https://nodejs.org) and click on the big green Install button.

### [Gulp](http://gulpjs.com)

Bring up a terminal and type `gulp --version`.
If Gulp is installed it should return a version number at or above 3.9.x.
If you need to install/upgrade Gulp, open up a terminal and type in the following:

```sh
$ npm install --global gulp
```

*This will install Gulp globally. Depending on your user account, you may need to [configure your system](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md) to install packages globally without administrative privileges.*


### Local dependencies

Next, install the local dependencies the repo requires:

```sh
$ npm install
```

### Building the book

#### Watch For Changes & Automatically Refresh Across Devices

```sh
$ gulp serve
```

This outputs an IP address you can use to locally test and another that can be used on devices
connected to your network.
`serve` does not use [service worker](http://www.html5rocks.com/en/tutorials/service-worker/introduction/)
caching, so your site will stop being available when the web server stops running.

#### Build & Optimize

```sh
$ gulp
```

Build and optimize the current project, ready for deployment.

#### Generate a PDF using Puppeteer

```sh
$ gulp generate-pdf
```

Builds a PDF of the book using the production deployment.

#### Serve the Fully Built & Optimized Site

```sh
$ gulp serve:dist
```

#### Difference Between `serve` & `serve:dist`

It is important to note a difference between the `serve` and `serve:dist` tasks.

* `serve` uses a no-op `service-worker.js` and cannot run offline.
* `serve:dist` uses the `sw-precache`-generated output and can run offline.

The `serve` task runs on port 3000 and `serve:dist` runs on port 3001.
The main purpose is to ensure that different service workers will not impact each other's environment. 
Using the `sw-precache`-generated output makes it very difficult to quickly test local changes which is not ideal for a development server environment.

## License

Copyright Addy Osmani, 2017.
