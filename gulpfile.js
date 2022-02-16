const {
src, 
dest, 
parallel, 
series, 
watch
} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const fileinclude = require('gulp-file-include');
const browserSync = require('browser-sync').create();
const svgSprite = require('gulp-svg-sprite');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const webp = require('gulp-webp');

// создаем стили
const styles = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
			outputStyles: 'expand'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(sourcemaps.write('.'))
		.pipe(dest('./app/css'))
		.pipe(browserSync.stream())
}

// конвертируем картинки в webp
const webpImages = () => {
  return src(['./src/**/**.{jpg,jpeg,png}'])
    .pipe(webp())
    .pipe(dest('./app'))
};


// добавляем шаблоны файлов
const htmlInclude = () => {
	return src(['./src/*.html'])
	.pipe(fileinclude({ 
		prefix: '@',
		basepath: '@file'
	}))
	.pipe(dest('./app'))
	.pipe(browserSync.stream())
}

// переносим картинки в apps
const imgToapp = () => {
	return src(['./src/img/**.jpg', './src/img/**.png', './src/img/**.jpeg', './src/img/**.svg'])
		.pipe(dest('./app/img'))
}

// переносим и папки если есть
const folders = () => {
	return src(['./src/img/**'])
	.pipe(dest('./app/img/'))
}

// создаем спрайты
const svgSprites = () => {
	return src('./src/img/**.svg')
		.pipe(svgSprite ({
			mode: {
				stack: {
					sprite: "../sprite.svg"
				}
			}
		}))
		.pipe(dest('./app/img'))
}

// передаем всякую фигню, например, видео, в apps
const source = () => {
	return src('./src/source/**')
		.pipe(dest('./app'))
}

// передаем шрифты
const fonts = () => {
	return src(['./src/fonts/**.woff', './src/fonts/**.woff2'])
		.pipe(dest('./app/fonts'))
}

//передаем скрипты
const js = () => {
	return src('./src/js/**/*.js')
		.pipe(dest('./app/js/'))
}

// очищаем рабочую папку
const clean = () => {
	return del(['app/*'])
}

const watchFiles = () => {
	browserSync.init({
		server: {
			baseDir: "./app",
			index: "index.html"
		}
	});
	
	watch('./src/scss/**/*.scss', styles);
	watch('./src/js/**/*.js', js);
	watch('./src/template-parts/*.html', htmlInclude);
	watch('./src/*.html', htmlInclude);
	watch('./src/img/**.jpg', imgToapp);
	watch('./src/img/**.png', imgToapp);
	watch('./src/img/**.jpeg', imgToapp);
	watch('./src/img/**/**.jpg', webpImages);
	watch('./src/img/**/**.png', webpImages);
	watch('./src/img/**', folders);
	watch('./src/img/**.svg', svgSprites);
	watch('./src/source/**', source);
	watch('./src/fonts/**.woff', fonts);
	watch('./src/fonts/**.woff2', fonts);
}
exports.styles = styles;
exports.styles = styles;
exports.watchFiles = watchFiles;

exports.default = series(clean, parallel(htmlInclude,  fonts, imgToapp, webpImages, source, folders, svgSprites), js, styles, watchFiles);

const stylesBuild = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass({
			outputStyles: 'expand'
		}
		))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(dest('./app/css/'))
}



exports.build = series(clean, parallel(htmlInclude,  fonts, imgToapp, webpImages, source, svgSprites), stylesBuild,  watchFiles);




