class Rect {
  /**
   * Assigning to size, width or height changes the dimensions of the rectangle;
   * all other assignments move the rectangle without resizing it.
   * Notice that some attributes are integers and others are pairs of integers.
   */
  constructor(x, y, w, h) {
    this._x = x
    this._y = y
    this._w = w
    this._h = h
  }

  _rect_collide(a, b) {
    
    return a.x + a.w > b.x && b.x + b.w > a.x && a.y + a.h > b.y && b.y + b.h > a.y
  }

  colliderect(other) {
    return this._rect_collide(this, other)
  }

  collidepoint(x, y) {
    return x >= this._x && y >= this._y && x < this._x + this._w && y < this._y + this._h
  }

  copy() {
    return new Rect(this._x, this._y, this._w, this._h)
  }

  inflate(x, y) {
    return new Rect(this._x - x / 2, this._y - y / 2, this._w + x, this._h + y)
  }

  get x() {
    return this._x
  }
  set x(value) {
    this._x = value
  }

  get y() {
    return this._y
  }
  set y(value) {
    this._y = value
  }

  get w() {
    return this._w
  }

  get h() {
    return this._h
  }

  get left() {
    return this._x
  }
  set left(value) {
    this._x = value
  }

  get top() {
    return this._y
  }
  set top(value) {
    this._y = value
  }

  get bottom() {
    return this._y + this._h
  }
  set bottom(value) {
    this._y = value - this._h
  }

  get right() {
    return this._x + this._w
  }
  set right(value) {
    this._x = value - this._w
  }

  get topleft() {
    return {
      x: this._x,
      y: this._y,
    }
  }
  set topleft(value) {
    this._x = value.x
    this._y = value.y
  }

  get midBottom() {
    return {
      x: this._x + this._w / 2,
      y: this._y + this._h,
    }
  }
  set midBottom(value) {
    this._x = value.x - this._w / 2
    this._y = value.y - this._h
  }

  get center() {
    return {
      x: this._x + this._w / 2,
      y: this._y + this._h / 2,
    }
  }
  set center(value) {
    //onsole.log(value);

    this._x = value.x - this._w / 2
    this._y = value.y - this._h / 2
  }

  get centerx() {
    return this._x + this._w / 2
  }
  set centerx(value) {
    this._x = value - this._w / 2
  }

  get centery() {
    return this._y + this._h / 2
  }
  set centery(value) {
    this._y = value  - this._h / 2
  }

  get width() {
    return this._w
  }

  get height() {
    return this._h
  }
}
