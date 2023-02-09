import process from 'process'

import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'

import { increaseDateIfMorning, parseDate } from './dateUtils'
import strings from './resources/strings'

dayjs.extend(customParseFormat)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

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
    date = increaseDateIfMorning(parseDate(input))
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
  const tries = 3

  let input = ''
  let i = 0
  for (i; i < tries; i++) {
    input = prompt()
    const result = isValidInput(input)
    if (result.success) {
      return result.data
    }
    console.log(result.message)
    console.log(`${attempts.prefix} ${tries - i - 1} ${attempts.suffix}`)
  }

  if (i === 3) {
    console.log(attempts.exceeded)
    process.exit(0)
  }

  return undefined
}
