import process from 'process'

import { Dayjs } from 'dayjs'
import { dayjs } from './'

import { DateUtils } from './'
import strings from '../resources/strings'

const {
  userInput: { attempts },
  errors,
} = strings

type ValidationResult = {
  success: boolean
  data: Dayjs | undefined
  message: string
}

const isTimeValid = (time: Dayjs) =>
  time.isSameOrBefore(dayjs().add(1, 'day').startOf('day').hour(4)) &&
  time.isSameOrAfter(dayjs().startOf('day').hour(17))

const isValidInput = (input: string): ValidationResult => {
  let message = ''
  let date = undefined
  try {
    date = DateUtils.increaseDateIfMorning(DateUtils.parseDate(input))
    if (!isTimeValid(date)) {
      message = errors.outsideBounds
    }
  } catch (e) {
    if (e instanceof Error)
      return {
        success: false,
        data: undefined,
        message: e.message,
      }
  }
  return {
    success: message == '',
    data: date,
    message,
  }
}

export const handleInput = (prompt: () => string) => {
  let tries = 3

  let input = ''
  for (tries; tries > 0; tries--) {
    input = prompt()
    const result = isValidInput(input)
    if (result.success) {
      return result.data
    }
    console.log(result.message)
    console.log(`${attempts.prefix} ${tries - 1} ${attempts.suffix}`)
  }

  console.log(attempts.exceeded)
  process.exit(0)
}
