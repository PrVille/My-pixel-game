class Game {
  constructor(width, height) {
    this.canvas = document.getElementById("canvas")
    this.ctx = this.canvas.getContext("2d")
    this.CANVAS_WIDTH = this.canvas.width = width
    this.CANVAS_HEIGHT = this.canvas.height = height
    this.clock = new Clock()
    this.level = new Level(
      this.ctx,
      this.CANVAS_WIDTH,
      this.CANVAS_HEIGHT,
      groundImg
    )
    this.frame = 0
  }

  run() {
    const animate = () => {
      this.frame = requestAnimationFrame(animate)
      const dt = this.clock.tick() / 1000
      this.level.run(dt)
    }
    animate()
  }

  stop(duration) {
    if (duration) {
      setTimeout(
        function () {
          cancelAnimationFrame(this.frame)
          console.log(`Exited after ${duration} seconds`)
          console.log("actual time", Date.now() - time, "ms")
        }.bind(this),
        duration * 1000
      ) //stop game after x seconds
    } else {
      cancelAnimationFrame(this.frame)
    }
  }
}
