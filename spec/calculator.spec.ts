import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

import { calculateWages } from '../src/calculator'

describe('src/calculator', () => {
  describe('calculateWages', () => {
    test('standard inputs', () => {
      expect(
        calculateWages(dayjs('6:00pm'), dayjs('10:00pm'), dayjs('1:00am'))
      ).toEqual(80)
    })

    test('offset inputs', () => {
      expect(
        calculateWages(dayjs('6:23pm'), dayjs('9:52pm'), dayjs('2:13am'))
      ).toEqual(84)
    })

    test('end before midnight', () => {
      expect(
        calculateWages(dayjs('6:00pm'), dayjs('10:00pm'), dayjs('11:00pm'))
      ).toEqual(64)
    })

    test('start after midnight', () => {
      expect(
        calculateWages(dayjs('12:05am'), dayjs('4:00am'), dayjs('5:00am'))
      ).toEqual(52)
    })

    it('should error if start time > end time', () => {
      expect(
        calculateWages(dayjs('6:00pm'), dayjs('10:00pm'), dayjs('7:00pm'))
      ).toThrow(Error)
    })
  })
})
