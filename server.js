// OMS Demo - 无依赖静态文件服务器（Node.js内置模块）
var http = require('http');
var fs = require('fs');
var path = require('path');
var os = require('os');

var PORT = 8081;
var ROOT = __dirname;

var MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.pdf': 'application/pdf',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.map': 'application/json; charset=utf-8'
};

function getLocalIP() {
    var interfaces = os.networkInterfaces();
    for (var name in interfaces) {
        for (var i = 0; i < interfaces[name].length; i++) {
            var addr = interfaces[name][i];
            if (addr.family === 'IPv4' && !addr.internal) return addr.address;
        }
    }
    return '127.0.0.1';
}

var server = http.createServer(function(req, res) {
    var url = decodeURIComponent(req.url.split('?')[0]);
    if (url === '/') url = '/login.html';

    var filePath = path.join(ROOT, url);
    // 防止目录穿越
    if (filePath.indexOf(ROOT) !== 0) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(filePath, function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html; charset=utf-8'});
            res.end('<h1>404 Not Found</h1><p>' + url + '</p><p><a href="/login.html">去登录</a></p>');
            return;
        }
        var ext = path.extname(filePath).toLowerCase();
        var contentType = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, {
            'Content-Type': contentType,
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-cache'
        });
        res.end(data);
    });
});

server.listen(PORT, '0.0.0.0', function() {
    var ip = getLocalIP();
    console.log('========================================');
    console.log('  OMS Demo Server Started');
    console.log('========================================');
    console.log('  Local:    http://127.0.0.1:' + PORT);
    console.log('  Network:  http://' + ip + ':' + PORT);
    console.log('  Login:    http://127.0.0.1:' + PORT + '/login.html');
    console.log('  Account:  oms / oms');
    console.log('========================================');
    console.log('  Press Ctrl+C to stop');
});

server.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.log('Port ' + PORT + ' is in use. Trying to free it...');
    } else {
        console.log('Server error:', err.message);
    }
});
