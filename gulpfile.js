const gulp = require('gulp');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const markdown = require('gulp-markdown');
const template = require('gulp-md-template');

gulp.task('jpegrecompress', () =>
    gulp.src('images/*.jpg')
    .pipe(imagemin([
        imageminJpegRecompress({
            loops: 4,
            min: 60,
            max: 80,
            quality: 'high'
        })
    ]))
    .pipe(gulp.dest('dist/images'))
);

gulp.task('pngcompress', () =>
    gulp.src('images/*.png')
    .pipe(imagemin([
        imagemin.optipng({optimizationLevel: 5})
    ]))
    .pipe(gulp.dest('dist/images'))
);

// gulp.task('markdown', () => {
//     return gulp.src('index.md')
//         .pipe(markdown())
//         .pipe(gulp.dest('dist'));
// });

gulp.task('markdown', function () {
    return gulp.src('./*.html')
      .pipe(template('./partials'))
      .pipe(gulp.dest('./dist'));
});

gulp.task('copy-js', () =>
    gulp.src('node_modules/lazysizes/lazysizes.min.js')
    .pipe(gulp.dest('dist/js'))
);

gulp.task('default', [
    'jpegrecompress',
    'pngcompress',
    'copy-js'
], () => {
    return true;
});