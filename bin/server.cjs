#!/usr/bin/env node

const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')
const WebSocket = require('ws')
const http = require('http')
const number = require('lib0/number')
const setupWSConnection = require('./utils.cjs').setupWSConnection

// Parsing command-line arguments
const argv = yargs(hideBin(process.argv)).argv

const host = argv.host || process.env.HOST || '0.0.0.0'
const port = number.parseInt(argv.port || process.env.PORT || '1234')

const wss = new WebSocket.Server({ noServer: true })

const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, /** @param {any} ws */ ws => {
    wss.emit('connection', ws, request)
  })
})

server.listen(port, host, () => {
  console.log(`running at '${host}' on port ${port}`)
})
