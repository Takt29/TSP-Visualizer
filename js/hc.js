import { getInitState, copyState, getDistanceFromArray } from './tools.js'

const startHC = function*(config) {
  const initState = getInitState(config || {})

  initState.pos = initState.start

  initState.history.push(initState.start)
  for (let i = 0; i < initState.num; i++) {
    initState.visited[i] = true

    if (i != initState.start)
      initState.history.push(i)
  }

  initState.distance = getDistanceFromArray(config.pos, initState.history.concat(initState.pos))

  let curState = copyState(initState)

  while (1) {
    yield curState

    let minNextState = null
    let minNextStateDistance = curState.distance

    for (let i = 1; i < curState.num; i++) {
      for (let j = i+1; j < curState.num; j++) {
        const nextState = copyState(curState)

        /* swap */
        const a = curState.history[i]
        const b = curState.history[j]
        nextState.history[i] = b
        nextState.history[j] = a

        nextState.distance = getDistanceFromArray(config.pos, nextState.history.concat(nextState.pos))

        if (minNextStateDistance > nextState.distance) {
          minNextState = nextState
          minNextStateDistance = nextState.distance
        }
      }
    }

    if (!minNextState) break
    curState = minNextState
  }
}

export default startHC

/*
state = {
start = 0, //初期値
pos = 1,   //現在地
history = [0, 3], //訪問履歴(現在地を除く)
visited = [false, true, false, true, false], //訪問フラグ(現在地含む)
score = 0, //スコア
distance = 0.0, //現在距離
}
*/
