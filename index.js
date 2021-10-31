const express=require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;

require('dotenv').config();
const cors=require('cors')
const app=express();
const port=process.env.PORT||5000;
app.use(cors());
app.use(express.json());
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3u96.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database=client.db('Plans');
        const productCollection=database.collection('booking');
         const orderCollection=database.collection('orders');

        app.get('/bookings', async(req,res)=>{
            const cursor=productCollection.find({});
            const bookings=await cursor.toArray();
            res.send(bookings);
        });
        //Post Api
        app.post('/orders',async(req,res)=>
        {
            const order=req.body;
            const result=await orderCollection.insertOne(order);
            res.json(result);
            
        });

        //Get All data
        app.get('/order', async(req,res)=>{
            const cursor=orderCollection.find({});
            const orders=await cursor.toArray();
            res.send(orders);
        })

        //Get Single Service
        app.post('/single-order',async(req,res)=>  {
            const query= {email: req.body.email};
            const order=await orderCollection.findOne(query);
            res.json(order);
        });

        //Delete
        app.delete('/order/:id',async(req,res)=>{
            const id=req.params.id;
            const query={_id:ObjectId(id)};
            const result=await orderCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir)

app.get('/',(req,res)=>{
    res.send("Server is working");
    
})

app.listen(port,()=>{
    console.log('Running the genius server',port);
})