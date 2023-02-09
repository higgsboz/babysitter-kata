import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import strings from './resources/strings'

dayjs.extend(customParseFormat)

const {
  errors,
  dayjs: { format },
} = strings

export const parseDate = (input: string) => {
  const parsedDate = dayjs(input, format, true)

  if (!parsedDate.isValid()) {
    throw Error(errors.invalidDate)
  }

  return parsedDate
}

export const increaseDateIfMorning = (day: Dayjs) => {
  const hour = day.hour()
  if (hour >= 0 && hour <= 4) {
    day = day.add(1, 'day')
  }
  return day
}
