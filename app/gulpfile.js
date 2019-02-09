const gulp = require('gulp');
const nodemon = require('gulp-nodemon')
const ts = require('gulp-typescript');
const tsp = ts.createProject('tsconfig.json'); //使用tsconfig.json文件配置tsc
const exec = require('child_process').exec
const clean = require('gulp-rimraf');

//目录常量
const PATHS = {
	scripts: ['src/**/**.ts'],
	output: './build',
};
gulp.task('clean/client', function () {
	return gulp.src('./client/build').pipe(clean())
})

gulp.task('sw', function () {
	exec('sw-precache-cra --no-minify --config sw-config.js', { cwd: './client' })
})
gulp.task('build/client', ['clean/client'], function () {
	exec('react-scripts-ts-antd build', { cwd: './client' }, (err, stdout, stderr) => {
		exec('sw-precache-cra --no-minify --config sw-config.js', { cwd: './client' }, (err, stdout, stderr) => {
			gulp.src('./client/build/**/*.*').pipe(gulp.dest('build/public'))
		})
		console.log(stdout)
		console.log(stderr)

	})
})
gulp.task('test/client', function () {
	exec('react-scripts-ts-antd test --env=jsdom', { cwd: 'client' }, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
	})
})

gulp.task('dev/client', function () {
	exec('react-scripts-ts-antd start', { cwd: 'client', env: { PORT: 3001 } }, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
	})
})

gulp.task('eject/client', function () {
	exec('react-scripts-ts-antd eject', { cwd: 'client' }, (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
	})
})

gulp.task('test/server', function () {
	exec('jest --colors', (err, stdout, stderr) => {
		console.log(stdout)
		console.log(stderr)
	})
})

//编译ts文件
gulp.task('build/server', function () {
	return gulp.src(PATHS.scripts, { ignore: "*.spec.ts" })
		.pipe(tsp())
		.pipe(gulp.dest(PATHS.output))
})

//监视ts文件变化
gulp.task('watch/server', function () {
	gulp.watch(PATHS.scripts, ['build/server'])
})

//自动重启服务器
gulp.task('nodemon', function () {
	return nodemon({
		//nodemon --watch 'src/**/*.ts' --ignore 'src/**/*.spec.ts' --exec ts-node src/server/server.ts
		script: 'src/server.ts',
		exec: "ts-node",
		ignore: "src/**/*.spec.ts",
		ext: 'ts',
		env: { 'NODE_ENV': 'development' }
	})
})

//开发任务
gulp.task('dev/server', ['nodemon'])

gulp.task('dev', ['dev/server', 'dev/client'])
gulp.task('build', ['build/server', 'build/client'])
gulp.task('test', ['test/server', 'test/client'])