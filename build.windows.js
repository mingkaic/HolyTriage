const asar = require('asar'); 
const electron = require('electron-prebuilt'); 
const jetpack = require('fs-jetpack');
const q = require('q');

var srcDir; 
var buildDir;
var distDir;
var manifest;

function init() {
	srcDir = jetpack.cwd('./app'); 
	buildDir = jetpack.cwd('./build');
	distDir = jetpack.dir('./dist', { empty: true });
	manifest = buildDir.read('./package.json', json);
	return q();
}

function copyElectron() { 
	return jetpack.copyAsync('./node_modules/electron-prebuilt/dist', distDir.path(), { overwrite: true });
}

function cleanupRuntime() {
	return distDir.removeAsync('resources/default_app'); 
}

function createAsar() { 
	 var deferred = q.defer(); 
	 asar.createPackage(buildDir.path(), distDir.path('resources/app.asar'), function () { 
		 deferred.resolve(); 
	 }); 
	 return deferred.promise; 
}

function updateResources() {
	var deferred = q.defer();

	// Copy your icon from resource folder into build folder.
	jetpack.copy('resources/icon.ico', distDir.path('icon.ico'));

	// Replace Electron icon for your own.
	var rcedit = require('rcedit');
	rcedit(distDir.path('electron.exe'), {
		'icon': jetpack.path('resources/icon.ico'),
		'version-string': {
			'ProductName': manifest.name,
			'FileDescription': manifest.description,
		}
	}, function (err) {
		if (!err) {
			deferred.resolve();
		}
	});
	return deferred.promise;
}

//Rename the electron exe 
function rename() {
	return distDir.renameAsync('electron.exe', manifest.name + '.exe');
}

function createInstaller() {
	var deferred = Q.defer();

	function replace(str, patterns) {
		Object.keys(patterns).forEach(function (pattern) {
			console.log(pattern)
			var matcher = new RegExp('{{' + pattern + '}}', 'g');
			str = str.replace(matcher, patterns[pattern]);
		});
		return str;
	}

	var installScript = jetpack.read('resources/windows/installer.nsi');

	installScript = replace(installScript, {
		name: manifest.name,
		productName: manifest.name,
		version: manifest.version,
		src: distDir.path(),
		dest: jetpack.path('dist/Installer.exe'),
		icon: distDir.path('icon.ico'),
		setupIcon: distDir.path('icon.ico'),
		banner: jetpack.path('resources/windows/banner.bmp'),
	});
	distDir.write('installer.nsi', installScript);

	// Note: NSIS have to be added to PATH (environment variables).
	var nsis = childProcess.spawn('makensis', [distDir.path('installer.nsi')], {
		stdio: 'inherit'
	});

	nsis.on('error', function (err) {
		if (err.message === 'spawn makensis ENOENT') {
			throw "Can't find NSIS. Are you sure you've installed it and"
			+ " added to PATH environment variable?";
		} else {
			throw err;
		}
	});

	nsis.on('close', function () {
		deferred.resolve();
	});

	return deferred.promise;
}

function build() {
	return init()
		.then(copyElectron)
		.then(cleanupRuntime)
		.then(createAsar)
		.then(updateResources)
		.then(rename)
		.then(createInstaller);
}


module.exports = {
	build: build
};