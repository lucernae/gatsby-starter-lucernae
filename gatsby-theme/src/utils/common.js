const path = require(`path`)

exports.PathJoin = (...args) => {
    console.log(args)
    return path.join(...args)
}