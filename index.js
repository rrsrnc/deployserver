const {app,server,io} = require('./serversocket.js')
const SerialPort = require('serialport');
const { DelimiterParser } = require('@serialport/parser-delimiter');
const {Readline} = require('@serialport/parser-readline');

require('dotenv').config();

const connectdb = require('./db/connect.js')
const router = require('./router/routes.js')
const {PredictEmit} = require('./predictemit.js')
const {setMLmodelfromdb, getMLoption} = require('./MLoptionselector.js')

const port = process.env.PORT || 5000;

const dbName = 'IOTDB';
const collectionName = 'tempdefs';

app.use('/api/v1/',router);
// app.use(express.static(__dirname + '/build'))
// app.get("/*", (req, res) => {
//     res.sendFile(__dirname + '/build/index.html');
//   });
const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = process.env.MONGODB_URL;

const client = new MongoClient(uri);

async function run() {

    const database = client.db('IOTDB');
    const collection = database.collection('tempdefs');
    const recentDocuments = await collection
        .find()
        .sort({ _id: -1 }) // Assuming documents have a timestamp field or an ObjectId
        .limit(10)
        .toArray();

    console.log("Recent 10 Documents:", recentDocuments);
  
}
run().catch(console.dir);
const start = async ()=> {
    try{
        
      await connectdb(process.env.MONGODB_URL);
        console.log('Connected database successfully...')
        console.log(port);

        server.listen(port, async()=> {
            console.log(`Server is listening on port: ${port}...`);
            await setMLmodelfromdb();
           
            setInterval
            (()=>{
                let today = new Date();
                // console.log(today);
                let temp1 = (28 + 3*Math.random()*(Math.random()>0.5 ? 1: -1)).toFixed(3);
                let temp2 = (28 + 3*Math.random()*(Math.random()>0.5 ? 1: -1)).toFixed(3);
                let temp3 = (28 + 3*Math.random()*(Math.random()>0.5 ? 1: -1)).toFixed(3);
                let temp4 = (28 + 3*Math.random()*(Math.random()>0.5 ? 1: -1)).toFixed(3);
                // let mydata = {tempdata: {temp1, temp2, temp3, temp4}, timestamp : {date: today.getDate()+"-"+today.getMonth()+1+"-"+today.getFullYear(), time: (today.getHours())+":"+(today.getMinutes())+":"+(today.getSeconds())}};
                // console.log(mydata);
                
                PredictEmit(temp1,temp2,temp3,temp4);
            },3000)
        
        // const S_port = new SerialPort.SerialPort({path:'COM3', baudRate:115200}, false); //Connect serial port to port COM3. Because my Arduino Board is connected on port COM3.
        // // const parser = S_port.pipe(new DelimiterParser({delimiter: '\r\n'})); //Read the line only when new line comes.
        // const parser=S_port.pipe( Readline({ delimiter: '\n' }));
        
        // S_port.on('open', () => {
        //     console.log('Serial port is open');
        // });
        // // console.log(parser)
        
        // parser.on('data', (temp) => { //Read data
        //     if(temp==="X"){
        //         console.log("No data received")
        //         return;
        //     }
        //     console.log("temp")
        //     let str1 = new TextDecoder().decode(temp);
        //     // if(str1[str1.length-1]==='\r'){
        //     //         str1.substring(0,str1.length-1);
        //     // }
        //     let tdata = str1.split("|");
        //     let today = new Date();
        //     // console.log(today);
        //     let temp1 = tdata[0];
        //     let temp2 = tdata[1];
        //     let temp3 = tdata[2];
        //     let temp4 = tdata[3];
        //     // let mydata = {tempdata: {temp1, temp2, temp3, temp4}, timestamp : {date: today.getDate()+"-"+today.getMonth()+1+"-"+today.getFullYear(), time: (today.getHours())+":"+(today.getMinutes())+":"+(today.getSeconds())}};
        //     // console.log(mydata);
        //     PredictEmit(temp1,temp2,temp3,temp4);
        // });
    });
    }catch (error){
        console.log(error);
    }
}

start();

// module.exports =  {start};

// const S_port = new SerialPort.SerialPort({path:'COM3', baudRate:115200}, false); //Connect serial port to port COM3. Because my Arduino Board is connected on port COM3.
// const parser = S_port.pipe(new DelimiterParser({delimiter: '\r\n'})); //Read the line only when new line comes.
// parser.on('data', (temp) => { //Read data
//     if(temp==="X"){
//         return;
//     }
//     let str1 = new TextDecoder().decode(temp);
//     // if(str1[str1.length-1]==='\r'){
//     //         str1.substring(0,str1.length-1);
//     // }
//     let tdata = str1.split("|");
//     let today = new Date();
//     // console.log(today);
//     let temp1 = tdata[0];
//     let temp2 = tdata[1];
//     let temp3 = tdata[2];
//     let temp4 = tdata[3];
//     // let mydata = {tempdata: {temp1, temp2, temp3, temp4}, timestamp : {date: today.getDate()+"-"+today.getMonth()+1+"-"+today.getFullYear(), time: (today.getHours())+":"+(today.getMinutes())+":"+(today.getSeconds())}};
//     // console.log(mydata);
//     PredictEmit(temp1,temp2,temp3,temp4);
// });
