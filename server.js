'use strict'

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const mongoose = require('mongoose')

const server = express();
require('dotenv').config();
server.use(cors());
server.use(express.json());

const PORT = process.env.PORT;



mongoose.connect('mongodb://localhost:27017/exam', { useNewUrlParser: true, useUnifiedTopology: true });


let colorSchema = mongoose.Schema({
    title:String,
    imageUrl:String
})
let colorModel = mongoose.model("color", colorSchema)

let userSchema = mongoose.Schema({
    email:String,
    color:[colorSchema]

})
let userModel = mongoose.model("user", userSchema)

server.post('/addToFav/:email',addToFav)

function addToFav(req,res){
console.log(req.params)
    let {userEmail}=req.params
    let {title,imageUrl,email}=req.body 

        let data =new userModel({
            email:email,
        color:{
            title :title,
            imageUrl:imageUrl
        }
    })
    data.save();
}

server.get('/', testFun);

function testFun(req, res) {
    res.send("home")
}

server.get('/getAllColors', getAllColorsFun);

async function getAllColorsFun(req, res) {
    let resData = await axios.get(`https://ltuc-asac-api.herokuapp.com/allColorData`)
    // console.log(resData.data)
    // let dataArray = [];
    let dataArray = resData.data.map((item)  => {
        return (
           new Colors(item)
        )
    })
    
    res.send(dataArray)
}



class Colors {
    constructor(item) {
        this.title = item.title
        this.imageUrl = item.imageUrl
    }
}





server.listen(PORT, () => {
    console.log(`listing on port ${PORT}`)
})