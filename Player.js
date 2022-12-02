class Player extends Sprite {
  constructor(pos, group, collision_sprites, tree_sprites, animations) {
    super(group)
    this.player = true
    this.animations = animations
    this.status = "down_idle"
    this.frameIndex = 0

    //General
    this.image = this.animations[this.status].list[this.frameIndex]
    this.rect = get_rect(this.image, "center", pos)

    this.z = LAYERS.main

    //movement
    this.direction = new Vector2D(0, 0)
    this.pos = new Vector2D(this.rect.centerx, this.rect.centery)
    this.speed = 200
    this.canMove = true

    //collision
    this.hitbox = this.rect.copy().inflate(-126, -70)
    this.collision_sprites = collision_sprites

    //timers
    this.timers = {
      toolUse: new Timer(350, this.useTool.bind(this)),
      toolSwitch: new Timer(200),
      seedUse: new Timer(350, this.useSeed.bind(this)),
      seedSwitch: new Timer(200),
    }

    //tools
    this.tools = ["hoe", "axe", "water"]
    this.toolIndex = 0
    this.selectedTool = this.tools[this.toolIndex]

    //seeds
    this.seeds = ["corn", "tomato"]
    this.seedIndex = 0
    this.selectedSeed = this.seeds[this.seedIndex]

    //inventory
    this.itemInventory = {
      wood: 0,
      apple: 0,
      corn: 0,
      tomato: 0,
    }

    //interaction
    this.tree_sprites = tree_sprites
  }

  getTargetPos() {
    const x =
      this.rect.centerx + PLAYER_TOOL_OFFSET[this.status.split("_")[0]].x
    const y =
      this.rect.centery + PLAYER_TOOL_OFFSET[this.status.split("_")[0]].y
    this.targetPos = new Vector2D(x, y)
  }

  useTool() {
    if (this.selectedTool === "hoe") {
      console.log("hoe")
    }

    if (this.selectedTool === "axe") {
      this.tree_sprites.sprites.forEach((tree) => {
        if (tree.rect.collidepoint(this.targetPos.x, this.targetPos.y)) {
          tree.damage()
        }
      })
    }

    if (this.selectedTool === "water") {
      console.log("water")
    }
  }

  useSeed() {
    console.log("Used seed", this.selectedSeed)
  }

  animate(dt) {
    this.frameIndex += 4 * dt
    if (this.frameIndex >= this.animations[this.status].list.length)
      this.frameIndex = 0
    this.image = this.animations[this.status].list[Math.floor(this.frameIndex)]
  }

  input() {
    //directions
    if (!this.timers.toolUse.active && !this.timers.seedUse.active) {
      if (keys.w.pressed) {
        this.direction.y = -1
        this.status = "up"
      } else if (keys.s.pressed) {
        this.direction.y = 1
        this.status = "down"
      } else this.direction.y = 0

      if (keys.d.pressed) {
        this.direction.x = 1
        this.status = "right"
      } else if (keys.a.pressed) {
        this.direction.x = -1
        this.status = "left"
      } else this.direction.x = 0

      //tool use
      if (keys.space.pressed) {
        this.timers.toolUse.activate()
        this.direction = new Vector2D(0, 0)
        this.frameIndex = 0
      }

      //change tool
      if (keys.q.pressed && !this.timers.toolSwitch.active) {
        this.timers.toolSwitch.activate()
        if (this.toolIndex < this.tools.length - 1) {
          this.toolIndex += 1
        } else {
          this.toolIndex = 0
        }
        this.selectedTool = this.tools[this.toolIndex]
      }

      //seed use
      if (keys.ctrl.pressed) {
        this.timers.seedUse.activate()
        this.direction = new Vector2D(0, 0)
        this.frameIndex = 0
      }

      //change seed
      if (keys.e.pressed && !this.timers.seedSwitch.active) {
        this.timers.seedSwitch.activate()
        if (this.seedIndex < this.seeds.length - 1) {
          this.seedIndex += 1
        } else {
          this.seedIndex = 0
        }
        this.selectedSeed = this.seeds[this.seedIndex]
      }
    }
  }

  getStatus() {
    // idle
    if (this.direction.magnitude == 0) {
      this.status = this.status.split("_")[0] + "_idle"
    }

    // tool use
    if (this.timers.toolUse.active) {
      this.status = this.status.split("_")[0] + "_" + this.selectedTool
    }
  }

  collision(direction) {
    if (direction === "horizontal") {
      for (let i = 0; i < this.collision_sprites.length; i++) {
        const sprite = this.collision_sprites[i]
        if (sprite.hitbox) {
          if (sprite.hitbox.colliderect(this.hitbox)) {
            if (this.direction.x > 0) {
              //moving right
              this.hitbox.right = sprite.hitbox.left
            }
            if (this.direction.x < 0) {
              //moving left
              this.hitbox.left = sprite.hitbox.right
            }
            this.rect.centerx = this.hitbox.centerx
            this.pos.x = this.hitbox.centerx
            break
          }
        }
      }
    }

    if (direction === "vertical") {
      for (let i = 0; i < this.collision_sprites.length; i++) {
        const sprite = this.collision_sprites[i]
        if (sprite.hitbox) {
          if (sprite.hitbox.colliderect(this.hitbox)) {
            if (this.direction.y > 0) {
              //moving down
              this.hitbox.bottom = sprite.hitbox.top
            }
            if (this.direction.y < 0) {
              //moving up
              this.hitbox.top = sprite.hitbox.bottom
            }
            this.rect.centery = this.hitbox.centery
            this.pos.y = this.hitbox.centery
            break
          }
        }
      }
    }
  }

  move(dt) {
    //normalizing a vector for diagonal movement
    if (this.direction.magnitude > 0) {
      this.direction.normalize()
    }

    //horizontal movement
    this.pos.x += this.direction.x * this.speed * dt
    this.hitbox.centerx = this.pos.x
    this.rect.centerx = this.hitbox.centerx
    this.collision("horizontal")

    //veftical movement
    this.pos.y += this.direction.y * this.speed * dt
    this.hitbox.centery = this.pos.y
    this.rect.centery = this.hitbox.centery
    this.collision("vertical")
  }

  test() {
    this.rect.centerx += 1
  }

  updateTimers() {
    Object.values(this.timers).forEach((timer) => {
      timer.update()
    })
  }

  update(dt) {
    this.input()
    this.getStatus()
    this.updateTimers()
    this.getTargetPos()
    this.move(dt)
    //this.test()
    this.animate(dt)
  }
}
