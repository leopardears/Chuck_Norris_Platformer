var Vector2 = function (x, y) {
    this.x = 0;
    this.y = 0;

    x = this.x;
    y = this.y;
}


//set------------------------------------------------------------------------
Vector2.prototype.set = function (x, y){
    var newVector = new Vector2();
    this.x = x;
    this.y = y;
}


//addition--------------------------------------------------------------------
Vector2.prototype.Add = function (otherVector) {
    var newVector = new Vector2();
    newVector.Set(this.x + otherVector.x, this.y + otherVector.y);
    return newVector;
}


//subtraction-----------------------------------------------------------------
Vector2.prototype.Subtract = function (otherVector) {
    var newVector = new Vector2();
    newVector.set(this.x - otherVector.x, this.y - otherVector.y);
    return newVector;
}


//normalize-------------------------------------------------------------------
Vector2.prototype.normalize = function () {
    this.x;
    this.y;
}


//add
Vector2.prototype.multiplyScalar = function (num) {
    var newVector = new Vector2();
    newVector.set(this.x * otherVector.x, this.y * otherVector.y);
    return newVector;
}