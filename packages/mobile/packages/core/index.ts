import { Worklet } from 'react-native-bare-kit'
import RPC from 'tiny-buffer-rpc'
import FramedStream from 'framed-stream'
import c from 'compact-encoding'
import b4a from 'b4a'

export const initBareKit = async (setResponse) => {
  const source = require('./main.bundle')
  const worklet = new Worklet()

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
}

export default Worklet

