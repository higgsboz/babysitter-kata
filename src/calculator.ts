import { Dayjs } from 'dayjs'
import strings from './resources/strings'

const PRE_BEDTIME_WAGE = 12
const POST_BEDTIME_WAGE = 8
const POST_MIDNIGHT_WAGE = 16

const { errors } = strings

const getMidnight = (time: Dayjs) => {
  if (time.hour() <= 4) {
    return time.startOf('day')
  }
  return time.add(1, 'day').startOf('day')
}

const calculateTimeSlotWage = (
  startTime: Dayjs,
  endTime: Dayjs,
  hourlyWage: number
) => {
  const diff = endTime.diff(startTime, 'hour')
  if (diff <= 0) {
    return 0
  }

  return diff * hourlyWage
}

export const calculateWages = (
  startTime: Dayjs,
  bedTime: Dayjs,
  endTime: Dayjs
): number => {
  if (!(startTime.diff(bedTime) <= 0 && bedTime.diff(endTime) <= 0)) {
    throw Error(errors.invalidTimeSequence)
  }

  const midnight = getMidnight(startTime)

  // Start to Bed

  let startToBed = 0
  const startCutoff = midnight.isBefore(bedTime) ? midnight : bedTime

  if (startTime.isBefore(midnight)) {
    startToBed = calculateTimeSlotWage(startTime, startCutoff, PRE_BEDTIME_WAGE)
  }

  // Bed to Midnight

  let bedCutoff = midnight
  if (endTime.isBefore(midnight)) {
    bedCutoff = endTime
  }

  const bedToMidnight = calculateTimeSlotWage(
    bedTime,
    bedCutoff,
    POST_BEDTIME_WAGE
  )

  // Midnight to End

  let midnightStart = midnight
  if (midnight.isBefore(startTime)) {
    midnightStart = startTime
  }

  const midnightToEnd = calculateTimeSlotWage(
    midnightStart,
    endTime,
    POST_MIDNIGHT_WAGE
  )

  return startToBed + bedToMidnight + midnightToEnd
}
