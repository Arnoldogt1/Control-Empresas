'use strict'

const Companys = require('../models/ControlCompany.models');
const bcrypt = require('bcrypt');
const {generateJWT} = require('../helpers/create-jwt')


// Crea sesión de de una empresa
const compCreate = async (req, res) =>{
    const {companylogin, password} = req.body;
    try{
        let company = await Companys.findOne({companylogin});
        if(company){
            return res.status(400).send({
                message: 'Ya existe una empresa con este nombre',
                ok: false,
                company: company,
            });
        }
        company = new Companys(req.body);

        const saltos = bcrypt.genSaltSync();
        company.password = bcrypt.hashSync(password, saltos);

        company = await company.save();

        const token = await generateJWT(company.id);

        return res.status(200).send({
            message: `${companylogin} se creo correctamente`, token: token
        })

    }catch(err){
        throw new Error(err);
    }
};

const compList = async (req, res) =>{
    try{
        const listcomp = await Companys.find();
        if(!listcomp){
            res.status(404).json({message: 'No has registrado ninguna empresa'});
        }else{
            res.status(200).json({'empresas encontradas': listcomp});
        }
    }catch(err){
        throw Error(err)
    }

};

const compUpdate = async (req, res) =>{
    try{
        const id = req.params.id
        const updatecomp = {...req.body}

        updatecomp.password = updatecomp.password
        ? bcrypt.hashSync(updatecomp.password, bcrypt.genSaltSync())
        : updatecomp.password;
        const changes = await Companys.findByIdAndUpdate(id, updatecomp,{
            new: true,
        });
        if(changes){
            return res.status(200).json({message: 'Los datos se actualizarón correctamente', updatecomp});
        }else{
            res.status(404).send({messag: 'La empresa que busca no existe, verifique bien los datos'})
        }
    }catch(err){
        throw Error(err)
    }

};

const compDelete = async (req, res) =>{
    if(req.user.rol=='EmpresaADMIN'){
    try{
        const id = req.params.id;
        const deletecomp = await Companys.findByIdAndDelete(id);
        res.status(200).json({message: `${id} se elimino correctamente`})
    }catch(err){
        throw new Error(err);0
    }
}else{
    return res.status(500).send({message:'este usuario no tiene permisos de ADMIN'});
}
};

const logincom = async (req, res) =>{
    const {email, password} = req.body;
    try{
        const comp = await Companys.findOne({email});
        if(!comp){
            return res.status(400).send({ok: false, message: 'La empresa no existe'});
        }
        const validPassword = bcrypt.compareSync(
            password, comp.password
        );
        if(!validPassword){
            return res.status(400).send({ok: false, message: 'Contraseña incorrecta'});
        }

        const token = await generateJWT(comp.id, comp.companylogin, comp.email);
        res.json({
            ok:true, id:comp.id, companyname:comp.companylogin, email:comp.email, token,
        });
    }catch (err){
        throw Error(err);
    }
};

const addSucursal = async (req, res) =>{
    try{
        const id = req.params.id;
        const {branchname, city } = req.body;

        const companySucursal = await Companys.findByIdAndUpdate(
            id,
            {
                $push:{
                    sucursales:{
                        branchname: branchname,
                        city: city,
                    },  
                },
            },
            {new: true}
        );
        if (!companySucursal){
            return res.status(404).send({message:'No se encontro la sucursal'});
        }
        return res.status(200).send({companySucursal});
    }catch(err){
        throw Error(err);
    }
};

const editarsucursal = async (req, res) =>{
    const id = req.params.id;
    const {idsucursal, branchname, city } = req.body;
    try{
        const updateSucursal = await Companys.updateOne(
            {_id: id, 'sucursales._id': idsucursal},
            {
                $set:{
                    'sucursal.$.branchname': branchname,
                    'sucursal.$.city': city,
                },
            },
            {new: true}
        );
        if(!updateSucursal){
            return res.status(404).send({message: 'La sucursal que buscas no existe en la db'});
        }
        return res.status(200).send({editarsucursal, message:'Se agrego correctamente la sucursal'});
    }catch (err){
        throw Error(err);
    }
};

const eliminarsucursal = async(req, res) =>{
    const id = req.params.id;
    const {idSucursal} = req.body;
    try{
        const deleteSucursal = await Companys.updateOne(
            {id},
            {
                $pull: { mascotas: {_id: idSucursal}},
            },

        )

    }catch(err){
        throw Error(err);
    }
};
module.exports = {compCreate, compList, compUpdate, compDelete, logincom, addSucursal, eliminarsucursal, editarsucursal};