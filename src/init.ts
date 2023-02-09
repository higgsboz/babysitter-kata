import promptSync from 'prompt-sync'

import { calculateWages } from './calculator'
import strings from './resources/strings'
import { handleInput } from './userInputUtils'

const { prompts } = strings

const init = () => {
  const prompt = promptSync({ sigint: true })

  const startTime = handleInput(() => prompt(prompts.startTime))
  const bedTime = handleInput(() => prompt(prompts.bedTime))
  const endTime = handleInput(() => prompt(prompts.endTime))

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wages = calculateWages(startTime!, bedTime!, endTime!)

  console.log(`\nYou would make $${wages}!`)
}

export default init
