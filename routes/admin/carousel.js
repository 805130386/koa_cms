const router = require('koa-router')()
const Db = require('../../module/database/db')
const {
    getDate
} = require('../../module/tools')
const fs = require('fs')
router.get('/list', async (ctx) => {
    let current = ctx.query.current ? ctx.query.current : 1
    let list = await Db.getInstance().find('carousel', {}, {
        current
    }, {})
    await ctx.render('admin/carousel/list', {
        list,
        current
    })
})

router.get('/add', async (ctx) => {

    await ctx.render('admin/carousel/add')

})

router.post('/doAdd', async (ctx) => {
    let data = ctx.request.body
    let file = ctx.request.files.carousel_file
    let json = {}
    //判断是否上传了文件，如果没有上传则执行删除操作
    if (file.type === 'application/octet-stream') {
        fs.unlinkSync(file.path)
        json.name = data.carousel_name
        json.url = ""
        json.status = data.carousel_status
        json.createTime = getDate()

    } else {
        data.filename = file.path.split('\\')[file.path.split('\\').length - 1]
        json.name = data.carousel_name
        json.url = ctx.state['__HOST__'] + '/upload/images/' + data.filename
        json.status = data.carousel_status
        json.filename = data.filename
        json.createTime = getDate()
    }
    //过滤filename 和 url
    if (!json.filename) {
        json.filename = ''
        json.url = ''
    }
    let count = await Db.getInstance('carousel').count('carousel')
    //更新数据库
    await Db.getInstance().insertOne('carousel', json)

    ctx.redirect('/admin/carousel/list')

})
router.get('/edit', async (ctx) => {
    let {
        id
    } = ctx.query
    let info = await Db.getInstance().find('carousel', {
        _id: Db.getObjectId(id)
    })
    await ctx.render('admin/carousel/edit', {
        info: info[0]
    })
})
router.post('/doEdit', async (ctx) => {
    let data = ctx.request.body
    let file = ctx.request.files.carousel_file
    let json = {}
    let id = data.id
    //判断是否上传了文件，如果没有上传则执行删除操作
    if (file.type === 'application/octet-stream') {
        fs.unlinkSync(file.path)
        json.name = data.carousel_name
        json.url = ""
        json.status = data.carousel_status
    } else {
        data.filename = file.path.split('\\')[file.path.split('\\').length - 1]
        json.name = data.carousel_name
        json.url = ctx.state['__HOST__'] + '/upload/images/' + data.filename
        json.status = data.carousel_status
        json.filename = data.filename
    }
    //过滤filename 和 url
    if (!json.filename) {
        json.filename = ''
        json.url = ''
    }
    //更新数据库
    await Db.getInstance().updateOne('carousel', {
        _id: Db.getObjectId(id)
    }, json)
    //跳转
    ctx.redirect('/admin/carousel/list')
})
router.get('/delete', async (ctx) => {
    let {
        id
    } = ctx.query
    try {
        await Db.getInstance().deleteOne('carousel', {
            _id: Db.getObjectId(id)
        })
        ctx.redirect('/admin/carousel/list')
    } catch (error) {
        console.log(error);
    }
})
router.get('/count', async (ctx) => {
    let count = await Db.getInstance().count('carousel')
    ctx.body = count
})

module.exports = router