class Sprite {
  constructor(group) {
    if (Array.isArray(group)) {      
      group.forEach(g => {
        g.addSprite(this)
      })
    } else group.addSprite(this)
    this.groups = group
    this.image
    this.rect
  }

  kill() {
    if (Array.isArray(this.groups)) {      
      this.groups.forEach(g => {
        g.removeSprite(this)
      })
    } else {
      this.groups.removeSprite(this)
    }
  }

  draw(ctx, rect) {
    ctx.drawImage(this.image, rect.x, rect.y)

    //ctx.fillStyle = "white"
    //if (rect.width < 1000) ctx.fillRect(rect.x, rect.y, rect.width, rect.height)
    //ctx.fillStyle = "red"
    //ctx.fillRect(640, 320, this.rect.width, this.rect.height)
  }

  update(dt) {}
}

class Generic extends Sprite {
  constructor(pos, surf, group, z = LAYERS.main) {
    super(group)
    this.image = surf
    this.rect = get_rect(this.image, "topleft", pos)
    this.z = z
  }
}

class GenericTile extends Sprite {
  constructor(sx, sy, dx, dy, surf, group, z = LAYERS.main, width = TILE_SIZE, height=TILE_SIZE) {
    super(group)
    this.sx = sx
    this.sy = sy
    this.dx = dx
    this.dy = dy
    this.width = width
    this.health = height
    this.z = z
    this.image = surf    
    this.rect = get_rect(this.image, "topleft", { x: dx, y: dy }, {width: width, height: height})
    this.hitbox = this.rect.copy().inflate(-this.rect.width * 0.2, -this.rect.height * 0.75)
  }

  draw(ctx, rect) {
    ctx.drawImage(
      this.image,
      this.sx,
      this.sy,
      rect.width,
      rect.height,
      rect.x,
      rect.y,
      rect.width,
      rect.height
    )
    // ctx.fillStyle = "white"
    // const hitbox = rect.copy().inflate(-rect.width * 0.2, -rect.height * 0.75)
    // //const hitbox = rect.copy().inflate(-20, -rect.height * 0.9)
    // ctx.fillRect(hitbox.x, hitbox.y, hitbox.width, hitbox.height)
  }
}

class Water extends GenericTile {
  constructor(sx, sy, dx, dy, frames, group) {
    super(sx, sy, dx, dy, frames[0], group, LAYERS.water)
    //animation setup
    this.frames = frames
    this.frameIndex = 0
  }

  animate(dt) {
    this.frameIndex += 5 * dt
    if (this.frameIndex >= this.frames.length)
      this.frameIndex = 0
    this.image = this.frames[Math.floor(this.frameIndex)]
  }

  update(dt) {
    this.animate(dt)
  }
}

class WildFlower extends GenericTile {
  constructor(sx, sy, dx, dy, surf, group, z = LAYERS.main, width, height) {
    super(sx, sy, dx, dy - height, surf, group, z, width, height)
    this.hitbox = this.rect.copy().inflate(-20, -this.rect.height * 0.9)

  }
}

class Particle extends GenericTile {
  constructor(sx, sy, dx, dy, surf, group, z, width, height, duration = 10000) {
    super(sx, sy, dx, dy - height, surf, group, z, width, height)
    this.startTime = Date.now()
    this.duration = duration

    // white surf

  }

  // draw(ctx, rect) {

  //   ctx.drawImage(
  //     this.image,
  //     this.sx,
  //     this.sy,
  //     rect.width,
  //     rect.height,
  //     rect.x,
  //     rect.y,
  //     rect.width,
  //     rect.height
  //   )

  //   ctx.globalCompositeOperation = 'source-in';

  //   ctx.fillStyle='red'
  //   ctx.fillRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);

  //   ctx.globalCompositeOperation="destination-atop";
  //   //ctx.globalCompositeOperation = 'source-in';
  // }

  update(dt) {
    const currentTime = Date.now()
    if (currentTime - this.startTime > this.duration) {
      this.kill()
    }
  }
}

class Tree extends GenericTile {
  constructor(sx, sy, dx, dy, surf, group, z = LAYERS.main, width, height, name, playerAdd) {
    super(sx, sy, dx, dy - height, surf, group, z, width, height)
    this.name = name
    
    //tree attributes
    this.health = 5
    this.alive = true
    this.stumpSurf = stumpImages[name]   
    this.invulTimer = new Timer(200),
    
    //apples
    this.appleSurf = appleImg
    this.applePos = APPLE_POS[name]
    this.apple_sprites = new Group()
    this.createFruit()

    this.playerAdd = playerAdd
  }

  damage() {
    //damage tree
    this.health -= 1
    //remove an apple
    if (this.apple_sprites.sprites.length > 0) {
      const randApple = this.apple_sprites.sprites[randomIntFromInterval(0, this.apple_sprites.sprites.length - 1)]      
      this.playerAdd('apple')      
      randApple.kill()
    }
  }

  checkDeath() {
    if (this.health <= 0) {
      this.image = this.stumpSurf
      this.rect = get_rect(this.image, "midbottom", this.rect.midBottom)
      this.hitbox = this.rect.copy().inflate(-10, -this.rect.height * 0.6)      
      this.alive = false 
      if (this.name === 'Large') this.playerAdd('wood', 2)  
      else this.playerAdd('wood')  
    }
  }

  update(dt) {
    if (this.alive) this.checkDeath()
  }

  createFruit() {
    this.applePos.forEach(pos => {
      if (randomIntFromInterval(0, 10) < 2) {
        //console.log(pos);
        
        const x = pos[0] + this.rect.left
        //console.log(x);
        
        const y = pos[1] + this.rect.top
        new GenericTile(0, 0, x, y, this.appleSurf, [this.apple_sprites, this.groups[0]],
          LAYERS.fruit, this.appleSurf.width, this.appleSurf.height)
      }
    })
  }
}