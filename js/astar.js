import { getInitState, copyState, getDistance } from './tools.js'

const calcScore = (config, state) => {
  let score = state.distance

  let arrayX = []
  let arrayY = []

  for (let i = 0; i < state.num; i++) {
    if (state.visited[i]) continue
    arrayX.push(config.pos[i].x)
    arrayY.push(config.pos[i].y)
  }
  arrayX.push(config.pos[state.pos].x)
  arrayY.push(config.pos[state.pos].y)

  arrayX.sort((a, b) => a - b)
  arrayY.sort((a, b) => a - b)

  score += Math.max(arrayX[arrayX.length-1] - arrayX[0], arrayY[arrayY.length-1] - arrayY[0])

  return score
}

const startAStar = function*(config) {
  const initState = getInitState(config || {})
  initState.score = calcScore(config, initState)

  const compareState = (a, b) => { return a.score - b.score; };
  const pqueue = new PriorityQueue({ comparator: compareState });

  pqueue.queue(initState)

  while(pqueue.length) {
    const curState = pqueue.dequeue()
    if (curState.history.length != 0 && curState.pos == curState.start) {
      if (curState.history.length == curState.num) {
        yield curState
        return
      } else {
        continue
      }
    }

    yield curState

    for (let i = 0; i < curState.num; i++) {
      if (!curState.visited[i]) {
        const nextState = copyState(curState)
        nextState.pos = i
        nextState.history.push(curState.pos)
        nextState.visited[i] = true
        nextState.distance += getDistance(config.pos[curState.pos], config.pos[i])
        nextState.score = calcScore(config, nextState)
        pqueue.queue(nextState)
      }
    }
  }
}

export default startAStar

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
