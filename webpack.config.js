const prod = process.argv[3];
if (prod === 'development') {
    module.exports = require('./webpack.developer');
} else if(prod === 'production'){
    module.exports = require('./webpack.production');
} else {
    module.exports = require('./webpack.test');
}
