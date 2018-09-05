function rotate(root, length, deg) {
    var _head = new Point(root.x, root.y - length);
    return ChibiJS.Geometry.rotate(deg, _head, root);
}

RotateArrow = function(canvas, speed, step, max_dots){
    this.canvas = canvas;
    this.layer;
    this.dots_layer;
    this.dots = [];
    this.arrow;
    this.deg = 0;
    this.length = 30;
    this.step = (step == undefined) ? 16 : step;
    this.speed = (speed == undefined) ? 20 : speed;
    this.max_dots = (max_dots == undefined) ? 30 : max_dots;
    this.isLong = false;
    this.root;
    
    return this;
}
RotateArrow.prototype.draw_stuff = function (){
    this.layer = this.canvas.addLayer("stuff");
    this.dots_layer = this.canvas.addLayer("dots");
    this.root = new Point(320 / 2, 240 / 2);
    var head = rotate(this.root, this.length, 360);
    this.arrow = this.layer.build_arrow(this.root.x, this.root.y, head.x, head.y).drawTo(this.layer, "arrow").attr({"stroke": "blue"});
    // console.writeline(root, head, arrow);
};

RotateArrow.prototype.transform = function () {
    if (this.deg >= 360){
        this.deg = 0;
    }
    this.length = (this.isLong) ? this.length - 1 : this.length + 1;
    if (this.length > 100) {
        this.isLong = true;
    }
    if (this.length < 35) {
        this.isLong = false;
    }
    var head = rotate(this.root, this.length, this.deg);
    this.arrow.attr({"path": this.layer.build_arrow(this.root.x, this.root.y, head.x, head.y).str()});
    dot = this.dots_layer.draw_circle(head.x, head.y, 3);
    this.dots.push(dot);
    // remove the last dot
    if (this.dots.length > this.max_dots) {
        this.dots_layer.remove(this.dots.shift());
    }
    var self = this;
    $.each(this.dots, function(idx, _dot){
        var opa = idx / self.max_dots;
        _dot.attr({'opacity': opa});
    });
    this.deg += this.step;
    return this.arrow;
};
