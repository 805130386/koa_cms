const router = require('koa-router')()
const Db = require('../../module/database/db')
const {
    getDate
} = require('../../module/tools')
router.get('/', async (ctx) => {
    ctx.redirect('/admin/navLink/list')
})

router.get('/add', async (ctx) => {
    await ctx.render('admin/navLink/add')
})
router.post('/doAdd', async (ctx) => {
    let {name,url}=ctx.request.body
    try {
        await Db.getInstance().insertOne('navLink',{name,url,createTime:getDate()})
        ctx.redirect('/admin/navLink/list')
    } catch (error) {
        console.log(error);
    }
})

router.get('/edit', async (ctx) => {
    let {id}=ctx.query
    let list=await Db.getInstance().find('navLink',{_id:Db.getObjectId(id)})    
    await ctx.render('admin/navLink/edit',{current:list[0]})
})
router.post('/doEdit', async (ctx)=>{
    let {name,url,id}=ctx.request.body
    try {        
        await Db.getInstance().updateOne('navLink',{_id:Db.getObjectId(id)},{name,url})
        ctx.redirect('/admin/navLink/list')
    } catch (error) {
        console.log(error);
    }
})
router.get('/delete', async (ctx) => {
    try {
        let {id}=ctx.query 
        await Db.getInstance().deleteOne('navLink',{_id:Db.getObjectId(id)}) 
        ctx.redirect('/admin/navLink/list')
    } catch (error) {
        console.log(error);
    }
})

router.get('/list', async (ctx) => {
    let current = ctx.query.current ? ctx.query.current : 1

    let list = await Db.getInstance().find('navLink', {}, {
        current
    }, {})
    let total = await Db.getInstance().count('navLink')
    await ctx.render('admin/navLink/list', {
        list,
        total,
        current
    })
})

module.exports = router