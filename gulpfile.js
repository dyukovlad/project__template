var gulp = require('gulp'),
	gutil = require('gulp-util'),
	browserSync = require('browser-sync').create(),
	concat = require('gulp-concat'),
	cssmin = require('gulp-cssmin'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	plumber = require('gulp-plumber'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	clean = require('gulp-clean'),
	filesize = require('gulp-filesize'),
//stripDebug = require('gulp-strip-debug'),
	htmlmin = require('gulp-htmlmin'),
	less = require('gulp-less'),
	path = require('path'),
	changed = require('gulp-changed'),
	watch = require('gulp-watch');

var localhost = 'site.loc';

var paths = {
	css: './src/css/**/*.css',
	js: './src/js/*.js',
	img: './src/img/*',
	less: './src/less/*.less'
};

gulp.task('watch', function(){
	browserSync.init({
		server: {
			baseDir: "./",
			open: 'external',
			host: localhost,
			proxy: localhost,
			port: 8080
		}
	});
	gulp.watch(paths.less, gulp.series('less'));
	gulp.watch(paths.css, gulp.series('cssConcat'));
	gulp.watch('./dist/*.js').on('change', browserSync.reload);
	gulp.watch(paths.js, gulp.series('compress'));
    gulp.watch(paths.img, gulp.series('imagemin'));
	gulp.watch('./*.html').on('change', browserSync.reload);
});


gulp.task('cssConcat', gulp.series(function(done) {
	gulp.src(paths.css)
		.pipe(plumber())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(concat('all.css'))
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist/lib/'))
		.pipe(filesize())
		.pipe(plumber.stop())
		.pipe(browserSync.stream());
	done();
}));

gulp.task('cssMin', function () {
	gulp.src(paths.css)
		.pipe(plumber())
		.pipe(filesize())
		.pipe(cssmin())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/lib/'))
		.pipe(filesize())
		.pipe(plumber.stop())
		.on('error', gutil.log);
});

// gulp.task('less', function () {
// 		gulp.src(paths.less)
// 		.pipe(plumber())
// 		.pipe(less())
// 		.pipe(autoprefixer({
// 			browsers: ['last 2 versions']
// 		}))
// 		.pipe(gulp.dest('./dist/', {
// 			overwrite:true
// 		}))
//         .pipe(browserSync.stream());
// });

gulp.task('less', gulp.series(function(done) {
    gulp.src(paths.less)
		.pipe(plumber())
		.pipe(less())
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(concat('styles.css'))
		.pipe(gulp.dest('./dist/', {
			overwrite:true
		}))
        .pipe(browserSync.stream());
    done();
}));

gulp.task('compress', gulp.series(function(done) {
  	gulp.src(paths.js)
		.pipe(plumber())
	//	.pipe(stripDebug()) 
		.pipe(uglify())
		.pipe(concat('all.js')) 
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('./dist/lib/'))
		.pipe(plumber.stop())
		.pipe(browserSync.stream());
    done();
}));

gulp.task('imagemin', gulp.series(function(done) {
    gulp.src(paths.img)
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/img/'))
        .pipe(plumber.stop())
    done();
}));

gulp.task('clean', function() {
	gulp.src('./dist/*')
		.pipe(clean());
});
	//òîëüêî js
	gulp.task('clean_js', function() {
		gulp.src('./dist/*.js')
			.pipe(clean());
	});
	//òîëüêî css
	gulp.task('clean_css', function() {
		 gulp.src('./dist/*.css')
		.pipe(clean());
	});

gulp.task('minify', function() {
    gulp.src('./*.html')
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest('./dist/'));
});


gulp.task('default', gulp.series( 'watch' ));

