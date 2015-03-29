var http = require('http');
var https = require('https');
var url = require('url');
var extend = require('node.extend');

function makeHttpOptions(options, method) {

    var host, port, path;
    var secure = options.secure === true;

    if (options.url) {
        var urlinfo = url.parse(options.url);

        secure = urlinfo.protocol === 'https:';

        if (!secure && urlinfo.protocol !== 'http:') {
            return callback(new Error("unsupported url type: " + urlinfo.protocol));
        }

        host = urlinfo.hostname;
        port = urlinfo.port || (secure ? 443 : 80);
        path = urlinfo.path;
    }

    var headers = {
        'Accept': 'application/json'
    };

    var data = options.data;
    if (typeof data === 'object') {
        try {
            data = JSON.stringify(data);
        } catch (err) {
            return err;
        }
    }
    if (typeof data === 'string') {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = data.length;
    }
    options.data = data || '';

    extend(headers, options.headers || {});

    return {
        host: host || options.hostname || options.host,
        port: port || options.port || (secure ? 443 : 80),
        path: path || options.path,
        method: method || 'GET',
        headers: headers || {},
        keepAlive: options.keepAlive === true,
        secure: secure
    };
}

function handleResponse(callback, res) {

    res.setEncoding('utf8');

    var body = "";

    res.on('data', function (chunk) {
        body += chunk;
    });
    
    var response = {
        headers: res.headers,
        statusCode: res.statusCode,
        statusMessage: res.statusMessage
    }

    res.on('end', function () {
        try {
            response.data = JSON.parse(body);
        } catch (err) {}
        response.body = body;
        callback(null, response);
    });

    res.on('error', callback);
}

function request(method) {
    return function (options, callback) {
        var httpOptions = makeHttpOptions(options, method);

        if (httpOptions instanceof Error) {
            return callback(httpOptions);
        }

        var data = options.data;

        var secure = httpOptions.secure;
        delete httpOptions.secure;

        var engine = secure ? https : http;
        var req = engine.request(httpOptions, handleResponse.bind(null, callback));

        req.on('error', callback);

        req.write(data);
        req.end();
    };
}

module.exports = {

    post: request('POST'),

    get: request('GET'),

    put: request('PUT'),

    delete: request('DELETE')
};
