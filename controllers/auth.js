
const {response} = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../helpers/jwt');

const createUser = async ( req, res = response) => {
    
    const { email, password } = req.body;

    try {
        let usuario = await User.findOne({ email })
        console.log(usuario)

        if ( usuario ) {
            return res.status(400).json( {
                ok: false,
                msg: 'Este correo ya esta registrado'
            });
        }

        usuario = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        await usuario.save();

        //Generar nuestro JWT
        const token = await generateJWT( usuario.id, usuario.name)
        
    
        res.status(201).json( {
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        } );
        
    } catch (error) {
        console.log(error);
        res.status(500).json( {
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
    
}

const loginUser = async ( req, res = response) => {

        const { email, password } = req.body;

        try {
            const usuario = await User.findOne({ email })
        // console.log(usuario)

        if ( !usuario ) {
            return res.status(400).json( {
                ok: false,
                msg: 'El ususario no existe con ese email'
            });
        }
        // Confirmar los passwords
        const validPassword = bcrypt.compareSync( password, usuario.password );
        console.log(password)

        if ( !validPassword ) {
            return res.status(400).json( {
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generar nuestro JWT
        const token = await generateToken( usuario.id, usuario.name)


        res.json( {
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

        } catch (error) {
            console.log(error);
            res.status(500).json( {
                ok: false,
                msg: 'Por favor hable con el administrador'
            });
        }
    };

const renewToken = async ( req, res = response) => {

        const { uid, name } = req;

        //Generar un nuevo JWT y retornarlo en esta petición
        const newToken = await generateToken( uid, name);

        res.json( {
            ok: true,
            token: newToken,
        })
    
    }



module.exports = {
    createUser,
    loginUser,
    renewToken
}