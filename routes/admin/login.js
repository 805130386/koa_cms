const router = require('koa-router')()
const tools = require('../../module/tools')

const Db = require('../.././module/database/db')
const svgCaptcha = require('svg-captcha')
const moment = require('moment')


router.get('/', async (ctx) => {
    await ctx.render('admin/login')
})
router.get('/capture', async (ctx) => {
    const captcha = svgCaptcha.create({
        size: 4,
        color: true,
        background: '#cc9966',
        width: 120,
        height: 40,
        ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
        noise: 2, // 干扰线条的数量
        fontSize: 40,
    })
    ctx.session.code = captcha.text
    ctx.type = 'image/svg+xml'
    ctx.body = captcha.data
})
router.post('/doLogin', async (ctx) => {
    let username = ctx.request.body.username.trim()
    let password = ctx.request.body.password.trim()
    let code = ctx.request.body.code.trim()
    if (code.toUpperCase() === ctx.session.code.toUpperCase()) {
        const findRes = await Db.getInstance().find('user', {
            username,
            password: tools.md5(password)
        })
        if (findRes.length > 0) {
            let res = await Db.getInstance().updateOne('user', {
                _id: Db.getObjectId(findRes[0]._id)
            }, {
                lastTime: moment().format('YYYY-MM-DD HH:mm:ss')
            })
            ctx.session.userinfo = findRes[0]
            ctx.redirect('/admin')
        } else {
            ctx.render('admin/error', {
                message: '用户名或密码错误',
                redirect: ctx.state['__HOST__'] + '/admin/login'
            })
        }
    } else {
        ctx.render('admin/error', {
            message: '验证码错误',
            redirect: ctx.state['__HOST__'] + '/admin/login'
        })
    }



})
module.exports = router