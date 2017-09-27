<p align="center">
  <a href="https://images.guide/">
    <img src='/app/images/logo-banner.jpg' alt="Essential Image Optimization"/>
  </a>
</p>

<p align="center">
  <a href="https://travis-ci.com/addyosmani/essential-image-optimisation">
    <img alt="Build Status" src="https://travis-ci.com/addyosmani/essential-image-optimisation.svg?token=psYsstqxcc6sppMcnY8H&branch=master">
  </a>
  <a href="https://www.webpagetest.org/result/170901_EM_348e5bd8fa649e122b4684e0e6febc35/">
    <img alt="WebPageTest" src="https://img.shields.io/badge/webpagetest-report-brightgreen.svg">
  </a>
  <a href="https://www.webpagetest.org/lighthouse.php?test=170901_EM_348e5bd8fa649e122b4684e0e6febc35&run=3">
    <img alt="Lighthouse" src="https://img.shields.io/badge/lighthouse-90+-blue.svg">
  </a>
</p>

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

#### Serve the Fully Built & Optimized Site

```sh
$ gulp serve:dist
```

#### Difference Between `serve` & `serve:dist`

It is important to note a difference between the `serve` and `serve:dist` tasks.

* `serve` uses a no-op `service-worker.js` and cannot run offline.
* `serve:dist` uses the `workbox`-generated output and can run offline.

The `serve` task runs on port 3000 and `serve:dist` runs on port 3001.
The main purpose is to ensure that different service workers will not impact each other's environment. 
Using the `workbox`-generated output makes it very difficult to quickly test local changes which is not ideal for a development server environment.

#### Generate a PDF of the book

This repo supports generating a PDF of the book by doing a local checkout, installing our dependencies and then running:

```sh
$ gulp generate-pdf
```

This generates a PDF using the Chrome team's [Puppeteer](https://github.com/GoogleChrome/puppeteer) project.

If doing this involves too many steps and you would like to just use a browser's "Print to PDF" feature, that is also
supported. First, load up the book on [https://images.guide](https://images.guide), scroll down
to ensure all images are lazy-loaded in and then safely print to PDF as per any other web page.

#### Additional repo details

##### Templating

This repo uses a very simplistic templating setup. `app/partials/book.md` is converted from markdown into HTML and 
injected into a primary book template in `app/index.html`. I use `gulp-md-template` to achieve this.

##### Images

The vast majority of images in the book are hosted on my Cloudinary account. If a PR wishes to improve or add any 
additional graphics, feel free to assume you can use `app/images/` to temporarily add them directly. I will take care 
of appending commits that host any graphics back to Cloudinary as needed. Alternatively, just ping me on a PR and I can
usually get back with a Cloudinary-hosted URL for the graphic you want to add.

##### Syntax highlighting

The initial version of this book takes a very barebones approach to syntax highlighting. That said, better highlighting using
a lightweight library like [Prism](http://prismjs.com/) would be a welcome contribution to the project. We would want to
load it in a way that doesn't impact the critical-path performance of the page.

#### Contributing

I'd love your help improving this book. If interested in contributing a pull request, please:

1. Make sure your PR has a valid title and description. 
2. Your PR updates only touch the parts of the repo it needs to. In most cases this will be `app/partials/book.md`.

If updating an opinion or recommendation in the book, please help us by providing data to back the change. This helps equip us with tools to make the best call on such updates.

##### Translations

If interested in translating this book, please file an issue and we can chat. Translations may be something we can cater for
as part of the existing repo or something better handled as a fork. By coordinating with us, we'll have the best chance to
serve readers in a way that keeps all versions of the book as syncronized as possible.


## License

Except as otherwise noted, the content of this book is licensed under the Creative Commons Attribution-NonCommercial-NoDerivs 2.0 Generic (CC BY-NC-ND 2.0) license, and code samples are licensed under the [Apache 2.0 License](http://www.apache.org/licenses/LICENSE-2.0). Copyright Google, 2017.
