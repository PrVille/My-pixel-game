const logger = (name) => {
  console.log(`hi ${name}`)
}

const importFolder = (path, amount) => {
  const img_list = []
  for (let i = 0; i < amount; i++) {
    const fullPath = path + "/" + i + ".png"
    const img = new Image()
    img.src = fullPath
    img_list.push(img)
  }
  return img_list
}

const importFolderSrc = (path, amount) => {
  const src_list = []
  for (let i = 0; i < amount; i++) {
    const fullPath = path + "/" + i + ".png"
    src_list.push(img)
  }
  return src_list
}

const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const magnitude = (vector) => {
  return Math.sqrt(vector.x * vector.x + vector.y * vector.y)
}

const normalize = (vector) => {
  const v = vector
  const m = magnitude(v)
  v.x = v.x / m
  v.y = v.y / m
  return v
}

const log_rect = (rect) => {
  console.log("rect :>> ", rect)
  console.log(rect.centerx)
  rect.centerx += 1
  console.log(rect.centerx)
}

const get_rect = (image, placement, vector, crop) => {
  // 16x16
  const x = vector.x
  const y = vector.y
  let w
  let h
  if (crop) {
    //console.log(crop);
    w = crop.width
    h = crop.height
  } else {
    w = image.width
    h = image.height
  }

  switch (placement) {
    case "center": {
      const rect = new Rect(x, y, w, h)
      rect.centerx = x
      rect.centery = y
      return rect
    }
    case "midbottom": {
      const rect = new Rect(x, y, w, h)
      rect.midBottom = { x, y }
      return rect
    }
    case "topleft": {
      const rect = new Rect(x, y, w, h)
      rect.topleft = { x, y }
      return rect
    }
    default: {
      break
    }
  }
}
