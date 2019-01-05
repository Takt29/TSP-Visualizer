import effectiveBranchingFactor from './effectiveBranchingFactor.js'

let step = 0
let maxScore = -Infinity
let minDistance = Infinity
let maxDepth = 0

const update = (state) => {
  $('#steps').text(step.toString())
  $('#ebfactor').text(effectiveBranchingFactor(maxDepth, step).toFixed(2))
  if (state == null) return

  const { distance = 0, score = -Infinity, num = 0, history = [] } = state

  maxScore = Math.max(maxScore, score)
  maxDepth = Math.max(maxDepth, state.history.length)

  if (num == history.length && distance) {
    minDistance = Math.min(minDistance, distance)
  }

  $('#distance').text(distance.toFixed(2))
  $('#mindistance').text(minDistance.toFixed(2))
  $('#score').text(score.toFixed(2))
  $('#maxscore').text(maxScore.toFixed(2))
}

const initDisplay = (state) => {
  step = 0
  minDistance = Infinity
  maxScore = -Infinity
  maxDepth = 0
  update(state)
}

const updateWithStep = (state) => {
  step = (step || 0) + 1
  update(state)
}

export {
  initDisplay,
  updateWithStep,
}
