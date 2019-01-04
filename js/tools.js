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

const sleep = (time) => (new Promise((resolve, reject) => {
  setTimeout(() => { resolve() }, time)
}))

export {
  copyState,
  getDistance,
  getInitState,
  sleep,
}
