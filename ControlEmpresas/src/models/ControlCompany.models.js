'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const company = Schema({
    companylogin:{
        type: String,
        require: true,
    },
    email: String,
    rol: String,
    password: String,
    typecompany:String,
    location:String,
    sucursales: [{
        branchname: String,
        city: String,
    }]
})

module.exports = mongoose.model('companylogin', company);