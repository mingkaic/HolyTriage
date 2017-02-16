var gulp = require('gulp');
var electron = require('gulp-electron');
var packageJson = require('./src/package.json');
 
gulp.task('electron', function() {
    gulp.src("")
    .pipe(electron({
        src: './src',
        packageJson: packageJson,
        release: './release',
        cache: './cache',
        version: 'v1.4.12',
        packaging: true,
        platforms: ['darwin-x64'],
        platformResources: {
            darwin: {
                CFBundleDisplayName: packageJson.name,
                CFBundleIdentifier: packageJson.name,
                CFBundleName: packageJson.name,
                CFBundleVersion: packageJson.version
            }
        }
    }))
    .pipe(gulp.dest(""));
});

gulp.task('default', ['electron']);