const childProcess = require('child_process'); 
const electron = require('electron-prebuilt'); 
const gulp = require('gulp');
const jetpack = require('fs-jetpack');
const usemin = require('gulp-usemin'); 
const uglify = require('gulp-uglify');
const os = require('os');

const srcDir = jetpack.cwd('./app'); 
const buildDir = jetpack.cwd('./build');

const release_windows = require('./build.windows');

gulp.task('run', function () { 
  childProcess.spawn(electron, ['./app'], { stdio: 'inherit' }); 
});
gulp.task('default', ['run']);

gulp.task('clean', function (callback) { 
	return buildDir.dirAsync('.', { empty: true }); 
});

gulp.task('copy', ['clean'], function () {
	return jetpack.copyAsync('app', buildDir.path(), {
		overwrite: true, matching: [
			'./node_modules/**/*',
			'*.html',
			'*.css',
			'main.js',
			'package.json'
		]
	});
});

gulp.task('build', ['copy'], function () { 
	return gulp.src('./app/index.html') 
		.pipe(usemin({ 
			js: [uglify()] 
		})) 
		.pipe(gulp.dest('build/')); 
});

//  gulp.task('build-electron', ['build'], function () { 
//      switch (os.platform()) { 
//          case 'darwin': 
//          // execute build.osx.js 
//          break; 
//          case 'linux': 
//          // execute build.linux.js 
//          break;
//          case 'win32': 
//          	return release_windows.build(); 
//      } 
// }); 