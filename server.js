var express = require('express');
var app = express();
var expressWs = require('express-ws')(app);

app.use(function(req, res, next) {
    console.log('middleware');
    req.testing = 'testing';
    return next();
});

app.get('/', function(req, res, next) {
    console.log('get route', req.testing);
    res.end();
});

app.ws('/', function(ws, req) {
    ws.on('message', function(msg) {
        console.log(msg);
    });
    console.log('socket', req.testing);
});

app.listen(80);



// 'use strict'

// const express = require('express')
// const morgan = require('morgan')
// const http = require('http')
// const socketIO = require('socket.io')
// const cors = require('cors');
// const WebSocketWrapper = require("ws-wrapper");
// const WebSocket = require('ws');
// const ccxws = require("ccxws");
// module.exports = function createServer() {


//     const app = express()
//     app.use(cors());
//     app.options('*', cors());
//     const upbit = new ccxws.upbit();


//     const wss = new WebSocket.Server({ noServer: true });
//     const server = http.Server(app)

//     wss.on('connection', function connection(ws, request, client) {
//         ws.on('message', function message(msg) {
//             console.log(`Received message ${msg} from user ${client}`);

//             ws.send('something');
//         });
//     });


//     const market = {
//         id: "KRW-ETH", // remote_id used by the exchange
//         base: "KRW", // standardized base symbol for Bitcoin
//         quote: "ETH", // standardized quote symbol for Tether
//     };
//     server.listen(80, function() {
//         console.log("Server started on port 80")
//     })


//     app.use(morgan('dev'))
//     app.get('/', function(req, res) {
//         res.send("HELLO")
//     })

//     upbit.on("Ticker", (Ticker, market) => io.emit('Ticker', Ticker));
//     upbit.on("l2snapshot", (snapshot, market) => io.emit('snapshot', snapshot, market));
//     upbit.on("trade", (trade, market) => io.emit('trade', trade));


//     upbit.subscribeTicker(market);
//     upbit.subscribeTrades(market);
//     upbit.subscribeLevel2Snapshots(market);


//     function tradeServerConnect() {
//         var socketvv = new WebSocketWrapper(new WebSocket("wss://stream.bybit.com/realtime"));
//         // var sss = JSON.stringify([{ "ticket": "fiwwefwefwecjfoew" }, { "type": "trade", "codes": ["KRW-BTC", "KRW-ETH"] }])
//         // socketvv.binaryType = 'arraybuffer';
//         socketvv.send('{"op": "subscribe", "args": ["trade.ETHUSD"]}');


//         socketvv.on("message", (from, msg) => {
//             try {


//                 const data = JSON.parse(msg);
//                 console.log(data);


//                 // io.emit('chat message', data);
//             } catch (e) {

//             }
//         });

//         socketvv.on("disconnect", () => {
//             console.log("bye")
//             setTimeout(() => {

//                 tradeServerConnect();
//             }, 1000);



//         });
//     }



//     // tradeServerConnect();


//     // io.on('connection', function(socket) {
//     //     console.log(socket);
//     //     const serverMessage = { message: "PING" }
//     //     let count = 99911;
//     //     // socket.emit("server-ping", serverMessage)

//     //     socket.on("client-pong", (data) => {
//     //         console.log(data.message)
//     //         if (count > 0) {
//     //             socket.emit("server-ping", count)
//     //             count--
//     //         }
//     //     })

//     //     socket.on("Ticker", (data) => {
//     //         var eeee
//     //         upbit._constructTicker(eeee, market);

//     //         socket.emit("Ticker", eeee)

//     //     })


//     // })

//     return server

// }