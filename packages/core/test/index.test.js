import test from 'brittle'
import { isHashcode, strToTopic, createMessage } from '../lib/chat-core.js'

test('isHashcode', (t) => {
    t.comment('Valid hashcode')
    const validHash = 'eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089'
    t.ok(isHashcode(validHash), 'Should return true for valid 64-char hex string')

    t.comment('Too short')
    t.absent(isHashcode('abc123'), 'Should return false for short string')

    t.comment('Not hex')
    t.absent(isHashcode('zaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd603308x'), 'Should return false for non-hex characters')

    t.comment('Not a string')
    t.absent(isHashcode(null), 'Should return false for null')
    t.absent(isHashcode(123), 'Should return false for numbers')
})

test('strToTopic', (t) => {
    t.comment('Existing hashcode')
    const validHash = 'eaabffe32a969eeae9a4588a6e088534aae8066db2c055107b9e700fd6033089'
    t.is(strToTopic(validHash), validHash, 'Should return the same string if it is already a hashcode')

    t.comment('Human readable string')
    const topic = 'soccer'
    const result = strToTopic(topic)
    t.is(result.length, 64, 'Should return a 64-char hash')
    t.ok(/^[0-9a-f]+$/.test(result), 'Should be hex encoded')

    const result2 = strToTopic(topic)
    t.is(result, result2, 'Should be deterministic')
})

test('createMessage', (t) => {
    const msg = 'hello world'
    const result = createMessage(msg)

    t.is(result.message, msg)
    t.absent(result.local, 'Default local should be false')
    t.is(result.messageType, 'text', 'Default type should be text')
    t.ok(result.timestamp instanceof Date, 'Should have a timestamp')

    const localMsg = createMessage(msg, true, 'system')
    t.ok(localMsg.local, 'Local should be true when specified')
    t.is(localMsg.messageType, 'system', 'Type should be system when specified')
})
