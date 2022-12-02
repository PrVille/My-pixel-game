const SCREEN_WIDTH = 1280
const SCREEN_HEIGHT = 720
const TILE_SIZE = 64

const time = Date.now()

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
  q: {
    pressed: false,
  },
  e: {
    pressed: false,
  },
  ctrl: {
    pressed: false,
  },
}

const OVERLAY_POSITIONS = {
  tool: {
    x: 40,
    y: SCREEN_HEIGHT - 15,
  },
  seed: {
    x: 70,
    y: SCREEN_HEIGHT - 5,
  },
}

const PLAYER_TOOL_OFFSET = {
  left: { x: -50, y: 40 },
  right: { x: 50, y: 40 },
  up: { x: 0, y: -10 },
  down: { x: 0, y: 50 },
}

const LAYERS = {
  water: 0,
  ground: 1,
  soil: 2,
  soilWater: 3,
  rainFloor: 4,
  houseBottom: 5,
  groundPlant: 6,
  main: 7,
  houseTop: 8,
  fruit: 9,
  rainDrops: 10,
}

const APPLE_POS = {
  Small: [
    [18, 17],
    [30, 37],
    [12, 50],
    [30, 45],
    [20, 30],
    [30, 10],
  ],
  Large: [
    [30, 24],
    [60, 65],
    [50, 50],
    [16, 40],
    [45, 50],
    [42, 70],
  ],
}

const GROW_SPEED = {
  corn: 1,
  tomato: 0.7,
}

const SALE_PRICES = {
  wood: 4,
  apple: 2,
  corn: 10,
  tomato: 20,
}
const PURCHASE_PRICES = {
  corn: 4,
  tomato: 5,
}
