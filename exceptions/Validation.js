
class Validation extends Error {
    constructor (message) {
        super(message)
        res.status(400)
    }
}
module.exports = {
    Validation
}