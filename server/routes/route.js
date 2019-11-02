const Dependency = require('../models/Dependency')
const ModelDefinition = require('../models/ModelDefinition')
const ModelTestData = require('../models/ModelTestData')
const PathDefinition = require('../models/PathDefinition')
const accountUtil = require('../controller/accountUtil')
const crypto = require('crypto')
// const jwt = require('jsonwebtoken');
// const moment = require('moment');
// const NodeGeocoder = require('node-geocoder');
// var formidable = require('formidable');
const path = require('path')
// var multer = require('multer');
// var fs = require('fs');
var connect = require('connect');
// var FCM = require('fcm-node');
// var nodemailer = require('nodemailer');


module.exports = function(app) {

    app.get('/hello', function(req, res) {
	if(!req.user) {
        res.json({success: false,message: "Unauthorized"}).end();
        return;
	}
        res.send('Welcome back ' + req.user.name).end();
    });

    app.get('/model_defs', function(req, res) {
        ModelDefinition.find(function(err, model_def){
            res.json(model_def).end();
        })
    });

    app.post('/model_def', function(req, res) {
        let newModelDef = new ModelDefinition({
            service_id : req.body.service_id,
            model_name: req.body.model_name,
            model_references: req.body.model_references,
            model_obj: req.body.model_obj
        })
        newModelDef.save(function(err, model_def){
            if(err){
                res.json({msg: 'Failed to add model definition.'})
            }
            else{
                res.json({msg: 'Model definition added successfully.'})
            }
        })
});

app.delete('/model_def/:id', function(req, res) {
    ModelDefinition.remove({_id: req.params.id}, function(err, result){
        if(err){
            res.json(err)
        }
        else{
            res.json(result)
        }
    })
});

}

