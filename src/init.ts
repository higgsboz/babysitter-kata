import promptSync from 'prompt-sync'

import { Calculator, UserInputUtils } from './utils'
import strings from './resources/strings'

const { prompts, success } = strings

const init = () => {
  const prompt = promptSync({ sigint: true })

  const startTime = UserInputUtils.handleInput(() => prompt(prompts.startTime))
  const bedTime = UserInputUtils.handleInput(() => prompt(prompts.bedTime))
  const endTime = UserInputUtils.handleInput(() => prompt(prompts.endTime))

  try {
    // This is fine because if any of them are null, the program would have quit
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const wages = Calculator.calculateWages(startTime!, bedTime!, endTime!)
    console.log(success, wages)
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
    }
  }
}

export default init
