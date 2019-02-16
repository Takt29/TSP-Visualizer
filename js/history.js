import { copyState } from './tools.js'

const HistorySizeLimit = 100

let history = []

const initHistory = () => {
  history = []
}

const pushHistory = (state, step) => {
  const item = {
    state: copyState(state),
    step: step
  }

  if (history.length >= HistorySizeLimit) {
    history.pop()
  }

  history.unshift(item)
}

const getHistory = (index) => {
  if (history.length <= index)
    return null

  return {
    step: history[index].step,
    state: copyState(history[index].state)
  }
}

const getHistorySize = () => {
  return history.length
}

export {
  initHistory,
  pushHistory,
  getHistory,
  getHistorySize,
}
