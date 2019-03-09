var express = require('express'),
    bodyParser = require('body-parser');

var app = express();
var cors = require('cors');
app.use(cors());
app.use(bodyParser.json());

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var ObjectId = require('mongodb').ObjectID;

app.get('/posts', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("posts").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result.length + " objects found");
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});

app.put('/posts/edit', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        var myquery = { "_id": ObjectId(req.body._id) };
        dbo.collection("posts").updateOne(myquery, { $set: { "title": req.body.title } }, function (err, result) {
            if (err) throw err;
            console.log("1 document updated");
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});

app.post('/posts/add', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");

        dbo.collection("posts").insertOne(req.body, function (err, result) {
            if (err) throw err;
            console.log(result);
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});

app.delete('/posts/delete/:objectId', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        var myquery = { "_id": ObjectId(req.params.objectId) };
        dbo.collection("posts").remove(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            res.end(JSON.stringify(obj));
            db.close();
        });
    });
})

// USERS

app.get('/users/all', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("users").find({}).toArray(function (err, result) {
            if (err) throw err;
            console.log(result.length + " objects found");
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});

app.post('/users/login', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("users").find({
            "username": req.body.username,
            "password": req.body.password
        }).toArray(function (err, result) {
            if (err) throw err;
            console.log(result.length + " objects found");
            res.end(JSON.stringify(result));
            db.close();
        });
    });
});

app.post('/users/add', function (req, res) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("test");

        dbo.collection("users").insertOne(req.body, function (err, result) {
            if (err) throw err;
            console.log(result.insertedCount + ",user inserted");
            res.end(JSON.stringify({ id: result.insertedId }));
            db.close();
        });
    });
});

var server = app.listen(8089, function () {
    console.log("listening..");
})