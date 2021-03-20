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

module.exports = function createServer() {

  const app = express()
app.use(cors());
app.options('*', cors());
  const server = http.Server(app)
  const io = socketIO(server)
io.set('origins', '*:*');
  server.listen(80, function () {
    console.log("Server started on port 80")
  })
 
  app.use(morgan('dev'))

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })
	var socketvv = new WebSocketWrapper(new WebSocket("wss://api.upbit.com/websocket/v1"));

socketvv.on("msg", function(from, msg) {
	console.log(`Received message from ${from}: ${msg}`);
});
  var msg = [{"ticket":"UNIQUE_TICKET"},{"type":"trade","codes":["KRW-BTC"]},{"type":"orderbook","codes":["KRW-ETH"]},{"type":"ticker", "codes":["KRW-EOS"]}];

			msg = JSON.stringify(msg);	
socketvv.emit(msg);
	





vvocket.onAny((event) => {
  console.log(`got ${event}`);
});
  io.on('connection', function (socket) {
    console.log(socket);
    const serverMessage = {message: "PING"}
    let count = 99911;
    socket.emit("server-ping", serverMessage)
    socket.on("client-pong", (data) => {
      console.log(data.message)
      if (count > 0) {
        socket.emit("server-ping", count)
        count --
      }
    })
  })
  
  return server

}
