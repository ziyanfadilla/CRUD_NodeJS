const path = require('path'); // path mengambil lokasi view di path.join 
const express = require('express'); // memanggil modul expes
const app = express();
const bodyParser = require('body-parser'); // untuk mengambil form input / mengget data dari form input

// 
const mysql = require('mysql');//pemanggilan mysql
const connection = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
    database:'exprescrud'
});

//cek koneksi

connection.connect(function(error){
    if (!!error)console.log(error);
    else console.log('Database terkoneksi'); 
});

// mengantur direkotri view
app.set('views', path.join(__dirname,'views'));//tampilan template
//isi
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));//false hny menampung type data 

//crud halaman tampilan awal
app.get('/',(req, res) => {//(req, res request dan respont

    let sql = "SELECT * FROM user";
    let query = connection.query(sql,(err, rows) =>{//
        if (err) throw err;
        res.render('user_index',{
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : rows
        });
    });
});
// add
app.get('/add', (reeq, res) =>{
    res.render('user_add',{
        title : 'CRUD Operation using NodeJS / ExpressJS / MySQL'
    });
});
//adit
app.get('/edit/:userId',(req, res) => {
    const userId = req.params.userId;
    let sql = `Select * from user where id = ${userId}`;
    let query = connection.query(sql,(err, result) => {
        if(err) throw err;
        res.render('user_edit', {
            title : 'CRUD Operation using NodeJS / ExpressJS / MySQL',
            user : result[0]
        });
    });
});

app.post('/update',(req, res) => {
    const userId = req.body.id;
    let sql = "update user SET nama='"+req.body.nama+"',  email='"+req.body.email+"',  telp='"+req.body.telp+"' where id ="+userId;
    let query = connection.query(sql,(err, results) => {
      if(err) throw err;
      res.redirect('/');
    });
});

///delete
app.get('/delete/:userId',(req,res) => {
    const userId = req.params.userId;
    let sql = `DELETE from user where id = ${userId}`;
    let query = connection.query(sql,(err,result) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.post('/save',(req, res) =>{
    let data = {nama : req.body.nama, email:req.body.email, telp:req.body.telp};
    let sql = "INSERT INTO user SET ?";
    let query = connection.query(sql, data,(err, result) =>{
        if(err) throw err;
        res.redirect('/');
    });
});


app.listen(3000, () => {
    console.log('server running at port 3000');
});

