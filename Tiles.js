class Tile {
  constructor(gid, sx, sy, dx, dy, surf) {
    this.gid = gid
    this.sx = sx
    this.sy = sy
    this.dx = dx
    this.dy = dy
    this.image = surf
  }
}

class Tileset {
  constructor(firstGid, name, tilecount, columns, surf) {
    this.firstGid = firstGid
    this.name = name
    this.tileCount = tilecount
    this.lastGid = firstGid + tilecount - 1
    this.columns = columns
    this.image = surf
  }

  get_tiles(layer) {
    //console.log(this);
    //console.log(layer);
    const tiles = []
    //console.log(tileSets[0].tiles)
    this.mapCol = layer.width
    this.mapRow = layer.height
    this.mapHeight = this.mapRow * TILE_SIZE
    this.mapWidth = this.mapCol * TILE_SIZE
    //console.log(this.mapHeight, this.mapWidth);
    //console.log(this.firstGid, this.lastGid);

    this.mapIndex = 0
    this.srcX = 0
    this.srcY = 0

    this.map = layer.data
    //console.log(this.map);
    for (let col = 0; col < this.mapHeight; col += TILE_SIZE) {
      for (let row = 0; row < this.mapWidth; row += TILE_SIZE) {
        let tileVal = this.map[this.mapIndex]

        //console.log(tileVal);
        if (tileVal >= this.firstGid && tileVal <= this.lastGid) {
          //console.log(this.map[this.mapIndex], tileVal);
          //console.log(tileVal - 207);
          tileVal -= this.firstGid
          //console.log(tileVal);

          this.srcY = Math.floor(tileVal / this.columns) * TILE_SIZE
          this.srcX = (tileVal % this.columns) * TILE_SIZE
          tiles.push(
            new Tile(tileVal, this.srcX, this.srcY, row, col, this.image)
          )
          // this.ctx.drawImage(this.tilesetImg, this.sourceX, this.sourceY, TILE_SIZE,
          //    TILE_SIZE, row, col, TILE_SIZE, TILE_SIZE)
        }
        this.mapIndex++
      }
    }

    return tiles
  }
}

class Obj {
  constructor(gid, surf, width, height) {
    this.gid = gid
    this.surf = surf
    this.width = width
    this.height = height
  }
}

class Layer {
  constructor(name, data, width, height) {
    this.name = name
    this.data = data
    this.width = width
    this.height = height
    this.tiles = []
  }

  get_tiles() {
    tileSets.forEach((tileset) => {
      //console.log(tileset);
      const tiles = tileset.get_tiles(this.data)
      if (tiles) this.tiles = this.tiles.concat(tiles)
    })
    return this.tiles
  }
}

class ObjectGroup {
  constructor(name, objectsData) {
    this.name = name
    this.objectsData = objectsData
    this.objects = []
    if (this.name != 'Player') this.init()
  }

  find_obj(gid) {
    return objects.find((obj) => {
      return obj.gid === gid
    })
  }

  init() {    
    this.objectsData.forEach((obj) => {
      const matchObj = this.find_obj(obj.gid)
      const o = {
        sx: 0,
        sy: 0,
        dx: obj.x,
        dy: obj.y,
        img: matchObj.surf,
        width: matchObj.width,
        height: matchObj.height,
        name: obj.name
      }
      this.objects.push(o)
    })
    
  }
}

class Map {
  constructor(data, cols, rows) {
    this.data = data
    this.cols = cols
    this.rows = rows
    this.mapHeight = this.rows * TILE_SIZE
    this.mapWidth = this.cols * TILE_SIZE
    this.layers = []
    this.objGroups = []
    this.init()
  }

  init() {
    const layers = this.data.layers
    //console.log(layers);
    layers.forEach((layer) => {
      //console.log(layer.type);

      if (layer.type === "tilelayer") {
        this.layers.push(
          new Layer(layer.name, layer, layer.width, layer.height)
        )
      } else if (layer.type === "objectgroup") {
        this.objGroups.push(new ObjectGroup(layer.name, layer.objects))
      }
    })
    //console.log(this.layers, this.objGroups);
  }

  get_layer(name) {
    return this.layers.find((layer) => {
      return layer.name === name
    })
  }

  get_objectLayer(name) {
    return this.objGroups.find((layer) => {
      return layer.name === name
    })
  }
}
