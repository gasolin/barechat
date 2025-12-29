const { IPC: rawIPC } = BareKit
const RPC = require('tiny-buffer-rpc')
const FramedStream = require('framed-stream')
const c = require('compact-encoding')

const framed = new FramedStream(rawIPC)
const rpc = new RPC(data => framed.write(data))
framed.on('data', data => rpc.recv(data))
rpc.register(1, {
  request: c.string,
  response: c.string,
  onrequest: (msg) => {
    console.log('Worklet received:', msg)
    return 'Hello from Bare RPC!'
  }
})