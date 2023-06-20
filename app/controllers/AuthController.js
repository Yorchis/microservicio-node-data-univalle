const { User } = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');

module.exports = {
    signIn(req, res) {
        let { email, password } = req.body;
        User.findOne({
            where: {
                email: email
            }
        }).then(user => {
            if (!user) {
                res.status(404).json({ msg: "Usuario con este correo no encontrado" });
            } else {
                if (bcrypt.compareSync(password, user.password)) {
                    // Creamos el token
                    let token = jwt.sign({ user: user }, authConfig.secret, {
                        expiresIn: authConfig.expires
                    });
                    res.json({
                        status: true,
                        token: token
                    })
                } else {
                    res.status(401).json({ message: "Contraseña incorrecta" })
                }
            }
        }).catch(err => {
            res.status(500).json(err);
        })
    },

    signUp(req, res) {
        let { name, email, password } = req.body;
        let psw = bcrypt.hashSync(password, Number.parseInt(authConfig.rounds));
        User.create({
            name: name,
            email: email,
            password: psw
        }).then(user => {
            res.json({
                user: user,
                status: true,
                message: "El usuario ha sido registrado"
            });
        }).catch(err => {
            res.status(500).json(err);
        });
    },

    signOut(req, res) {
        const token = req.headers.authorization.split(' ')[1]; // Assuming token is sent in the Authorization header
        jwt.sign(token, "", { expiresIn: 1 }, (logout, err) => {
            if (logout) {
                res.send({
                    status: true,
                    message: 'Has sido desconectado',
                });
            } else {
                res.send({ msg: 'Error' });
            }
        });
    },

    profileIn(req, res, next) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            console.log(token);
            const decoded = jwt.verify(token, authConfig.secret)
            res.json(decoded);
            next();
        }
        catch (error) {
            return res.status(401).json({
                message: "Auth failed"
            });
        }
    }
}
