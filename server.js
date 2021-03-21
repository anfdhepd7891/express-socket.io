/*******************************************************************************
 * Copyright (c) 2016 Nicola Del Gobbo 
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the license at http://www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY
 * IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 * MERCHANTABLITY OR NON-INFRINGEMENT.
 *
 * See the Apache Version 2.0 License for specific language governing
 * permissions and limitations under the License.
 *
 * Contributors - initial API implementation:
 * Nicola Del Gobbo <nicoladelgobbo@gmail.com>
 ******************************************************************************/

'use strict'

/*!
 * Module dependencies
 */
const express = require('express')
const morgan = require('morgan')
const http = require('http')
const socketIO = require('socket.io')
const cors = require('cors');
const WebSocketWrapper = require("ws-wrapper");
const WebSocket = require('ws');
const ccxws = require("ccxws");
module.exports = function createServer() {

    const app = express()

    const binance = new ccxws.Binance();
    const server = http.Server(app)
    const io = socketIO(server)
    io.set('origins', '*:*');
    const market = {
        id: "BTCUSDT", // remote_id used by the exchange
        base: "BTC", // standardized base symbol for Bitcoin
        quote: "USDT", // standardized quote symbol for Tether
    };
    server.listen(80, function() {
        console.log("Server started on port 80")
    })

    app.use(morgan('dev'))
    app.use(cors());
    app.options('*', cors());
    app.get('/', function(req, res) {
        res.send("HELLO")
    })


    function tradeServerConnect() {
        var socketvv = new WebSocketWrapper(new WebSocket("wss://stream.bybit.com/realtime"));
        // var sss = JSON.stringify([{ "ticket": "fiwwefwefwecjfoew" }, { "type": "trade", "codes": ["KRW-BTC", "KRW-ETH"] }])
        // socketvv.binaryType = 'arraybuffer';
        socketvv.send('{"op": "subscribe", "args": ["trade.ETHUSD"]}');
        binance.on("trade", trade => socketvv.send(trade));

        // handle level2 orderbook snapshots
        binance.on("l2snapshot", snapshot => socketvv.send(snapshot));

        // subscribe to trades
        binance.subscribeTrades(market);

        // subscribe to level2 orderbook snapshots
        binance.subscribeLevel2Snapshots(market);

        socketvv.on("message", (from, msg) => {
            try {


                const data = JSON.parse(msg);
                console.log(data);


                io.emit('chat message', data);
            } catch (e) {

            }
        });

        socketvv.on("disconnect", () => {
            console.log("bye")
            setTimeout(() => {

                tradeServerConnect();
            }, 1000);



        });
    }



    tradeServerConnect();


    io.on('connection', function(socket) {
        console.log(socket);
        const serverMessage = { message: "PING" }
        let count = 99911;
        socket.emit("server-ping", serverMessage)
        socket.on("client-pong", (data) => {
            console.log(data.message)
            if (count > 0) {
                socket.emit("server-ping", count)
                count--
            }
        })
    })

    return server

}