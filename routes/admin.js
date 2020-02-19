const router = require('koa-router')()
const user = require('./admin/user')
const login = require('./admin/login')
const articleCate = require('./admin/articleCate')
const url = require('url')
//配置自定义中间件
router.use(async (ctx, next) => {    
    ctx.state['__HOST__'] = 'http://' + ctx.request.header.host
    const pathname = url.parse(ctx.url).pathname
    ctx.state.pathname = pathname
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

module.exports = router