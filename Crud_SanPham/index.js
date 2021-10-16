const express = require('express');
const app = express();
require('dotenv').config({ path: __dirname + '/.env' });

//config server render MVC
app.use(express.json({ extended: false }));
// app.use(express.urlencoded());
app.use(express.static('./views'));
app.set('view engine', 'ejs');
app.set('views', './views');

//config AWS
const AWS = require('aws-sdk');
const multer = require('multer');
const config = new AWS.Config({
    accessKeyId: process.env.Access_key_ID,
    secretAccessKey: process.env.Secret_access_key,
    region: process.env.Region
});
AWS.config.update(config);

const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'SanPham';
const convertFormToJson = multer();

//In danh sách
app.get('/', (req, res) => {
    console.log('data');

    const params = {
        TableName: tableName,
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            req.send("Server error!");
        } else {
            console.log(JSON.stringify(data));
            return res.render('index', { data: data.Items });
        }
    })
});
//Thêm
app.post('/', convertFormToJson.fields([]), (req, res) => {
    //lấy data người dùng
    const { id, ten_sp, so_luong } = req.body;
    //Chỉnh sửa bảng
    const params = {
        TableName: tableName,
        Item: {
            id,
            ten_sp,
            so_luong
        }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            return res.send('Loi roi!!!!!!!!!!!!');
        }
        //Redirect về trang chủ 
        return res.redirect('/');
    })

});
//Xóa
app.post('/delete',convertFormToJson.fields([]),(req,res)=>{
    console.log('req.body = ', req.body);
    const 
    {id}= req.body;
    const params={
        TableName:tableName,
        Key:{
            id
        }
    };
    docClient.delete(params,(err,data)=>{
        if(err){
            return res.send("Loi !!!!!!!!!!!");
        } 
        return res.redirect('/');
    });
   
});


app.listen(3000, () => console.log('list port 3000'));