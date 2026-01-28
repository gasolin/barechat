#!/usr/bin/env bare
import { RPCServer } from '../lib/rpc-server.js'
import { RPCClient } from '../../rpc/lib/rpc.js'
import process from 'bare-process'

console.log('Testing RPC asynchronous notifications...')

let rpcServer = null

// Mock appendMessage and notification logic from index.js
function appendMessage({ memberId, event }) {
    console.log(`[appendMessage] [${memberId}] ${event?.message}`)

    // Implementation from index.js
    if (rpcServer && memberId !== 'me' && memberId !== 'rpc-client') {
        rpcServer.notifyAll({ memberId, message: event?.message })
    }
}

// 1. Start RPC server
rpcServer = new RPCServer({
    sendMessage: (msg) => console.log('[mock] sendMessage to swarm:', msg),
    appendMessage
})
rpcServer.start()

const client = new RPCClient()
let notificationReceived = false

client.onmessage = (data) => {
    console.log('✓ RPC Client received notification:', JSON.stringify(data))
    if (data.memberId === 'peer-1' && data.message === 'Hello from swarm!') {
        notificationReceived = true
        console.log('✓ Validation successful')
    } else {
        console.error('✗ Unexpected notification data:', data)
    }
}

async function runTest() {
    try {
        // 2. Connect RPC client
        await client.connect()

        // 3. Simulate swarm message
        console.log('\nStep 1: Simulating external swarm message...')
        appendMessage({ memberId: 'peer-1', event: { message: 'Hello from swarm!' } })

        // Give it a moment to process
        await new Promise(resolve => setTimeout(resolve, 500))

        // 4. Test loop prevention
        console.log('\nStep 2: Testing local message filtering (should be silent)...')
        appendMessage({ memberId: 'me', event: { message: 'This should not be notified' } })
        appendMessage({ memberId: 'rpc-client', event: { message: 'This should also not be notified' } })

        await new Promise(resolve => setTimeout(resolve, 500))

        // 5. Test sending via RPC doesn't notify back
        console.log('\nStep 3: Testing RPC send loop prevention (should be silent)...')
        await client.sendMessage('Test message from RPC')

        await new Promise(resolve => setTimeout(resolve, 500))

        if (notificationReceived) {
            console.log('\n✅ ALL TESTS PASSED')
            cleanup(0)
        } else {
            console.error('\n❌ TEST FAILED: Notification not received')
            cleanup(1)
        }
    } catch (err) {
        console.error('\n❌ TEST ERROR:', err.message)
        cleanup(1)
    }
}

function cleanup(exitCode) {
    client.disconnect()
    rpcServer.stop()
    process.exit(exitCode)
}

runTest()
