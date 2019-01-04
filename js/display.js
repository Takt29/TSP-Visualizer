let step = 0
let maxScore = -Infinity
let minDistance = Infinity

const update = (state) => {
  const { distance = 0, score = -Infinity, num = 0, history = [] } = state

  maxScore = Math.max(maxScore, score)

  if (num == history.length && distance) {
    minDistance = Math.min(minDistance, distance)
  }

  $('#steps').text(step.toString())
  $('#distance').text(distance.toFixed(2))
  $('#mindistance').text(minDistance.toFixed(2))
  $('#score').text(score.toFixed(2))
  $('#maxscore').text(maxScore.toFixed(2))
}

const initDisplay = (state) => {
  step = 0
  minDistance = Infinity
  maxScore = -Infinity
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
