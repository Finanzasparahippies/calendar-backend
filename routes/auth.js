/* 
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require ('../middlewares/jwt-validator')

const router = Router();

const { createUser, loginUser, renewToken } = require('../controllers/auth');

router.post(
    '/new',
    //middlewares
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe ser de 6 caracteres').isLength({ min: 6}),
        fieldValidator
    ],
    createUser 
    );

router.post(
    '/',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'La contraseña debe ser de 6 caracteres').isLength({ min: 6}),
        fieldValidator
    ],
    loginUser );

router.get('/renew', jwtValidator, renewToken );

module.exports = router;