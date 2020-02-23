const router = require('koa-router')()
const Db = require('../../module/database/db')
const fs = require('fs')
const {
    getDate
} = require('../../module/tools')
const {
    cateList
} = require('../../module/tools')


//列表页
router.get('/list', async (ctx) => {
    let current = ctx.query.current ? ctx.query.current : 1
    let findRes = await Db.getInstance().find('article', {}, {
        current
    }, {
        sortType: -1
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
    let file = ctx.request.files.file
    data.createTime = getDate()
    if (file.type !== 'application/octet-stream') {
        data.imgPath = file.path.split('\\')[file.path.split('\\').length - 1]
    } else {
        //删除文件
        fs.unlinkSync(file.path)
    }
    try {
        await Db.getInstance().insertOne('article', data)
        ctx.redirect('/admin/article/list')
    } catch (error) {
        console.log(error);
    }
})
router.get('/edit', async (ctx) => {
    let {
        id
    } = ctx.query
    let list = await Db.getInstance().find('articleCate', {})
    let current = await Db.getInstance().find('article', {
        _id: Db.getObjectId(id)
    })
    await ctx.render('admin/article/edit', {
        cateList: cateList(list),
        current: current[0]
    })
})
router.post('/doEdit', async (ctx) => {
    let data = ctx.request.body
    let file = ctx.request.files.file
    if (file.type !== 'application/octet-stream') {
        data.imgPath = file.path.split('\\')[file.path.split('\\').length - 1]
    } else {
        //删除文件
        fs.unlinkSync(file.path)
    }
    try {
        let cateName = await Db.getInstance().find('articleCate', {
            _id: Db.getObjectId(data.pid)
        })
        data.cateName = cateName[0].title
        if (!data.hot) {
            data.hot = '0'
        }
        if (!data.best) {
            data.best = '0'
        }
        //更新数据库


        await Db.getInstance().updateOne('article', {
            _id: Db.getObjectId(data.id)
        }, {
            title: data.title,
            pid: Db.getObjectId(data.pid),
            cateName: data.cateName,
            status: data.status,
            keywords: data.keywords,
            description: data.description,
            content: data.content,
            hot: data.hot,
            best: data.best,
            imgPath: data.imgPath
        })

        ctx.redirect('/admin/article/list')
    } catch (error) {
        console.log(error);
    }

})
//删除内容
router.get('/delete', async (ctx) => {
    let {
        id
    } = ctx.query
    let prePage = ctx.headers.referer
    //数据库删除操作
    await Db.getInstance().deleteOne('article', {
        _id: Db.getObjectId(id)
    })
    //获取内容总条数
    let count = await Db.getInstance().count('article')
    //跳转
    if (prePage && count % 5 !== 0) {
        ctx.redirect(prePage)
    } else {
        ctx.redirect('/admin/article/list')
    }
})
//查询数据条数
router.get('/count', async (ctx) => {
    let findRes = await Db.getInstance().count('article')
    ctx.body = findRes
})
module.exports = router