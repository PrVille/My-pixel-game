class Timer {
  constructor(duration, func = null) {
    this.duration = duration
    this.func = func
    this.start = 0
    this.active = false
  }

  activate() {
    this.active = true
    this.start = Date.now()
  }

  deactivate() {
    this.active = false
    this.start = 0
  }

  update() {
    const current = Date.now()
    if (current - this.start >= this.duration && this.start != 0) {
      this.deactivate()
      if (this.func) {
        this.func()
      }
    }
  }
}
