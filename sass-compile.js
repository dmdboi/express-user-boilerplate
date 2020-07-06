var sass = require('node-sass');
var fs = require('fs').promises;

function compileSass(options = {}) {
    // set default options
    options = Object.assign({
        style: 'expanded'
    }, options);

    // render the result
    var result = sass.renderSync({
        file: options.src,
        outputStyle: options.style
    });

    fs.writeFile(options.dest, result.css);

    // log successful compilation to terminal
    return console.log(' ' + options.dest + ' built.');
};

// Minified
compileSass({
    src : './public/stylesheets/main.scss',
    dest : './public/stylesheets/main.min.css',
    style: 'compressed'
});
