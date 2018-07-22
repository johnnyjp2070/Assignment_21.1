var mongoClient = require('mongodb')
var url = 'mongodb://localhost:27017/employee'
const express = require('express')
const app = express()
const bodyParser = require('body-parser')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}))




app.get('/', function(req, res){
    res.send('Welcome')
})

app.get('/create-db', function(req, res){
    mongoClient.connect(url, function(err, db){
        if (err) throw err
        var dbo = db.db('employees')
        dbo.createCollection('employees', function(err, res) {
            if (err) throw err
            console.log('Collection created!')
        db.close()
    })
    })
    res.send('Database and collection with name Employees created')
})

app.post('/insert', function(req, res){
    console.log(req.body)
    data = req.body
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        var myobj = data
        dbo.collection('employees').insertMany(myobj, function(err, res) {
          if (err) throw err
          console.log(res.insertedCount + 'document inserted')
          db.close()
        })
      })
    res.send('1 document inserted')
})

app.get('/employees', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).toArray(function(err, result){
            if (err) throw err
            console.log(result)
            db.close()
        })
      })
})

app.get('/only-designation/:ename', function(req, res){
    name = req.params.ename
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({"ename": name}, { designation: 1 }).toArray(function(err, result){
            if (err) throw err
            console.log(result[0].designation)
            db.close()
        })
      })
})

app.get('/salary-gt-7000', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).toArray(function(err, result){
            if (err) throw err
            const filtered = result.filter( (value, index, array)=>{
                return value.salary > 7000
            })
            console.log(filtered)
            db.close()
        })
      })
})

app.get('/sort-salary', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).sort({salary: 1}).toArray(function(err, result){
            console.log(result)
            db.close()
        })
      })
})

app.get('/salary-5000-40000', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).toArray(function(err, result){
            if (err) throw err
            const filtered = result.filter( (value, index, array)=>{
                if (value.salary > 5000 && value.salary < 40000){
                    return value
                }
            })
            console.log(filtered)
            db.close()
        })
      })
})

app.get('/except-developer', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).toArray(function(err, result){
            if (err) throw err
            const filtered = result.filter( (value, index, array)=>{
                return value.designation != 'developer'
            })
            console.log(filtered)
            db.close()
        })
      })
})

app.get('/sort-city', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).sort({city: -1}).toArray(function(err, result){
            console.log(result)
            db.close()
        })
      })
})

app.get('/city-and-salary', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').find({}).toArray(function(err, result){
            if (err) throw err
            const filtered = result.filter( (value, index, array)=>{
                if (value.salary > 8000 && value.city == 'singapore'){
                    return value
                }
            })
            console.log(filtered)
            db.close()
        })
      })
})

app.get('/drop-employees', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').drop(function(err, result){
            if (err) throw err
            if (result) console.log('Collection Deleted')
            db.close()
        })
      })
})

app.get('/delete-developer', function(req, res){
    mongoClient.connect(url, function(err, db) {
        if (err) throw err
        var dbo = db.db('employees')
        dbo.collection('employees').deleteMany({ designation: /^developer/ },function(err, result){
            console.log('Deleted Successfully')
            db.close()
        })
      })
})

app.listen(3000)
console.log('Server Listening at port 3000')


