const client = require('scp2');
const watch = require('node-watch');
const fs = require('fs');

const config = require('./config');

let disableDist = false;

watch(config.source, {
    recursive: true
}, function (evt, name) {
    let diff = name.replace(config.source, '');
    let isDist = false;
    let from = name;
    let to = config.destination + diff;

    // if something happens in dist, copy whole folder (better for lar file count situations)
    if (name.match(/dist\//)) {
        if (disableDist) {
            return;
        }
        isDist = true;
        disableDist = true;

        from = config.source + '/dist';
        to = config.destination + '/dist';
    }

    setTimeout(() => {
        client.scp(from, Object.assign({}, config, {
            path: to
        }), function (err) {
            console.log(`${from} -> ${to}`, err || '');
            
            if (isDist) {
                disableDist = false;
            }
        })
    }, 100); 
});