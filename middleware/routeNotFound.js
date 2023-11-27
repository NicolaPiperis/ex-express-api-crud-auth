const { NotFound } = require("../exceptions/NotFound");

module.exports = function () {
    next(new NotFound("Rotta non ricevuta o non corretta"));
};