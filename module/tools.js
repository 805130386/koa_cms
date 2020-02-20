const md5 = require('md5')
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
    }
}