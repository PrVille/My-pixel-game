class Clock {
  constructor() {
    this.start = Date.now()
    this.passedTime = Date.now() - this.start
    this.previous = Date.now()
  }
  /**
   * Compute how many milliseconds have passed since the previous call
   * Update passed time
   * @returns time between previous call in ms
   */
  tick() {
    this.passedTime = Date.now() - this.start
    const res = Date.now() - this.previous
    this.previous = Date.now()
    return res
  }

  get ticks() {
    return this.passedTime
  }
}
