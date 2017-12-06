const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const connection = require('express-myconnection');
const path = require('path');
const punycode = require('punycode');

const app = express();

app.set('views','./views');
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'root',
        password : 'password',
        database : 'homograph',
        debug    : false
    },'request')
);

app.get('/',function(req,res){
    res.render('index', {data:''});
});

app.get('/demo', function(req, res) {
    console.log('Here 1');
    res.render('demo', {data:''});
});

const router = express.Router();

router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});

var search = router.route('/search/:domain/:radio');

search.get(function (req, res, next){
    var domain = req.params.domain;
    var radio = req.params.radio;
    var newDomain = [];
    var tempstr = '';
    var temp = {};
    var counts = {};
    var count_1 = 0, count_2 = 0, count_3 = 0;
    var multi = [];
    for (let i = 0; i < domain.length; i++) {
        for (let j = 0; j < homoglyph[domain[i]].length; j++) {
            tempstr = domain.substring(0, i) + homoglyph[domain[i]][j] + domain.substring(i + 1);
            temp['ASCII'] = punycode.toASCII(tempstr);
            temp['Punycode'] = punycode.encode(tempstr);
            temp['Unicode'] = tempstr;
            temp['link'] = 'http://www.' + tempstr + '.com';
            count_1 += 1;
            newDomain.push(temp);
            temp = {};
        }
    }
    counts['one'] = count_1;

    if(radio > 1) {
        temp = {};
        for(var i = 0; i < domain.length; i++) {
            for(let i_vars = 0; i_vars < homoglyph[domain[i]].length; i_vars++)
            {
                tempstr = domain.substring(0, i) + homoglyph[domain[i]][i_vars] + domain.substring(i + 1);
                for(let j = i + 1; j < domain.length; j++) {
                    for(let j_vars = 0; j_vars < homoglyph[domain[j]].length; j_vars++){
                        tempstr = tempstr.substring(0, j) + homoglyph[domain[j]][j_vars] + tempstr.substring(j + 1);
                        temp['ASCII'] = punycode.toASCII(tempstr);
                        temp['Punycode'] = punycode.encode(tempstr);
                        temp['Unicode'] = tempstr;
                        temp['link'] = 'http://www.' + tempstr + '.com';
                        newDomain.push(temp);
                        temp = {};
                    }
                }
            }
        }
    }
    for(var i = 0; i < domain.length; i++) {
        for(let i_vars = 0; i_vars < homoglyph[domain[i]].length; i_vars++)
        {
            for(let j = i + 1; j < domain.length; j++) {
                for(let j_vars = 0; j_vars < homoglyph[domain[j]].length; j_vars++){
                    count_2 += 1
                }
            }
        }
    }
    counts['two'] = count_2;

    if(radio > 2) {
        temp = {};
        for (let i = 0; i < domain.length; i++) {
            for(let i_vars = 0; i_vars < homoglyph[domain[i]].length; i_vars++) {
                tempstr = domain.substring(0, i) + homoglyph[domain[i]][i_vars] + domain.substring(i + 1);
                for(let j = i + 1; j < domain.length; j++) {
                    for(let j_vars = 0; j_vars < homoglyph[domain[j]].length; j_vars++){
                        tempstr = tempstr.substring(0, j) + homoglyph[domain[j]][j_vars] + tempstr.substring(j + 1);
                        for(let k = j + 1; k < domain.length; k++) {
                            for(let k_vars = 0; k_vars < homoglyph[domain[k]].length; k_vars++){
                                tempstr = tempstr.substring(0, k) + homoglyph[domain[k]][k_vars] + tempstr.substring(k + 1);
                                temp['ASCII'] = punycode.toASCII(tempstr);
                                temp['Punycode'] = punycode.encode(tempstr);
                                temp['Unicode'] = tempstr;
                                temp['link'] = 'http://www.' + tempstr + '.com';
                                newDomain.push(temp);
                                temp = {};
                            }
                        }
                    }
                }
            }
        }
    }

    for (let i = 0; i < domain.length; i++) {
        for(let i_vars = 0; i_vars < homoglyph[domain[i]].length; i_vars++) {
            for(let j = i + 1; j < domain.length; j++) {
                for(let j_vars = 0; j_vars < homoglyph[domain[j]].length; j_vars++){
                    for(let k = j + 1; k < domain.length; k++) {
                        for(let k_vars = 0; k_vars < homoglyph[domain[k]].length; k_vars++){
                            count_3 += 1
                        }
                    }
                }
            }
        }
    }
    counts['three'] = count_3;
    counts['total'] = count_1 + count_2 + count_3;

    for (var key in multiHomoglyph) {
        if(domain.indexOf(key) != -1) {
            multi.push([key, multiHomoglyph[key]]);
        }
    }

    res.render('index', {data: newDomain, count: counts, multi: multi});
});


