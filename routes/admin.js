const router = require('koa-router')()
const ueditor = require('koa2-ueditor')
const user = require('./admin/user')
const login = require('./admin/login')
const articleCate = require('./admin/articleCate')
const article = require('./admin/article')
const carousel = require('./admin/carousel')
const url = require('url')


//配置自定义中间件
router.use(async (ctx, next) => {
    ctx.state['__HOST__'] = 'http://' + ctx.request.header.host
    const pathname = url.parse(ctx.url).pathname
    ctx.state.pathname = pathname
    ctx.state.prePage = ctx.header['referer']
    if (ctx.session.userinfo) {
        ctx.state.username = ctx.session.userinfo.username
    }
    if (ctx.session.userinfo) {
        if (ctx.url !== '/admin/login') {
            await next()
        } else {
            ctx.redirect('/admin')
        }
    } else {
        if (pathname !== '/admin/login' && pathname !== '/admin/login/doLogin' && pathname !== '/admin/login/capture') {
            ctx.redirect('/admin/login')
        } else {
            await next()
        }
    }
})


router.get('/', async (ctx) => {
    await ctx.render('admin/index')
})
router.get('/logOut', async (ctx) => {
    ctx.session.userinfo = null
    ctx.redirect('/admin/login')
})
router.use('/login', login.routes())
router.use('/user', user.routes())
router.use('/articleCate', articleCate.routes())
router.use('/article', article.routes())
router.use('/carousel',carousel.routes())
//注意上传图片的路由   ueditor.config.js配置图片post的地址
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".gif"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}" // 保存为原文件名
}]))
module.exports = router