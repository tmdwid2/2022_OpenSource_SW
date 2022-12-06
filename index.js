const express = require('express');
const app = express();
app.use(express.urlencoded({extended: true})) 
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

  app.get('/logined/mypage', function(req, res) { 
    db.collection('login').find({email: req.body.email, password: req.body.password }).toArray(function(err, result){
      if(err) return console.log(err)
      if(result.length == 0) {
        console.log(result)
        res.send('mypage is not complete....');
      } else {
        console.log(result);
        res.render('mypage.ejs', {loginfo : result})
      }
        
      })
  })

app.get('/list', function(req, res) {
  db.collection('login').find().toArray(function(err, result){
    console.log(result);
    res.render('list.ejs', {loginfo : result})
  })
})

app.post('/logined', function(req, res){
  db.collection('login').find({email: req.body.email, password: req.body.password }).toArray(function(err, result){
    if(err) return console.log(err)
    if(result.length == 0) {
      console.log(result)
      res.send('login is not complete....');
    } else {
      console.log(result);
      res.render('logined.ejs', {loginfo : result})
    }
      
    })

  })

  app.post('/add', function(req, res){
    db.collection('config').findOne({name : 'totalcount'}, function(err, result){
      var mycount = result.count;
      db.collection('login').insertOne( { _id : (mycount + 1), email : req.body.email, password : req.body.password, userName : req.body.userName } , function(){
        db.collection('config').updateOne({name:'totalcount'}, { $inc: {count:1} }, function(err, result) {
          if(err) return console.log(err)
          console.log('save complete')
          res.send('send complete....');
        });
      });
      res.json({ posts: result})
    });
    
  });