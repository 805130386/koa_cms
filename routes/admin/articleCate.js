const router = require('koa-router')()
const Db = require('../../module/database/db')
router.get('/', async (ctx) => {
    ctx.redirect('/admin/articleCate/list')
})

router.get('/list', async (ctx) => {
    let findRes = await Db.getInstance().find('articleCate', {})
    let topCate = findRes.filter((val) => {
        val.children = []
        return val.pid === '0'
    })
    topCate.forEach((topVal) => {
        findRes.forEach((val) => {
            if (topVal._id.toString() === val.pid.toString()) {
                topVal.children.push(val)
            }
        })
    })
    await ctx.render('admin/articleCate/list', {
        list: topCate
    })
})

router.get('/add', async (ctx) => {
    let findRes = await Db.getInstance().find('articleCate', {})
    let topCate = findRes.filter((val) => {
        val.children = []
        return val.pid === '0'
    })
    console.log(topCate);

    await ctx.render('admin/articleCate/add', {
        list: topCate
    })
})
router.post('/doAdd', async (ctx) => {
    let data = ctx.request.body
    try {
        await Db.getInstance().insertOne('articleCate', data)
        ctx.redirect('/admin/articleCate/list')
    } catch (error) {
        console.log(error);
    }
})
router.get('/edit', async (ctx) => {
    let {
        id
    } = ctx.query
    try {
        let findRes = await Db.getInstance().find('articleCate', {})
        let topCate = findRes.filter((val) => {
            val.children = []
            return val.pid === '0'
        })
        findRes = await Db.getInstance().find('articleCate', {
            _id: Db.getObjectId(id)
        })
        await ctx.render('admin/articleCate/edit', {
            current: findRes[0],
            list: topCate,
        })
    } catch (error) {
        console.log(error);
    }
})
router.get('/delete', async (ctx) => {
    let {
        id
    } = ctx.query
    try {
        await Db.getInstance().deleteOne('articleCate', {
            _id: Db.getObjectId(id)
        })
        ctx.redirect('/admin/articleCate/list')
    } catch (error) {
        console.log(error);

    }
})
module.exports = router