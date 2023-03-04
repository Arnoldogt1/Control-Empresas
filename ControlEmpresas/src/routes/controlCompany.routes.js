'use strict'
const express = require('express');
const {Router} = require('express');
const { compCreate, compList, compUpdate, compDelete, logincom, addSucursal, editarsucursal } = require('../controllers/controlCompany.controller');
const api = Router();
const {check} = require('express-validator');
const {validateParams} = require('../middlewares/validate-params');


api.post('/create-company', [
    check('companylogin', 'companylogin es obligatorio').not().isEmpty(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe ser mayor a 8 digitos').isLength({min:8}), validateParams,
],compCreate);

api.put('/update-company/:id',[
    check('companylogin', 'companylogin es obligatorio').not().isEmpty(), validateParams,
],compUpdate);

api.delete('/delet-company/:id', compDelete);
api.get('/read_companys', compList);
api.post('/login', logincom);
api.put('/create-sucursal/:id', addSucursal);
api.put('/editar_sucursal/:id', editarsucursal);
module.exports = api;