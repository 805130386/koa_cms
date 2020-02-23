const md5 = require('md5')
const moment = require('moment')
module.exports = {
    md5(str) {
        return md5(str)
    },
    cateList(list) {
        let topCate = list.filter((val) => {
            val.children = []
            return val.pid === '0'
        })
        topCate.forEach((topVal) => {
            list.forEach((val) => {
                if (topVal._id.toString() === val.pid.toString()) {
                    topVal.children.push(val)
                }
            })
        })
        return topCate
    },
    getDate() {
        return moment().format('YYYY-MM-DD HH:mm:ss')
    }
}