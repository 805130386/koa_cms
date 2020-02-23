const router = require('koa-router')()

router.get('/', async (ctx) => {
    ctx.body = 'home'
})
router.get('*', async (ctx, next) => {
    await next()
    if (ctx.status === 404) {
        ctx.body = '该页面不存在'
    }
})
module.exports = router