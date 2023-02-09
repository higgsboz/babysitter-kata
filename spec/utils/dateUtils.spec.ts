import type { Dayjs } from 'dayjs'
import { dayjs } from '../../src/utils'
import { DateUtils } from '../../src/utils'

import strings from '../../src/resources/strings'

const {
  dayjs: { format },
  errors,
} = strings

describe('src/dateUtils', () => {
  describe('#parseDate', () => {
    it.each<string>([
      '3:33am',
      '3:33pm',
      '7:30am',
      '7:30pm',
      '9:30am',
      '9:30pm',
      '11:11am',
      '11:11pm',
      '12:00am',
      '12:00pm',
    ])('%s should be a valid date', (date) => {
      const parsedDate = DateUtils.parseDate(date)
      expect(parsedDate?.isValid()).toBeTruthy()
    })

    it.each<string>([
      '9:30 pm',
      '09:30pm',
      '21:30pm',
      '10:300pm',
      '',
      'gibberish',
    ])('should throw an error for invalid date: %s', (date) => {
      expect(() => DateUtils.parseDate(date)).toThrow(Error(errors.invalidDate))
    })
  })

  describe('#increaseDateIfMorning', () => {
    it.each<Dayjs>([
      dayjs('12:00am', format),
      dayjs('1:27am', format),
      dayjs('4:00am', format),
    ])('should increase %s to next date', (day) => {
      const expectedDate = day.date() + 1
      const newDay = DateUtils.increaseDateIfMorning(day)
      expect(newDay.date()).toBe(expectedDate)
    })

    it.each<Dayjs>([
      dayjs('5:00pm', format),
      dayjs('10:27am', format),
      dayjs('11:59am', format),
    ])('should keep %s the same', (day) => {
      const expectedDate = day.date()
      const newDay = DateUtils.increaseDateIfMorning(day)
      expect(newDay.date()).toBe(expectedDate)
    })
  })
})
