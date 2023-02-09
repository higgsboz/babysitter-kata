import dayjs, { Dayjs } from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const parseDate = (input: string): Dayjs | null => {
  const parsedDate = dayjs(input, 'h:mma', true)

  if (!parsedDate.isValid()) {
    throw Error('Invalid Date')
    return null
  }

  return parsedDate
}