var curut = router.route('/demo');

curut.get(function(req,res,next){
    req.getConnection(function(err,conn){
        if (err) return next("Cannot Connect");
        var query = conn.query('SELECT * FROM demo',function(err,rows){
            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }
            res.render('demo', {data:rows});
         });
    });
});

curut.post(function(req, res, next){
    var data = {
        name: req.body.create,
        number: req.body.number,
     };

    req.getConnection(function (err, conn) {
        if (err) return next("Cannot Connect");
        var query = conn.query("INSERT INTO demo set ? ", data, function(err, rows){
           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }
          res.sendStatus(200);
        });
     });
});

var curut2 = router.route('/demo/:user_id');

curut2.get(function(req,res,next){

    var user_id = req.params.user_id;

    req.getConnection(function(err,conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("SELECT * FROM demo WHERE user_id = ? ",[user_id],function(err,rows){

            if(err){
                console.log(err);
                return next("Mysql error, check your query");
            }

            //if user not found
            if(rows.length < 1)
                return res.send("User Not found");

            res.render('demo',{data:rows});
        });

    });

});

//update data
curut2.put(function(req,res,next){
    var user_id = req.params.user_id;
    var data = {
        name:req.body.update,
        number:req.body.number
     };

    req.getConnection(function (err, conn){

        if (err) return next("Cannot Connect");

        var query = conn.query("UPDATE demo set ? WHERE user_id = ? ",[data,user_id], function(err, rows){

           if(err){
                console.log(err);
                return next("Mysql error, check your query");
           }

          res.sendStatus(200);

        });

     });

});

//delete data
curut2.delete(function(req,res,next){

    var user_id = req.params.user_id;

     req.getConnection(function (err, conn) {

        if (err) return next("Cannot Connect");

        var query = conn.query("DELETE FROM demo WHERE user_id = ? ",user_id, function(err, rows){

             if(err){
                console.log(err);
                return next("Mysql error, check your query");
             }

             res.sendStatus(200);

        });

     });
});

app.use('/api', router);

const server = app.listen(3000, function() {
    console.log("Listening to port %s", server.address().port);
});

var homoglyph = {
    'a': ['à','á','â','ã','ä', 'å', 'а'],
    'b': ['Ь'],
    'c': ['ϲ', 'с'],
    'd': ['ď', 'đ', 'ԁ', 'ⅾ'],
    'e': ['é', 'ê', 'ë', 'ē', 'ĕ', 'ė', 'е'],
    'f': [],
    'g': [],
    'h': ['һ'],
    'i': ['і', 'Ꭵ', 'ⅰ'],
    'j': ['ϳ', 'ј'],
    'k': ['K'],
    'l': [],
    'm': ['ⅿ'],
    'n': [],
    'o': ['ο', 'о'],
    'p': ['ρ', 'р'],
    'q': [],
    'r': ['ｒ'],
    's': ['ѕ'],
    't': ['τ'],
    'u': ['⋃'],
    'v': ['ν', 'ѵ', 'ⅴ'],
    'w': ['ѡ'],
    'x': ['х', 'ⅹ'],
    'y': ['у'],
    'z': []
}

var multiHomoglyph = {
    'rn': 'm',
    'cl': 'd',
    'vv': 'w',
    'cj': 'g',
    'cl': 'd',
    'ci': 'a',
    'fi': 'A'
};

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}
