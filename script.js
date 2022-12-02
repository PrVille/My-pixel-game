let game

const initGame = () => {
  game = new Game(SCREEN_WIDTH, SCREEN_HEIGHT)
  game.run()
  game.stop(60)
}


const import_player_assets = () => {
  const animations = {
    up: { list: [], amount: 4 },
    down: { list: [], amount: 4 },
    left: { list: [], amount: 4 },
    right: { list: [], amount: 4 },
    right_idle: { list: [], amount: 2 },
    left_idle: { list: [], amount: 2 },
    up_idle: { list: [], amount: 2 },
    down_idle: { list: [], amount: 2 },
    right_hoe: { list: [], amount: 2 },
    left_hoe: { list: [], amount: 2 },
    up_hoe: { list: [], amount: 2 },
    down_hoe: { list: [], amount: 2 },
    right_axe: { list: [], amount: 2 },
    left_axe: { list: [], amount: 2 },
    up_axe: { list: [], amount: 2 },
    down_axe: { list: [], amount: 2 },
    right_water: { list: [], amount: 2 },
    left_water: { list: [], amount: 2 },
    up_water: { list: [], amount: 2 },
    down_water: { list: [], amount: 2 },
  }

  Object.keys(animations).forEach((animation) => {
    const full_path = "./graphics/character/" + animation
    const images = importFolder(full_path, animations[animation].amount)
    animations[animation].list = images
  })
  return animations
}

const import_water_animations = () => {
  const full_path = "./graphics/water"
  const images = importFolder(full_path, 4)
  return images
}

const import_objects = () => {
  const res = []
  const objs = TileMaps.map.objects[0]
  //console.log(TileMaps.map.objects[0]);
  objs.sources.forEach(src => {
    //console.log(src);
    const img = new Image()
    img.src = src.source
    res.push(new Obj(objs.firstgid + src.id, img, src.width, src.height))
  })
  return res
}

const playerAnimations = import_player_assets()
const waterAnimations = import_water_animations()
const objects = import_objects()
//console.log(objects);


const groundImg = new Image()
groundImg.src = "./graphics/world/ground.png"

const appleImg = new Image()
appleImg.src = './graphics/fruit/apple.png'

const smallStumpImg = new Image()
smallStumpImg.src = './graphics/stumps/small.png'

const largeStumpImg = new Image()
largeStumpImg.src = './graphics/stumps/large.png'

const stumpImages = {
  Large: largeStumpImg,
  Small: smallStumpImg
}

const loadableImages = [groundImg, appleImg, smallStumpImg, largeStumpImg]
const tileSets = []

//preload moving images adn stuff

const promises = []
objects.forEach(obj => {
  promises.push(
    new Promise((resolve, reject) => {
      obj.surf.onload = () => {
        resolve(true)
      }
    })
  )
})

TileMaps.map.tilesets.forEach((tileset) => {
  //console.log(tileset)
  const img = new Image()
  img.src = tileset.source
  promises.push(
    new Promise((resolve, reject) => {
      img.onload = () => {
        tileSets.push(
          new Tileset(
            tileset.firstgid,
            tileset.name,
            tileset.tilecount,
            tileset.columns,
            img
          )
        )
        resolve(true)
      }
    })
  )
})

loadableImages.forEach(img => {
  promises.push(
    new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(true)
      }
    })
  )
})

Object.values(playerAnimations).forEach((animation) => {
  //console.log(animation.list);
  animation.list.forEach((img) => {
    //console.log(img);
    promises.push(
      new Promise((resolve, reject) => {
        img.onload = () => {
          resolve(true)
        }
      })
    )
  })
})

waterAnimations.forEach((img) => {
  promises.push(
    new Promise((resolve, reject) => {
      img.onload = () => {
        resolve(true)
      }
    })
  )
})

Promise.all(promises).then((result) => {
  //console.log("images loaded test with random width", playerAnimations.left_hoe.list[0].width);
  //console.log(groundImg.width);
  //console.log(tileSets);
  //console.log(waterAnimations);
  
  initGame()
})


let lastKey = ""
this.addEventListener("keydown", (e) => {
  //console.log(e.key);

  switch (e.key) {
    case "w":
      keys.w.pressed = true
      lastKey = "w"
      break
    case "a":
      keys.a.pressed = true
      lastKey = "a"
      break
    case "s":
      keys.s.pressed = true
      lastKey = "s"
      break
    case "d":
      keys.d.pressed = true
      lastKey = "d"
      break
    case " ":
      keys.space.pressed = true
      lastKey = " "
      break
    case "q":
      keys.q.pressed = true
      lastKey = "q"
      break
    case "e":
      keys.e.pressed = true
      lastKey = "e"
      break
    case "Control":
      keys.ctrl.pressed = true
      lastKey = "Control"
      break
  }
})

this.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "w":
      keys.w.pressed = false
      break
    case "a":
      keys.a.pressed = false
      break
    case "s":
      keys.s.pressed = false
      break
    case "d":
      keys.d.pressed = false
      break
    case " ":
      keys.space.pressed = false
      break
    case "q":
      keys.q.pressed = false
      break
    case "e":
      keys.e.pressed = false
      break
    case "Control":
      keys.ctrl.pressed = false
      break
  }
})
