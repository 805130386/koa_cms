const router = require('koa-router')()
const Db = require('../../module/database/db')
const {
    cateList
} = require('../../module/tools')
//列表页
router.get('/list', async (ctx) => {
    let current = ctx.query.current ? ctx.query.current : 1
    let findRes = await Db.getInstance().find('article', {}, {
        current
    })
    await ctx.render('admin/article/list', {
        list: findRes,
        current
    }, {
        current
    })
})
router.get('/add', async (ctx) => {
    let findRes = await Db.getInstance().find('articleCate', {})
    await ctx.render('admin/article/add', {
        cateList: cateList(findRes)
    })
})
router.post('/doAdd', async (ctx) => {
    let data = ctx.request.body
    data.imgPath = ctx.request.files.file.path

    ctx.body = 'doAdd'
})
//查询数据条数
router.get('/count', async (ctx) => {
    let findRes = await Db.getInstance().count('article')
    ctx.body = findRes
})
module.exports = router