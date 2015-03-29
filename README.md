very-tiny-http-client
=====================

Merely a wrapper around NodeJS's native `http` and `https` packages.

    npm install --save very-tiny-http-client

Examples
--------

```JavaScript
var httpclient = require('very-tiny-http-client');

httpclient.post({
        url: 'http://example.server:3000/resources',
        data: {
            arbirtrary: "JSON Payload"
        }
    }, function (err, res) {
        if (err) {
            throw err;
        }
        console.log(res);
    });
```

will result in something like:

```
{ headers: 
   { 'x-powered-by': 'Express',
     etag: 'W/"a-b541a50d"',
     date: 'Sun, 29 Mar 2015 18:41:49 GMT',
     connection: 'close' },
  statusCode: 204,
  statusMessage: undefined,
  body: '' }
```

