const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})) 
app.use(express.json())
const bodyParser= require('body-parser')
app.use(bodyParser.urlencoded({extended: true})) 
var db;

const MongoClient = require('mongodb').MongoClient
app.set('view engine', 'ejs');

MongoClient.connect("mongodb+srv://tmdwid2:dlwlsdl52!@cluster0.ggygzzw.mongodb.net/?retryWrites=true&w=majority", function(err, client){
  if (err) return console.log(err)
     db = client.db('moonDB');

    console.log('DB connected')

  app.listen(8080, function() {
    console.log('listening on 8080')
  })
})


app.get('/', function(req, res) { 
  res.sendFile(__dirname +'/index.html')
  })

app.get('/write', function(req, res) { 
    res.sendFile(__dirname +'/write.html')
  })

  app.get('/login', function(req, res) { 
    res.sendFile(__dirname +'/login.html')
  })

app.get('/list', function(req, res) {
  db.collection('login').find().toArray(function(err, result){
    console.log(result);
    res.render('list.ejs', {loginfo : result})
  })
})

app.post('/community', function(req, res){
  db.collection('login').find({}, {projection: {_id:0, com:1}}).toArray(function(error, comresult){
    if(error) return console.log(error)
    console.log(comresult);
  
    db.collection('login').find({email : req.body.email, password : req.body.password}).toArray(function(err, result){
      if(err) return console.log(err)
      console.log(result);
      res.render('community.ejs', {loginfo : result, cominfo : comresult})
    })
  })
})

  app.post('/add', function(req, res){
    db.collection('config').findOne({name : 'totalcount'}, function(err, result){
      var mycount = result.count;
      db.collection('login').insertOne( { _id : (mycount + 1), email : req.body.email, password : req.body.password, userName : req.body.userName, com : req.body.com } , function(){
        db.collection('config').updateOne({name:'totalcount'}, { $inc: {count:1} }, function(err, result) {
          if(err) return console.log(err)
          console.log('save complete')
          res.render('add.ejs')
        });
      });
    });
    
  });