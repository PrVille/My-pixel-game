class Level {
  constructor(ctx, canvasWidth, canvasHeight, groundImg) {
    this.ctx = ctx
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    this.all_sprites = new CameraGroup()
    this.collision_sprites = new Group()
    this.tree_sprites = new Group()
    
    this.groundImage = groundImg
    this.setup()
    //console.log(this.collision_sprites);

    this.overlay = new Overlay(this.player, ctx)
  }

  setup() {
    const map = new Map(TileMaps.map, 50, 40)

    //house
    const houseBottomList = ["HouseFloor", "HouseFurnitureBottom"] //draw in this order
    houseBottomList.forEach((layer) => {
      map
        .get_layer(layer)
        .get_tiles()
        .forEach((tile) => {
          new GenericTile(
            tile.sx,
            tile.sy,
            tile.dx,
            tile.dy,
            tile.image,
            this.all_sprites,
            LAYERS.houseBottom
          )
        })
    })

    const houseTopList = ["HouseWalls", "HouseFurnitureTop"] //draw in this order
    houseTopList.forEach((layer) => {
      map
        .get_layer(layer)
        .get_tiles()
        .forEach((tile) => {
          new GenericTile(
            tile.sx,
            tile.sy,
            tile.dx,
            tile.dy,
            tile.image,
            this.all_sprites
          )
        })
    })

    //fence
    map
      .get_layer("Fence")
      .get_tiles()
      .forEach((tile) => {
        new GenericTile(tile.sx, tile.sy, tile.dx, tile.dy, tile.image, [
          this.all_sprites,
          this.collision_sprites,
        ])
      })

    //water
    const waterFrames = waterAnimations
    //console.log(waterFrames);
    map
      .get_layer("Water")
      .get_tiles()
      .forEach((tile) => {
        new Water(
          tile.sx,
          tile.sy,
          tile.dx,
          tile.dy,
          waterFrames,
          this.all_sprites
        )
      })

    //trees
    const treeObjs = map.get_objectLayer("Trees")
    //new Particle((treeObjs.objects[0]).sx, treeObjs.objects[0].sy,1561,1772,treeObjs.objects[0].img, this.all_sprites, LAYERS.fruit, treeObjs.objects[0].width, treeObjs.objects[0].height)
    treeObjs.objects.forEach((t) => {
      //console.log(t);
      new Tree(
        t.sx,
        t.sy,
        t.dx,
        t.dy,
        t.img,
        [this.all_sprites, this.collision_sprites, this.tree_sprites],
        LAYERS.main,
        t.width,
        t.height,
        t.name,
        this.player_add.bind(this)
      )
    })

    //wildflowers
    const decorationObjs = map.get_objectLayer("Decoration")
    decorationObjs.objects.forEach((t) => {
      new WildFlower(
        t.sx,
        t.sy,
        t.dx,
        t.dy,
        t.img,
        [this.all_sprites, this.collision_sprites],
        LAYERS.main,
        t.width,
        t.height
      )
    })

    //collision tiles
    map
      .get_layer("Collision")
      .get_tiles()
      .forEach((tile) => {
        //console.log(tile)
        new GenericTile(
          tile.sx,
          tile.sy,
          tile.dx,
          tile.dy,
          tile.image,
          this.collision_sprites
        )
      })

    //player
    const playerData = map.get_objectLayer("Player").objectsData
    playerData.forEach((obj) => {
      if (obj.name === "Start") {
        
        this.player = new Player(
          { x: obj.x, y: obj.y },
          this.all_sprites,
          this.collision_sprites.sprites,
          this.tree_sprites,
          playerAnimations
        )
      }
    })

    //ground
    new Generic(
      { x: 0, y: 0 },
      this.groundImage,
      this.all_sprites,
      LAYERS.ground
    )
  }

  player_add(item, amount = 1) {    
    this.player.itemInventory[item] += amount
    console.log(this.player.itemInventory);
  }

  run(dt) {
    this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
    this.ctx.fillStyle = "black"
    this.ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight)

    this.all_sprites.customDraw(this.ctx, this.player)

    this.all_sprites.update(dt)
    //this.testdraw()
    this.overlay.display()
    //console.log(this.player.itemInventory)
  }
}

class CameraGroup extends Group {
  constructor() {
    super()
    this.offset = new Vector2D(0, 0)
  }

  //draw layers in order
  customDraw(ctx, player) {
    //player stayes centered
    this.offset.x = player.rect.centerx - SCREEN_WIDTH / 2
    this.offset.y = player.rect.centery - SCREEN_HEIGHT / 2
    //console.log(this.offset)

    Object.values(LAYERS).forEach((layer) => {
      this.sprites
        .sort((a, b) => a.rect.centery - b.rect.centery)
        .forEach((sprite) => {
          if (sprite.z === layer) {
            //console.log(sprite.name);

            
            
            const offsetRect = sprite.rect.copy()
            offsetRect.centerx -= this.offset.x
            offsetRect.centery -= this.offset.y
            sprite.draw(ctx, offsetRect)

            // analytics
            if (sprite.player){ 
              ctx.lineWidth = 5;
              ctx.strokeStyle = "red";
              ctx.strokeRect(offsetRect.x, offsetRect.y, offsetRect.w, offsetRect.h);
              const hitBoxRect = player.hitbox.copy()
              hitBoxRect.centerx = offsetRect.centerx
              hitBoxRect.centery = offsetRect.centery
              ctx.lineWidth = 5;
              ctx.strokeStyle = "green";
              ctx.strokeRect(hitBoxRect.x, hitBoxRect.y, hitBoxRect.w, hitBoxRect.h);
              const x = offsetRect.centerx + PLAYER_TOOL_OFFSET[player.status.split("_")[0]].x
              const y = offsetRect.centery + PLAYER_TOOL_OFFSET[player.status.split("_")[0]].y
              ctx.strokeStyle = "blue";
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, 2 * Math.PI);
              ctx.stroke();

            }
            
          }
        })
    })
  }
}
