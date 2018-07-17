# Default socket.io server for Node.js

**You absolutely need Node.js v6.0.0 or later or this won't work.**

Install it from [npm](https://www.npmjs.com/package/default-socket.io-server)

## Installing

Using npm:

```bash
$ npm install default-socket.io-server
```

# Example

```javascript
const http = require('http');
const IO = require('default-socket.io-server');
const router = require('node-socket.io-router').Router();

const app = IO({ server: http.createServer().listen(3000), router });
```

# Support

Report bugs on the [issue tracker](https://github.com/darkwar123/node-default-socket.io-server/issues)
