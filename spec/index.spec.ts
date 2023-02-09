import { helloWorld } from '../src'

describe('index.ts', () => {
  it('returns hello world', () => {
    expect(helloWorld()).toBe('Hello World')
  })
})
