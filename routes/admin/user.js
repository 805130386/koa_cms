const router = require('koa-router')()
const Db = require('../../module/database/db')
router.get('/', async (ctx) => {
    ctx.redirect('/admin/user/list')
})
//列表页
router.get('/list', async (ctx) => {
    let current = ctx.query.current ? ctx.query.current : 1
    let findRes = await Db.getInstance().find('user', {}, {
        current
    })
    await ctx.render('admin/user/list', {
        list: findRes,
        current
    })
})
//新增用户页
router.get('/add', async (ctx) => {
    await ctx.render('admin/user/add')
})
//新增用户post请求
router.post('/doAdd', async (ctx) => {
    let {
        username,
        password
    } = ctx.request.body
    let findRes = await Db.getInstance().find('user', {
        username
    })
    if (findRes.length > 0) {
        await ctx.render('admin/error', {
            message: '该用户名已存在',

            redirect: ctx.state['__HOST__'] + '/admin'
        })
    } else {
        //新增操作
        await Db.getInstance().insertOne('user', {
            username,
            password,
            status: "1",
            lastTime: ""
        })
        ctx.redirect('/admin/user/list')
    }

})
//改变用户状态
router.get('/changeUserState', async (ctx) => {
    ctx.type = 'json'
    let _id = ctx.query._id
    let status = ctx.query.status
    let username = ctx.query.username
    if (status === '0') {
        status = '1'
    } else {
        status = '0'
    }
    try {
        let res = await Db.getInstance().updateOne('user', {
            _id: Db.getObjectId(_id)
        }, {
            status
        })
        ctx.body = {
            username,
            message: true
        }
    } catch (error) {
        console.log(error);
    }


})
//修改用户页面
router.get('/edit', async (ctx) => {
    let {
        id
    } = ctx.query
    console.log(id);
    let findRes = await Db.getInstance().find('user', {
        _id: Db.getObjectId(id)
    })
    await ctx.render('admin/user/edit', {
        userinfo: findRes[0]
    })
})
//修改用户post操作
router.post('/doEdit', async (ctx) => {
    let {
        password,
        id
    } = ctx.request.body
    try {
        await Db.getInstance().updateOne('user', {
            _id: Db.getObjectId(id)
        }, {
            password
        })
        ctx.redirect('/admin/user/list')
    } catch (error) {
        console.log(error);
    }
})
//删除用户操作
router.get('/delete', async (ctx) => {
    let {
        id
    } = ctx.query
    try {
        let res = await Db.getInstance().deleteOne('user', {
            _id: Db.getObjectId(id)
        })

        ctx.redirect('/admin/user/list')

    } catch (error) {
        console.log(error);
    }
})


//改变文章分类状态
router.get('/changeArticleCateState', async (ctx) => {
    ctx.type = 'json'
    let _id = ctx.query._id
    let status = ctx.query.status
    if (status === '0') {
        status = '1'
    } else {
        status = '0'
    }
    try {
        let res = await Db.getInstance().updateOne('articleCate', {
            _id: Db.getObjectId(_id)
        }, {
            status
        })
        ctx.body = {
            message: true
        }
    } catch (error) {
        console.log(error);
    }


})

//获取用户总条数
router.get('/count', async (ctx) => {
    try {
        let findRes = await Db.getInstance().count('user')
        ctx.body = findRes
    } catch (error) {
        console.log(error);
    }
})
module.exports = router