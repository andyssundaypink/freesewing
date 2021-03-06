const decorate = {}

/** Decorares points with extra info */
decorate.points = function(svg, pointHover) {
  for (let partId in svg.pattern.parts) {
    let part = svg.pattern.parts[partId]
    if (part.render) {
      for (let pointId in part.points) {
        let point = part.points[pointId]
        let type = pointId.substr(0, 1) === '_' ? 'point-hidden' : 'point'
        let id = 'snippet-' + pointId
        part.snippets[id] = new svg.pattern.Snippet(type, point)
        part.snippets[id].attributes.set('onmouseover', function() {
          pointHover('test', 'data')
        })
        //  raiseEvent('pointHover', {
        //    type: "point",
        //    pointId,
        //    partId,
        //    point,
        //  })
        //}));
      }
    }
  }
}

/** Decorares path points with extra info */
decorate.pathPoint = function(id, Snippet, snippets, point, type, pathId, partId) {
  snippets[id] = new Snippet(`path-${type}-point`, point, `Path ${pathId}: ${type}`)
  snippets[id].attributes.set('id', id)
  snippets[id].attributes.add('data-path', pathId)
  snippets[id].attributes.add('data-part', partId)
}

/** Draws curve control handles */
decorate.curveHandles = function(id, Path, paths, from, to, pathId, partId) {
  let path = new Path().move(from).line(to)
  path.attributes.add('class', 'curve-control various dotted')
  path.attributes.add('id', id)
  path.attributes.add('data-path', pathId)
  path.attributes.add('data-part', partId)
  paths[id] = path
}

/** Decorares paths with extra info */
decorate.paths = function(svg) {
  for (let partId in svg.pattern.parts) {
    let part = svg.pattern.parts[partId]
    if (part.render) {
      for (let pathId in part.paths) {
        let path = part.paths[pathId]
        if (path.render) {
          let current
          for (let op of path.ops) {
            if (op.type !== 'close') {
              decorate.pathPoint(
                svg.getId(),
                svg.pattern.Snippet,
                part.snippets,
                op.to,
                op.type,
                pathId,
                partId
              )
            }
            if (op.type === 'curve') {
              decorate.pathPoint(
                svg.getId(),
                svg.pattern.Snippet,
                part.snippets,
                op.cp1,
                'handle',
                pathId,
                partId
              )
              decorate.pathPoint(
                svg.getId(),
                svg.pattern.Snippet,
                part.snippets,
                op.cp2,
                'handle',
                pathId,
                partId
              )
              decorate.curveHandles(
                svg.getId(),
                svg.pattern.Path,
                part.paths,
                current,
                op.cp1,
                pathId,
                partId,
                part
              )
              decorate.curveHandles(
                svg.getId(),
                svg.pattern.Path,
                part.paths,
                op.to,
                op.cp2,
                pathId,
                partId,
                part
              )
            }
            current = op.to
          }
        }
      }
    }
  }
}

export default decorate
