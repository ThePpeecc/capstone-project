//getting our gulp parts
const gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    sass = require('gulp-sass'),
    del = require('del')

gulp.task('sass', function() {
    return gulp.src('./public/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./public/css'))
})

gulp.task('clean', function() {
    return del('./public/css')
})

gulp.task('watch:sass', ['clean'], function() {
    gulp.watch('./public/**/*.scss', ['sass'])
})

gulp.task('watch', ['watch:sass'], function() {
    console.log('Ready to watch')
})

//Default is just build
gulp.task('default', function() {

})

//Starts the express server
gulp.task('start', function() {
    nodemon({
        script: 'src/index.js',
        ext: 'js html',
        env: {
            'NODE_ENV': 'development'
        }
    })
})
