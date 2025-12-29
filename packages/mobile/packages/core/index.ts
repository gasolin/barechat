import { Worklet } from 'react-native-bare-kit'
import RPC from 'tiny-buffer-rpc'
import FramedStream from 'framed-stream'
import c from 'compact-encoding'
import b4a from 'b4a'

export const initBareKit = async (setResponse) => {
  const source = require('./main.bundle')
  const worklet = new Worklet()

  // const source = `
  //   const { IPC: rawIPC } = BareKit
  //   const RPC = require('tiny-buffer-rpc')
  //   const FramedStream = require('framed-stream')
  //   const c = require('compact-encoding')
  //   const framed = new FramedStream(rawIPC)
  //   const rpc = new RPC(data => framed.write(data))
  //   framed.on('data', data => rpc.recv(data))
  //   rpc.register(1, {
  //     request: c.string,
  //     response: c.string,
  //     onrequest: (msg) => {
  //       console.log('Worklet received:', msg)
  //       return 'Hello from Bare RPC!'
  //     }
  //   })
  // `

  worklet.start('barechat:/main.bundle', source)

  // React Native side RPC setup
  const framed = new FramedStream(worklet.IPC)
  const rpc = new RPC(data => framed.write(data))
  framed.on('data', data => rpc.recv(data))

  // Register the method locally
  const ping = rpc.register(1, {
    request: c.string,
    response: c.string
  })
  try {
    const reply = await ping.request('>>>>>>>>>>>>> Hello from React Native!')
    setResponse(reply)
  } catch (err) {
    console.error('RPC Error:', err)
  }

  // const { IPC } = worklet

  // IPC.on('data', (data: Uint8Array) => setResponse(b4a.toString(data)))
  // IPC.write(b4a.from('>>>>>>>>>>>>> Hello from React Native!'))
}

export default Worklet

