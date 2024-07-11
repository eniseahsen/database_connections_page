const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));


const con = mysql.createConnection({
    host: '172.18.1.180',
    user: 'ogrenci',
    password: 'Ogrenci123!', 
    database: 'DBPersonel'
});

con.connect(err => {
    if (err) throw err;
    console.log('MySQL\'e bağlanıldı.');
});


app.get('/', (req, res) => {
    res.render('anasayfa');
});


app.get('/listele', (req, res) => {
    const sql = 'SELECT * FROM TBLPersonelBilgileri';
    con.query(sql, (err, result) => {
        if (err) throw err;
        res.render('listele', { personeller: result });
    });
});

// Personel ekleme sayfası
app.get('/ekle', (req, res) => {
    res.render('ekle');
});

// Personel ekleme işlemi
app.post('/ekle', (req, res) => {
    const { ID, PersonelAdi, PersonelKodu } = req.body;
    const insertQuery = 'INSERT INTO TBLPersonelBilgileri (ID, PersonelAdi, PersonelKodu) VALUES (?, ?, ?)';
    con.query(insertQuery, [ID,PersonelAdi, PersonelKodu], (err, result) => {
        if (err) throw err;
        res.redirect('/listele');
    });
});


// Personel silme işlemi


app.get('/sil', (req, res) => {
    res.render('sil');
});
app.post('/sil', (req, res) => {
    let ID = req.body.ID;

    let sql = 'DELETE FROM TBLPersonelBilgileri WHERE ID = ?';
    con.query(sql, [ID], (err, result) => {
        if (err) throw err;
        console.log(`silindi: ID ${ID}`);
        res.redirect('/');
    });
});



app.get('/guncelle', (req, res) => {
    res.render('guncelle');
});


app.post('/guncelle', (req, res) => {
    let ID = req.body.ID;
    let PersonelAdi = req.body.PersonelAdi; 

    let sql = 'UPDATE TBLPersonelBilgileri SET PersonelAdi = ? WHERE ID = ?';
    con.query(sql, [PersonelAdi, ID], (err, result) => {
        if (err) throw err;
        console.log(`Güncellendi: ID ${ID} Yeni ad: ${PersonelAdi}`);
        res.redirect('/');
    });
}); 


const port = 1018;
app.listen(port, () => {
    console.log(`Sunucu ${port} portunda dinleniyor.`);
});
