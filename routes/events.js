/* 
    Events Routes
    /api/events
*/
const { Router } = require('express');
const { check } = require("express-validator");

const { isDate } = require("../helpers/isDate");
const { fieldValidator } = require('../middlewares/field-validator');
const { jwtValidator } = require("../middlewares/jwt-validator");
const { getEvents,createEvent,updateEvent,deleteEvent } = require("../controllers/events");

const router = Router();
//CRUD de eventos

//Todas tienen que pasar por la validación del JWT
router.use(jwtValidator);

//Obtener eventos
router.get('/',getEvents );


//Crear un nuevo evento
router.post(
    '/',
    [
        check('title', 'El título es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de finalización es obligatoria').custom( isDate ),
        fieldValidator,
    ],
    createEvent
);

//Actualizar evento
router.put('/:id', updateEvent);

//Borrar evento
router.delete('/:id', deleteEvent);

module.exports = router;