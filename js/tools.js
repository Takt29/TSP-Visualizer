const getInitState = (config) => ({
  num: config.num || 0,
  start: config.start || 0,
  pos: config.start || 0,
  history: [],
  visited: (new Array(config.num || 0)).fill(false),
  score: 0.0,
  distance: 0.0,
})

const copyState = (state) => ({
  num: state.num,
  start: state.start,
  pos: state.pos,
  history: state.history.concat(),
  visited: state.visited.concat(),
  score: state.score,
  distance: state.distance,
})

const getDistance = (posA, posB) => (
  Math.sqrt((posA.x - posB.x) * (posA.x - posB.x) + (posA.y - posB.y) * (posA.y - posB.y))
)

const getDistanceFromArray = (posArray, history) => {
  let sumDistance = 0.0

  for (let i = 0; i + 1 < history.length; i++) {
    sumDistance += getDistance(posArray[history[i]], posArray[history[i+1]])
  }

  return sumDistance
}

const sleep = (time) => (new Promise((resolve, reject) => {
  setTimeout(() => { resolve() }, time)
}))

const reverse = (arr, begin, end) => {
  const n = end - begin

  for (let i = 0; i < n / 2; i++) {
    const tmp = arr[begin + i]
    arr[begin + i] = arr[end - i - 1]
    arr[end - i - 1] = tmp
  }
}

Object.assign(this, {
  copyState,
  getDistance,
  getDistanceFromArray,
  getInitState,
  reverse,
  sleep,
})
