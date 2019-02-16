const initCanvas = () => {
  const canvas = $('#canvas')
  const canvas_parent = $('#canvas').parent()
  canvas.attr('width', canvas_parent.width().toString());
  canvas.attr('height', ($(window).height() - 70 - $('#header').height()).toString());
  canvas_parent.attr('height', ($(window).height() - 70).toString());
}

const drawEdge = (ctx, posA, posB) => {
  ctx.beginPath()
  ctx.moveTo(posA.x, posA.y)
  ctx.lineTo(posB.x, posB.y)
  ctx.stroke()
}

const drawNode = (ctx, pos, size) => {
  const beforeFillStyle = ctx.fillStyle
  const beforeStrokeStyle = ctx.strokeStyle

  ctx.fillStyle = 'white'
  ctx.strokeStyle = 'blue'
  ctx.beginPath();
  ctx.arc(pos.x, pos.y, size/2, 0, Math.PI*2, false);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = beforeFillStyle
  ctx.strokeStyle = beforeStrokeStyle
}

const drawGraph = (config, state) => {
  if (!config || !state) return

  const canvas = $('#canvas').get(0)
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i + 1 < state.history.length; i++) {
    drawEdge(ctx, config.pos[state.history[i]], config.pos[state.history[i+1]])
  }

  if (state.history.length)
    drawEdge(ctx, config.pos[state.history[state.history.length-1]], config.pos[state.pos])

  for (let i = 0; i < config.num; i++) {
    drawNode(ctx, config.pos[i], config.nodeSize)
  }
}

/* export */

window.initCanvas = initCanvas

export {
  drawGraph,
  initCanvas
}
