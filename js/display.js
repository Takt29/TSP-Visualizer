let step = 0

const initDisplay = (state) => {
  const {distance = 0, score = 0} = state
  step = 0

  $('#steps').text(step.toString())
  $('#distance').text(distance.toFixed(2))
  $('#score').text(score.toFixed(2))
}

const updateWithStep = (state) => {
  const {distance = 0, score = 0} = state
  step = (step || 0) + 1

  $('#steps').text(step.toString())
  $('#distance').text(distance.toFixed(2))
  $('#score').text(score.toFixed(2))
}

export {
  initDisplay,
  updateWithStep,
}
