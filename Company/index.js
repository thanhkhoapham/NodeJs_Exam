require('dotenv').config({
    path:__dirname+'/.env'
});
const express= require('express');
const multer= require('multer');
const AWS=require('aws-sdk');
const convertFormToJson= multer();
const app=express();

const config= new AWS.Config({
    accessKeyId: process.env.Access_key_ID,
    secretAccessKey: process.env.Secret_access_key,
    region: process.env.Region
});
AWS.config.update(config);

app.use(express.json({extended:false}));
app.use(express.static('./css'));
app.set('view engine','ejs');
app.set('views','./templates');

//AWS
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName='Company';

//=======================================Mot===============================
app.get('/',(req,res)=>{
    const params={
        TableName:tableName
    };
    docClient.scan(params,(err,data)=>{
        if(err)
            {
                req.send("Server err!");
            }
        return res.render('index',{
            data: data.Items
        });
    })
   
});
//Them 
app.post('/',convertFormToJson.fields([]),(req,res)=>{
    const {
        id,name,avatar_url
    }=req.body;

    const params={
        TableName:tableName,
        Item:{
            id:parseInt(id),
            name,
            avatar_url
        }
    };
    docClient.put(params, (err,data)=>{
        if(err){
            return res.send("kh Them dc");
        }
        return res.redirect('/');
    })

})
//Xoa
app.post('/delete',convertFormToJson.fields([]),(req,res)=>{
    console.log('req.body = ', req.body);
    const 
    {id}= req.body;
    const params={
        TableName:tableName,
        Key:{
            id:parseInt(id)
        }
    };
    docClient.delete(params,(err,data)=>{
        if(err){
            return res.send("Loi !!!!!!!!!!!");
        } 
        return res.redirect('/');
    });
   
});
//===========================================Nhieu=====================================
app.get('/:company_id',(req,res)=>{
    const {company_id}=req.params;
    var params ={
        TableName:tableName,
        KeyConditionExpression: "#id = :company_id",
        ExpressionAttributeNames:{
            "#id":"id"
        },
        ExpressionAttributeValues:{
            ":company_id": parseInt(company_id)
        }
    };

    docClient.query(params,(err,data)=>{
        if(err){
            return res.send('Server err');
        }
        console.log(JSON.stringify(data.Items))
        return res.render('products',{data: data.Items[0]});
    });
});
app.listen(3000,()=>{
    console.log('Running port 3000')
});