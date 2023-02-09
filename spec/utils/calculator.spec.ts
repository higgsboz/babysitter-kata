import { dayjs } from '../../src/utils'
import MockDate from 'mockdate'

import strings from '../../src/resources/strings'
import { Calculator } from '../../src/utils'

const {
  dayjs: { format },
} = strings

const getDate = (date: string) => {
  let day = dayjs(date, format)
  if (day.hour() < 12) {
    day = day.add(1, 'day')
  }
  return day
}

afterAll(() => MockDate.reset())

describe('src/calculator', () => {
  describe('calculateWages', () => {
    beforeEach(() => {
      MockDate.set('2023-01-01')
    })

    test('standard inputs', () => {
      expect(
        Calculator.calculateWages(
          getDate('6:00pm'),
          getDate('10:00pm'),
          getDate('1:00am')
        )
      ).toEqual(80)
    })

    test('offset inputs', () => {
      expect(
        Calculator.calculateWages(
          getDate('6:23pm'),
          getDate('9:52pm'),
          getDate('2:13am')
        )
      ).toEqual(84)
    })

    test('end before midnight', () => {
      expect(
        Calculator.calculateWages(
          getDate('6:00pm'),
          getDate('10:00pm'),
          getDate('11:00pm')
        )
      ).toEqual(56)
    })

    test('start after midnight', () => {
      expect(
        Calculator.calculateWages(
          getDate('12:05am'),
          getDate('3:00am'),
          getDate('4:00am')
        )
      ).toEqual(48)
    })

    test('start = bedtime', () => {
      expect(
        Calculator.calculateWages(
          getDate('9:00pm'),
          getDate('9:00pm'),
          getDate('2:00am')
        )
      ).toEqual(56)
    })

    test('bedtime = endtime', () => {
      expect(
        Calculator.calculateWages(
          getDate('9:00pm'),
          getDate('2:00am'),
          getDate('2:00am')
        )
      ).toEqual(68)
    })

    test('starttime = bedtime = endtime before midnight', () => {
      expect(
        Calculator.calculateWages(
          getDate('9:00pm'),
          getDate('9:00pm'),
          getDate('9:00pm')
        )
      ).toEqual(0)
    })

    test('starttime = bedtime = endtime after midnight', () => {
      expect(
        Calculator.calculateWages(
          getDate('2:00am'),
          getDate('2:00am'),
          getDate('2:00am')
        )
      ).toEqual(0)
    })

    test('end of year', () => {
      MockDate.set('2023-12-31')
      expect(
        Calculator.calculateWages(
          getDate('6:00pm'),
          getDate('10:00pm'),
          getDate('1:00am')
        )
      ).toEqual(80)
    })

    it('should error if start time < bed time < end time is false', () => {
      expect(() =>
        Calculator.calculateWages(
          getDate('6:00pm'),
          getDate('10:00pm'),
          getDate('7:00pm')
        )
      ).toThrow(Error)
    })
  })
})
