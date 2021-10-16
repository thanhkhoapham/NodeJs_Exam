const express = require("express");                 //import thư viện express                 
const app=express();                                //tạo 1 app server bằng express

app.use(express.json({extended: false}));         //comver các request dạng webform về json để dễ xử lý

app.get('/',(require,response) => 
{ 
    return response.send("hello world");
})     //Tạo một xử lý đơn giản

app.listen(3000,()=>
{
    console.log('Server is running on port 3k')
})         //xác định port mà ứng dụng sẽ sử dụng và 1 callback trả về khi start server
