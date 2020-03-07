const router = require('koa-router')()
const Db = require('../../module/database/db')
const {
    getDate
} = require('../../module/tools')
router.get('/', async (ctx) => {
    ctx.redirect('/admin/friendLink/list')
})

router.get('/add', async (ctx) => {
    await ctx.render('admin/friendLink/add')
})
router.post('/doAdd', async (ctx) => {
    let {name,url}=ctx.request.body
    try {
        await Db.getInstance().insertOne('friendLink',{name,url,createTime:getDate()})
        ctx.redirect('/admin/friendLink/list')
    } catch (error) {
        console.log(error);
    }
})

router.get('/edit', async (ctx) => {
    let {id}=ctx.query
    let list=await Db.getInstance().find('friendLink',{_id:Db.getObjectId(id)})    
    await ctx.render('admin/friendLink/edit',{current:list[0]})
})
router.post('/doEdit', async (ctx)=>{
    let {name,url,id}=ctx.request.body
    try {        
        await Db.getInstance().updateOne('friendLink',{_id:Db.getObjectId(id)},{name,url})
        ctx.redirect('/admin/friendLink/list')
    } catch (error) {
        console.log(error);
    }
})
router.get('/delete', async (ctx) => {
    try {
        let {id}=ctx.query 
        await Db.getInstance().deleteOne('friendLink',{_id:Db.getObjectId(id)}) 
        ctx.redirect('/admin/friendLink/list')
    } catch (error) {
        console.log(error);
    }
})

router.get('/list', async (ctx) => {
    let current = ctx.query.current ? ctx.query.current : 1

    let list = await Db.getInstance().find('friendLink', {}, {
        current
    }, {})
    let total = await Db.getInstance().count('friendLink')
    await ctx.render('admin/friendLink/list', {
        list,
        total,
        current
    })
})

module.exports = router