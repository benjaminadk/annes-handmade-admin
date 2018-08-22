import { formatFilename } from '../utils/formatFilename'

let result, re

describe('formatFilename', () => {
  it('returns a string', () => {
    result = formatFilename('filename', 'folder')
    expect(typeof result).toBe('string')
  })
  it('returns the proper format', () => {
    result = formatFilename('filename', 'folder')
    expect(result).toBe('folder/filename')
  })
  it('removes uppercase characters', () => {
    result = formatFilename('FILENAME', 'folder')
    re = /[A-Z]/
    expect(re.test(result)).toBeFalsy()
  })
  it('removes non letter and non numbers', () => {
    result = formatFilename('imageof%@Dog', 'folder')
    expect(result.includes('-')).toBeTruthy()
  })
})
