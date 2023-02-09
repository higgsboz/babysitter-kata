export default {
  prompts: {
    startTime: 'What time did you start working? (e.g. 7:30pm) ',
    bedTime: 'What time did you put the child to bed? (e.g. 9:30pm) ',
    endTime: 'What time did you stop working? (e.g. 1:00am) ',
  },
  userInput: {
    attempts: {
      prefix: 'You have',
      suffix: 'attempts left.',
      exceeded: 'You have exceeded your allowed attempts.',
    },
  },
  errors: {
    outsideBounds:
      '\n --- Invalid Input: Hours must be between 5pm and 4am. ---',
    invalidDate: '\n --- Invalid Date ---',
    invalidTimeSequence:
      '\n--- Invalid Input: Must have startTime <= bedTime <= endTime ---',
  },
  success: '\nYou would make $',
  dayjs: {
    format: 'h:mma',
  },
}
