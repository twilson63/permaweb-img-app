import { assert, test } from 'vitest'
import { handle } from './contract'

test('echo test', async () => {
  const { state } = await handle({ ticker: 'TEST' }, { input: { function: 'noop' } })
  assert.equal(state.ticker, 'TEST')
})

globalThis.ContractError = (msg) => Error(msg)
globalThis.ContractAssert = (exp, msg) => {
  if (exp) {
    return
  }
  throw new Error(msg)
}
test('check balance', async () => {
  const initialState = { ticker: 'TEST', balances: { 'a': 1 } }
  const { result } = await handle(initialState, {
    caller: 'a',
    input: {
      function: 'balance'
    }
  })

  assert.equal(result.balance, 1)
})
test('transfer units from a to c', async () => {
  const initialState = { ticker: 'TEST', balances: { 'a': 1 } }
  try {
    const { state } = await handle(initialState, {
      caller: 'a',
      input: {
        function: 'transfer',
        target: 'c',
        qty: '1'
      }
    })
  } catch (e) {
    assert.equal(e.message, 'qty MUST be a number')
  }
})

test('transfer units from a to b', async () => {
  const initialState = { ticker: 'TEST', balances: { 'a': 1 } }
  const { state } = await handle(initialState, {
    caller: 'a',
    input: {
      function: 'transfer',
      target: 'b',
      qty: 1
    }
  })
  assert.equal(state.balances.b, 1)

})