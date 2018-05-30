const express = require('express')
const path = require('path')
const { Nuxt, Builder } = require('nuxt')
const host = process.env.HOST || '0.0.0.0'
const port = process.env.PORT || 80
const app = express()
      app.set('port', port)

// *
// *********
// *

const bodyParser = require('body-parser');          // Form
const session = require('express-session');         // Session
const users = require('./api/users');               // 后台接口api
const views = require('./api/views');               // 前台接口api

    // form
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // session
    app.use( session({
        secret: 'keyboard cat',
        cookie: ('name', 'value', {
            path: '/',
            httpOnly: true,
            secure: false,
            maxAge: 1000*60*60
        }),
        resave: true,
        saveUninitialized: true
    }));
    app.all('/api/users/*', (req, res, next) => {
        // 白名单
        if (req.originalUrl == '/api/users/login') {        // 登录
            return next();
        }
        if (req.originalUrl == '/api/users/homeUser') {     // 用户状态
            return next();
        }
        if (req.originalUrl == '/api/users/logOut') {       // 用户退出
            delete req.session.userId;
            return res.json({
                status: 1,
                session: false,
                info: 'success',
                result: ''
            });
        }
        if (!req.session.userId && req.session.userId!=0 ) {
            return res.json({
                status: 1,
                session: false,
                info: 'no session',
                result: ''
            });
        }
        return next();
    });

    // api
    app.use('/api/users', users);       // 后台
    app.use('/api', views);             // 前端

    // static -> views、users 静态资源
    app.use(express.static(path.join(process.cwd(), 'static')));
    app.get('/users', (req, res, next) => {
        return res.sendFile(process.cwd() + '/static/login.html');
    });

// *
// *********
// *

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
    config.dev = !(process.env.NODE_ENV === 'production')

async function start() {
    // Init Nuxt.js
    const nuxt = new Nuxt(config)
    // Build only in dev mode
    if (config.dev) {
        const builder = new Builder(nuxt)
        await builder.build()
    }
    // Give nuxt middleware to express
    app.use(nuxt.render)
    // Listen the server
    app.listen(port, host)
    console.log('Server listening on http://' + host + ':' + port) // eslint-disable-line no-console
}
start()