// BASE SETUP
// =============================================================================

// call the packages we need
var express    = require('express');        // call express
var app        = express();                 // define our app using express
var bodyParser = require('body-parser');
var url = require('url') ;
// var dbOperation = require('./dbOperation');
var Q = require('q');
var path = require('path');

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(express.static(__dirname + "/"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });  
    res.send(); 
});


router.get('/angular_project', function(req, res) {  
   res.send();
})


router.route('/auth')
.post(function(req,res){
  var a = req.body.username;
  var authResponse = {
      responseData : {
        token : '123456789'
      }
  }
  res.json({response: authResponse});
  res.send();
});

router.route('/user/role/:S_Id')
.get(function(req,res){
  var authResponse = {
      responseData : [{
        'roleName':'Super Admin'}]
      }
  res.json({response: authResponse});
  res.send();
});

router.route('/user/userInfo/:S_Id')
.get(function(req,res){
  var authResponse = {
      responseData : {
        appLineOfBusiness: {'lineOfBusinessId':2,'displayName':'Puneet'}
      }
    }
  res.json({response: authResponse});
  res.send();
})

router.route('/help/list')
.get(function(req,res) {
  dbOperation.find();   
  res.send();
})

router.route('/event/recentlist/:L_Id/updatedTime')
.get(function(req,res) {
  res.send();
})

router.route('/timezones/list')
.get(function(req,res) {
  var authResponse = {
      responseData : {
        timezoneName: {'IST':2,'PST':'Puneet'}
      }
    }
  res.json({response: authResponse}); 
  res.send();
})

router.route('/event/:E_Id')
.get(function(req,res) {
  dbOperation.findOne(req.params.E_Id,'events','confId').then(function(response){
    var eventListResponse = {
      response : {
        responseData : response
      }
    }
    res.json(eventListResponse);
    res.send();
  },function(err){
    console.log(err);
  })
  
})

router.route('/event/add')
.post(function(req,res){
  var body = req.body;
  dbOperation.create(body,'events','confId').then(function(response){
    var createEventResponse = {
      response : {
        responseData : response
      }
    }
    res.json(createEventResponse);
    res.send();
  },function(err) {
    var createEventResponse = {
      response : {
        status : 'failure'
      }
    }
    res.json(createEventResponse);
    res.send();
  });
})

router.route('/event/update')
.post(function(req,res){

  var body = req.body;
  var eventId = body.confId;
  
  dbOperation.update(body,'events','confId',eventId).then(function(response){
    var updatedEventResponse = {
      response : {
        responseData : response
      }
    }
    res.json(updatedEventResponse);
    res.send();
  },function(err) {
    console.log(err);
  });
})


router.route('/photoUpload/:Upload_Type')
.post(function(req,res){
  
  var filePath = path.resolve("./files/");  

  // var body = req.body;
  // var eventId = body.confId;
  console.log(req);
  process.exit(); 
  var uploadedFile = req.files.uploadPhoto;
    var tmpPath = uploadedFile.path;
    
    var splitForExtnesion = uploadedFile.name.split(".");
    var imageName = splitForExtnesion[0]+'.'+splitForExtnesion[1];
    
    var targetPath = filePath + imageName;
    
    //console.log(req.body['randomNo']);
    fs.rename(tmpPath, targetPath, function(err) {
    if (err) throw err;
    fs.unlink(tmpPath, function() {
        if (err) throw err;
            res.send('File Uploaded to ' + targetPath + ' - ' + uploadedFile.size + ' bytes');
        });
    });

})


router.route('/event/list/:L_Id/startDate')
.get(function(req,res) {
  var a = dbOperation.find("events").then(function(response){
    var eventListResponse = {
      response : {
        responseData : response
      }
    }
    res.json(eventListResponse);
    res.send();
  },function(err){
    console.log(err);
  });
  
})


router.route('/data/dashboard-grid-items-data.json')
.get(function(req,res){
  res.send();
})

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /conferenceApp
app.use('/high-charts', router);
// app.use('/', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
