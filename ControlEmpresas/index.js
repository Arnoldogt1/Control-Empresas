'use strict';

require('dotenv').config();
const express = require('express');
const app = express();
const {connection} = require('./src/database/connection');
const routescompany = require('./src/routes/controlCompany.routes')
const port = 3008;

connection();

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use('/api', routescompany);

app.listen(port, ()=>{
        console.log(`El servidor está corriendo en el puerto ${port} =D`)
});