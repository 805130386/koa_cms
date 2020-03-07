const router = require('koa-router')()
const Db = require('../../module/database/db')
const fs = require('fs')
router.get('/', async (ctx) => {
    let current = await Db.getInstance().find('system', {})
    
    await ctx.render('admin/system/index', {
        current: current[0]
    })
})

router.post('/doEdit', async (ctx) => {
    let {
        id,
        title,
        keywords,
        description,
        address,
        phone,
        ipc
    } = ctx.request.body
    let file = ctx.request.files.logo
    if (file.name !== "") {
        try {
            let filename=file.path.split('\\')
            filename=filename[filename.length-1]
            let json = {
                title,
                keywords,
                description,
                address,
                phone,
                ipc,
                filename
            }
            await Db.getInstance().updateOne('system', {
                _id: Db.getObjectId(id)
            }, json)
            ctx.redirect('/admin/system')
        } catch (error) {
            console.log(error);
        }
    } else {
        //如果为空则删除该文件
        fs.unlinkSync(file.path)
        try {
            let json = {
                title,
                keywords,
                description,
                address,
                phone,
                ipc,
            }
            console.log(json);
            console.log(id);
            
            await Db.getInstance().updateOne('system', {
                _id: Db.getObjectId(id)
            }, json)
            ctx.redirect('/admin/system')
        } catch (error) {
            console.log(error);

        }
    }
    ctx.body = 'doEdit'
})

module.exports = router