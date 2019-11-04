//call the APIs for generation of these models one by one from the UI side.
const ServiceDefinition = require('../models/ServiceDefinition')
const ModelDefinition = require('../models/ModelDefinition')
const ModelTestData = require('../models/ModelTestData')
const PathDefinition = require('../models/PathDefinition')
const ModelReference = require('../models/ModelReference')
const Dependency = require('../models/Dependency')
const accountUtil = require('../controller/accountUtil')
const crypto = require('crypto')
const fs = require("fs");
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

    // Service Definition routes
    app.get('/service_defs', function(req, res) {
        ServiceDefinition.find(function(err, service_def){
            res.json(service_def).end();
        })
    });

    // app.post('/service_def/:id', function(req, res) {
    //     ModelDefinition.remove({_id: req.params.id}, function(err, result){
    //         if(err){
    //             res.json(err)
    //         }
    //         else{
    //             res.json(result)
    //         }
    //     })
    // });

    app.post('/service_def', function(req, res) {
        let newServiceDef = new ServiceDefinition({
            service_name : req.body.service_name,
            version: req.body.version,
            description: req.body.description
        })
        newServiceDef.save(function(err, model_def){
            if(err){
                res.json({msg: 'Failed to add model definition.'})
            }
            else{
                res.json({msg: 'Model definition added successfully.'})
            }
        })
    });
    
    // Model Definitions routes

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

    app.post('/generate_service_def_model_defs', function(req, res) {
        //get service id first and use it from req body
        var jsonContent = JSON.parse(fs.readFileSync('server/routes/PetstoreAPISpec.json', 'utf8').trim());
        let newServiceDef = new ServiceDefinition({
            service_name : jsonContent.info.title,
            version: jsonContent.info.version,
            description: jsonContent.info.description
        })
        newServiceDef.save(function(err, service_def){
            if(err){
                res.json({msg: 'Failed to add service definition.'})
            }
            else{
                var definitions = jsonContent.definitions
                var model_arr = []
                for(var model in definitions) {
                    for (var key in definitions[model]){
                        if ("xml" == key){
                            delete definitions[model]["xml"]
                        }
                    }
                    for(var key in definitions[model].properties){
                        for(var nested_key in definitions[model].properties[key]){
                            if ("xml" == nested_key){
                                delete definitions[model].properties[key]["xml"]
                            }                            
                        }
                    }
                    let newModelDef = new ModelDefinition({
                        service_id : newServiceDef.id,
                        model_name: model,
                        model_obj: definitions[model]
                    })
                    model_arr.push(newModelDef)
                }
                ModelDefinition.insertMany(model_arr, function(err, model_defs){
                    if(err){
                        res.json({msg: 'Failed to add model definitions.'})
                    }
                    else{
                        console.log(model_defs)
                        res.json({msg: 'Model definitions added successfully.'})
                    }
                })
            }
            console.log(service_def)
        })        
    });

// Model Test Data
    // app.post('/model_test_data', function(req, res) {
    //     let newModelTestData = new ModelTestData({
    //         service_id : req.body.service_id,
    //         model_name: req.body.model_name,
    //         model_references: req.body.model_references,
    //         model_obj: req.body.model_obj
    //     })
    //     newModelDef.save(function(err, model_def){
    //         if(err){
    //             res.json({msg: 'Failed to add test data.'})
    //         }
    //         else{
    //             res.json({msg: 'Model test data added successfully.'})
    //         }
    //     })
    // });

    //Model references
    app.post('/model_ref', function(req, res) {
        let newModelRef = new ModelReference({
            service_id : req.body.service_id,
            model_id: req.body.model_id
        })
        newModelRef.save(function(err, model_def){
            if(err){
                res.json({msg: 'Failed to add model Reference.'})
            }
            else{
                res.json({msg: 'Model Reference added successfully.'})
            }
        })
    });
}

