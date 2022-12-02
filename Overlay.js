class Overlay {
  constructor(player, ctx) {
    //general
    this.player = player
    this.ctx = ctx

    //imports
    this.tools = []
    this.seeds = []
    this.init()
  }

  init() {
    const path = "./graphics/overlay/"
    this.player.tools.forEach((tool) => {
      const toolImg = new Image()
      toolImg.src = path + tool + ".png"
      this.tools[tool] = toolImg
    })
    //console.log(this.tools);

    this.player.seeds.forEach((seed) => {
      const seedImg = new Image()
      seedImg.src = path + seed + ".png"
      this.seeds[seed] = seedImg
    })
    //console.log(this.seeds);
  }

  display() {
    const toolImg = this.tools[this.player.selectedTool]
    const toolRect = get_rect(toolImg, "midbottom", {
      x: OVERLAY_POSITIONS.tool.x,
      y: OVERLAY_POSITIONS.tool.y,
    })
    this.ctx.drawImage(toolImg, toolRect.x, toolRect.y)
    const seedImg = this.seeds[this.player.selectedSeed]
    const seedRect = get_rect(seedImg, "midbottom", {
      x: OVERLAY_POSITIONS.seed.x,
      y: OVERLAY_POSITIONS.seed.y,
    })
    this.ctx.drawImage(seedImg, seedRect.x, seedRect.y)
  }
}
