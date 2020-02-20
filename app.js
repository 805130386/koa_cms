const Koa = require('koa'),
    router = require('koa-router')(),
    koaBody = require('koa-body'),
    serve = require('koa-static'),
    render = require('koa-art-template'),
    session = require('koa-session'),
    path = require('path')
const app = new Koa()
const tools = require('./module/tools')



//配置静态文件目录
app.use(serve(__dirname + '/public'))
//post请求获取数据和文件上传

app.use(koaBody({
    multipart: true,
    formidable: {
        uploadDir: path.join(__dirname, 'public/upload'), // 设置文件上传目录
        keepExtensions: true, // 保持文件的后缀
    }
}));
//配置session
app.keys = ['some secret hurr'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 86400000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
    sameSite: null,
};
app.use(session(CONFIG, app));
//配置模板引擎
render(app, {
    root: path.join(__dirname, 'views'),
    extname: '.html',
    debug: process.env.NODE_ENV !== 'production'
});
//配置路由
const admin = require('./routes/admin')
const api = require('./routes/api')
const index = require('./routes/index')

router.use('/admin', admin.routes())
router.use('/api', api.routes())
router.use(index.routes())

app.use(router.routes()) //启动路由
app.use(router.allowedMethods())

//监听端口
app.listen(3000)
console.log('http://localhost:3000');