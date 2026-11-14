var sass = require('sass');
var fs = require('fs').promises;

async function compileSass(options = {}) {
    // set default options
    options = Object.assign({
        style: 'expanded'
    }, options);

    // render the result
    var result = sass.compile(options.src, {
        style: options.style,
        loadPaths: ['node_modules'],
        sourceMap: false
    });

    await fs.writeFile(options.dest, result.css);

    // log successful compilation to terminal
    return console.log(' ' + options.dest + ' built.');
};

// Minified
compileSass({
    src : './public/stylesheets/main.scss',
    dest : './public/stylesheets/main.min.css',
    style: 'compressed'
});
