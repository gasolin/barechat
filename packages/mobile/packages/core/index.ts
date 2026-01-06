import { Worklet } from 'react-native-bare-kit'
// @ts-ignore
import { ChatRPC, COMMANDS } from '../rpc'
import b4a from 'b4a'


/**
 * Initializes the BareKit worklet and sets up the RPC communication.
 * 
 * @param onRoomJoined Callback when a room is successfully joined or created
 * @param onMessage Callback when a message is received from the P2P network
 * @returns Interface to interact with the core backend
 */
export const initBareKit = async (onRoomJoined: (topic: string) => void, onMessage: (msg: any) => void) => {
  const source = require('./main.bundle')
  const worklet = new Worklet()

  worklet.start('barechat:/main.bundle', source)

  // React Native side RPC setup
  const rpc = new ChatRPC(worklet.IPC, async (req: any) => {
    if (req.command === COMMANDS.ON_MESSAGE) {
      try {
        const msg = JSON.parse(b4a.toString(req.data, 'utf8'))
        onMessage(msg)
        ChatRPC.reply(req, { received: true })
      } catch (e) {
        console.error('Error parsing message from worklet:', e)
      }
    }
  })

  return {
    joinRoom: async (topic: string) => {
      const res = await rpc.joinRoom(topic)
      onRoomJoined(res.topic)
      return res
    },
    sendMessage: (msg: string) => rpc.sendMessage(msg),
    worklet // Expose worklet for cleanup if needed
  }
}

export default Worklet
