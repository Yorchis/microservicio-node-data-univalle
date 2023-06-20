const { User } = require('../models/index');

module.exports = {

    async index(req, res) {
        let usuarios = await User.findAll();
        res.json({
            data: usuarios,
            status: true
        });
    },

}