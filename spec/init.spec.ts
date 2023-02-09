import { dayjs } from '../src/utils'
import strings from '../src/resources/strings'

import * as userInputUtils from '../src/utils/userInputUtils'
import init from '../src/init'
import * as calculator from '../src/utils/calculator'

const {
  dayjs: { format },
  success,
} = strings

jest.mock('prompt-sync', () => () => jest.fn())

describe('src/init', () => {
  let handleInputSpy: jest.SpyInstance
  let calculateWagesSpy: jest.SpyInstance
  let mockConsole: jest.SpyInstance

  const startTime = dayjs('6:00pm', format)
  const bedTime = dayjs('10:00pm', format)
  const endTime = dayjs('1:00am', format).add(1, 'day')

  beforeEach(() => {
    calculateWagesSpy?.mockClear()
    handleInputSpy?.mockClear()
    mockConsole?.mockClear()

    handleInputSpy = jest
      .spyOn(userInputUtils, 'handleInput')
      .mockImplementationOnce(() => startTime)
      .mockImplementationOnce(() => bedTime)
      .mockImplementationOnce(() => endTime)

    calculateWagesSpy = jest
      .spyOn(calculator, 'calculateWages')
      .mockReturnValue(80)

    mockConsole = jest.spyOn(console, 'log')
  })

  it('calls calculateWages with the correct values', () => {
    init()

    expect(handleInputSpy).toHaveBeenNthCalledWith(1, expect.any(Function))
    expect(handleInputSpy).toHaveBeenNthCalledWith(2, expect.any(Function))
    expect(handleInputSpy).toHaveBeenNthCalledWith(3, expect.any(Function))
    expect(calculateWagesSpy).toHaveBeenCalledWith(startTime, bedTime, endTime)
  })

  it('prints correct value to the console', () => {
    init()

    expect(mockConsole).toHaveBeenCalledWith(success, 80)
  })

  it('should print error log on error', () => {
    calculateWagesSpy.mockClear()
    calculateWagesSpy.mockImplementation(() => {
      throw Error('oops')
    })

    init()

    expect(mockConsole).toHaveBeenCalledWith('oops')
  })
})
