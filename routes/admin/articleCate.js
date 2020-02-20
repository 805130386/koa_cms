const router = require('koa-router')()
const Db = require('../../module/database/db')

const {
    cateList
} = require('../../module/tools.js')
router.get('/', async (ctx) => {
    ctx.redirect('/admin/articleCate/list')
})

router.get('/list', async (ctx) => {
    let findRes = await Db.getInstance().find('articleCate', {})
    await ctx.render('admin/articleCate/list', {
        list: cateList(findRes)
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
router.post('/doEdit', async (ctx) => {
    const data = ctx.request.body
    await Db.getInstance().updateOne('articleCate', {
        _id: Db.getObjectId(data.id)
    }, {
        title: data.title,
        des: data.des,
        keywords: data.keywords,
        pid: data.pid
    })
    ctx.redirect('/admin/articleCate/list')
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