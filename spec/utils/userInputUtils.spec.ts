/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import { UserInputUtils } from '../../src/utils'

import strings from '../../src/resources/strings'
import * as dateUtils from '../../src/utils/dateUtils'

dayjs.extend(customParseFormat)

const {
  dayjs: { format },
} = strings

describe('src/useInputUtils', () => {
  let mockExit: jest.SpyInstance
  let mockStdout: jest.SpyInstance
  beforeEach(() => {
    // @ts-ignore
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    mockStdout = jest.spyOn(console, 'log')
  })

  afterEach(() => jest.clearAllMocks())

  describe('#handleInput', () => {
    let prompt: jest.Mock

    const setup = (input: string) => {
      prompt = jest.fn().mockReturnValue(input)
    }

    it.each<string>(['5:00pm', '7:30pm', '9:30pm', '11:11pm'])(
      'should return same dayjs object for %s',
      (date) => {
        setup(date)
        expect(UserInputUtils.handleInput(prompt)).toEqual(dayjs(date, format))
      }
    )

    it.each<string>(['12:00am', '2:33am', '4:00am'])(
      'should return dayjs object 1 day in the future for %s',
      (date) => {
        setup(date)
        expect(UserInputUtils.handleInput(prompt)).toEqual(
          dayjs(date, format).add(1, 'day')
        )
      }
    )

    it('should return error object if increaseDateIfMorning throws', () => {
      const spy = jest
        .spyOn(dateUtils, 'increaseDateIfMorning')
        .mockImplementation(() => {
          throw Error('oops')
        })

      setup('9:00pm')
      UserInputUtils.handleInput(prompt)

      expect(console.log).toHaveBeenCalledWith('oops')
      spy.mockRestore()
    })

    it('should return error object if parseDate throws', () => {
      const spy = jest.spyOn(dateUtils, 'parseDate').mockImplementation(() => {
        throw Error('oops')
      })

      setup('9:00pm')
      UserInputUtils.handleInput(prompt)

      expect(console.log).toHaveBeenCalledWith('oops')
      spy.mockRestore()
    })

    it('should show invalid message if first input invalid', () => {
      prompt = jest
        .fn()
        .mockReturnValueOnce('3:00pm')
        .mockReturnValueOnce('9:00pm')

      const result = UserInputUtils.handleInput(prompt)

      expect(mockStdout).toHaveBeenCalledTimes(2)
      expect(result).toEqual(dayjs('9:00pm', format))
    })

    it('should show invalid message if first and second input invalid', () => {
      prompt = jest
        .fn()
        .mockReturnValueOnce('3:00pm')
        .mockReturnValueOnce('4:00pm')
        .mockReturnValueOnce('9:00pm')

      const result = UserInputUtils.handleInput(prompt)

      expect(mockStdout).toHaveBeenCalledTimes(4)
      expect(result).toEqual(dayjs('9:00pm', format))
    })

    it.each<string>(['2:00pm', '4:59pm', '4:01am', '8:00am'])(
      'should exit program after 3 invalid inputs of %s',
      (date) => {
        setup(date)
        UserInputUtils.handleInput(prompt)

        expect(mockExit).toHaveBeenCalledWith(0)
      }
    )
  })
})
