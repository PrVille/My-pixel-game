class Vector2D {
  constructor(x, y) {
    this._x = x
    this._y = y
  }

  get x() {
    return this._x
  }
  set x(value) {
    //console.log(value);

    this._x = value
  }

  get y() {
    return this._y
  }
  set y(value) {
    this._y = value
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }

  normalize() {
    const m = this.magnitude
    this.x = this.x / m
    this.y = this.y / m
  }
}
