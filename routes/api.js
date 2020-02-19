const router = require('koa-router')()

router.get('/', async (ctx) => {
    ctx.body = 'api'
})

module.exports = router