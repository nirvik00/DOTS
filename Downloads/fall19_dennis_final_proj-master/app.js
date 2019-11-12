const express = require('express');
const exhbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use('/static', express.static('static'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', exhbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');



app.get('/', (req, res) => {
    res.render('index');
});

app.get('/help', (req, res) => {
    res.render('help');
});

function getData(file) {
    var rawdata = fs.readFileSync('static/data/' + file);
    if (rawdata.length === 0) rawdata = '[]';
    var data = JSON.parse(rawdata);
    fdata = JSON.stringify(data);
    return fdata;
}

app.get('/draw', (req, res) => {
    var names = [];
    var dataArr = [];
    fs.readdir('static/data', (err, files) =>{
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        var idx = 0;
        files.forEach(function (file) {
            names.push(file);
            var rawdata = getData(file);
            data = JSON.parse(rawdata);
            for (var j = 0; j < data.length; j++) {
                var str = idx+"-"+file+"-"+data[j].type+"-"+data[j].coords+ "-" +data[j].rotation+ "-" +data[j].level+"-"+ data[j].name+ "|";
                dataArr.push(str);
            }
            idx++;
        });
    });    
    res.render('draw', {
        names: names,
        data:dataArr   
    });
});

app.get('/retrieve', (req, res) => {
    var names = [];
    var dataArr = [];
    fs.readdir('static/data', (err, files) =>{
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        var idx = 0;
        files.forEach(function (file) {
            names.push(file);
            var rawdata = getData(file);
            data = JSON.parse(rawdata);
            for (var j = 0; j < data.length; j++) {
                var str = idx+"-"+file+"-"+data[j].type+"-"+data[j].coords+ "-" +data[j].rotation+ "-" +data[j].level+"-"+ data[j].name+ "|";
                dataArr.push(str);
            }
            idx++;
        });
    });    
    res.render('retrieve', {
        names: names,
        data:dataArr        
    });
});

app.post('/add', (req, res) => {
    var filename = req.body.name + ".json";
    var data = req.body.details;
    data = '[' + data + ']';
    fs.writeFileSync("static/data/" + filename, data);
    res.redirect('/draw');
});

const port = 8080;
app.listen(port, () => {
    console.log('server listening on port: ' + port);
});
