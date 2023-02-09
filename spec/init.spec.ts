import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import strings from '../src/resources/strings'

import * as userInputUtils from '../src/userInputUtils'
import init from '../src/init'
import * as calculator from '../src/calculator'

dayjs.extend(customParseFormat)

const {
  dayjs: { format },
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
    handleInputSpy = jest
      .spyOn(userInputUtils, 'handleInput')
      .mockImplementationOnce(() => startTime)
      .mockImplementationOnce(() => bedTime)
      .mockImplementationOnce(() => endTime)

    calculateWagesSpy = jest
      .spyOn(calculator, 'calculateWages')
      .mockReturnValue(80)

    mockConsole = jest.spyOn(console, 'log')
    init()
  })

  it('calls calculateWages with the correct values', () => {
    expect(handleInputSpy).toHaveBeenCalledTimes(3)
    expect(calculateWagesSpy).toHaveBeenCalledWith(startTime, bedTime, endTime)
  })

  it('prints correct value to the console', () => {
    expect(mockConsole).toHaveBeenCalledWith('\nYou would make $80!')
  })
})
