const router = require('koa-router')()
const url = require('url')
const Db = require('../module/database/db')
const tools = require('../module/tools')
//配置中间件
router.use(async (ctx, next) => {
    ctx.state['__HOST__'] = 'http://' + ctx.request.header.host
    const pathname = url.parse(ctx.url).pathname
    ctx.state.pathname = pathname
    ctx.state.prePage = ctx.header['referer']
    ctx.state.navList = await Db.getInstance().find('navLink', {})
    let system = await Db.getInstance().find('system', {})
    ctx.state.system = system[0]
    ctx.state.friendLinks = await Db.getInstance().find('friendLink', {})
    await next()
})
router.get('/', async (ctx) => { //首页
    let carousel = await Db.getInstance().find('carousel', {})

    await ctx.render('default/index', {
        list: carousel
    })
})
router.get('/service', async (ctx) => { //开发服务
    await ctx.render('default/service')
})
router.get('/case', async (ctx) => { //成功案例
    await ctx.render('default/case')
})
router.get('/news', async (ctx) => { //新闻资讯
    // 获取分类列表
    let newsTypeId = await Db.getInstance().find('articleCate', {
        title: '新闻中心'
    })
    newsTypeId = newsTypeId[0]._id
    let newsTypeList = await Db.getInstance().find('articleCate', {
        pid: newsTypeId
    })

    //根据news的id获取文章列表
    let newsId = ctx.query.id ? ctx.query.id : newsTypeList[0]._id
    let newsList = await Db.getInstance().find('article', {
        pid: newsId
    })
    await ctx.render('default/news', {
        newsTypeList,
        newsList
    })
})
router.get('/detail', async (ctx) => {
    let {
        id
    } = ctx.query
    let detail = await Db.getInstance().find('article', {
        _id: Db.getObjectId(id)
    })
    detail=detail[0]
    if(detail.cateName.indexOf('新闻')!==-1){
        ctx.state.pathname='/news'
    }
    
    await ctx.render('default/detail',{
        detail
    })
})
router.get('/about', async (ctx) => { //关于我们
    await ctx.render('default/about')
})
router.get('/connect', async (ctx) => { //关于我们
    await ctx.render('default/connect')
})
router.get('*', async (ctx, next) => {
    await next()
    if (ctx.status === 404) {
        ctx.body = '该页面不存在'
    }
})
module.exports = router