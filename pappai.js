(function(export) {
    var extend = function(_super, init) {
        init.prototype = _super;
        init._super = _super;
        return new init();
    }

    var CNode = function(paper) {
        this.PAPER = paper || document.getElementById("pappai");
        this.PAINT = this.PAPER.getContext("2d");
        this.x = 0;
        this.y = 0;
        this.xx = 0;
        this.yy = 0;
        this.fcolor = "#000";
        this.bcolor = "#fff";
        this.scolor = "#000";
    };

    CNode.prototype = {
        give: function(k, v) {
            this[k] = v;
            return this;
        },
        flag: function(opts) {
            var self = this;
            Object.keys(opts).forEach(function(k) {
                self[k] = opts[k];
            });
            return self;
        },
        get: function(k) {
            return this[k];
        },
        mid: function(x, y) {
            return [x, y];
        },
        set: function(x, y) {
            this.x = x;
            this.y = y;
            var xy = this.mid(x, y);
            this.xx = xy[0];
            this.yy = xy[1];
            return this;
        },
        fg: function(color) {
            this.fcolor = color || this.fcolor;
            return this;
        },
        bg: function(color) {
            this.bcolor = color || this.bcolor;
            return this;
        },
        sg: function(color) {
            this.scolor = color || this.scolor;
            return this;
        },
        line: function(xa, ya, xb, yb) {
            this.PAINT.beginPath()
            this.PAINT.moveTo(xa, ya);
            this.PAINT.lineTo(xb, yb);
            this.PAINT.closePath();
            this.PAINT.lineWidth = this.size != null ? this.size : 1;
            this.PAINT.strokeStyle = this.scolor;
            this.PAINT.stroke();
        },
        link: function(node) {
            if (node instanceof CNode) {
                this.line(this.xx, this.yy, node.xx, node.yy);
            }
            return this;
        }
    };

    var CCircle = extend(CNode, function(Pappai, radius) {
        this.give("radius", radius);
        this.give("pi", Math.PI);
        this.give("tau", 2 * Math.PI);
        return this._super;
    });

    CCircle.prototype.mid = function(x, y) {
        return [x, y];
    }

    CCircle.prototype.render = function() {
        this.PAPER.style.backgroundColor = this.bcolor;
        this.PAINT.fillStyle = this.fcolor;
        this.PAINT.strokeStyle = this.scolor;
        this.PAINT.lineWidth = this.size != null ? this.size : 1;
        this.PAINT.beginPath();
        this.PAINT.arc(this.x, this.y, this.radius, 0, this.tau);
        this.PAINT.closePath();
        if (!this.noFill) {
            this.PAINT.fill();
        }
        if (this.doStroke) {
            this.PAINT.stroke();
        }
        return this;
    };

    var CBox = extend(CNode, function(Pappai, width, height) {
        this.give("width", width);
        this.give("height", height);
        return this._super;
    });

    CBox.prototype.mid = function(x, y) {
        return [
            x + (this.width / 2),
            y + (this.height / 2)
        ];
    };

    CBox.prototype.render = function() {
        this.PAPER.style.backgroundColor = this.bcolor;
        this.PAINT.fillStyle = this.fcolor;
        this.PAINT.strokeStyle = this.scolor;
        this.PAINT.lineWidth = this.size != null ? this.size : 1;
        this.PAINT.beginPath();
        this.PAINT.rect(this.x, this.y, this.width, this.height);
        this.PAINT.closePath();
        if (!this.noFill) {
            this.PAINT.fill();
        }
        if (this.doStroke) {
            this.PAINT.stroke();
        }
        return this;
    }

    var CSquare = extend(CNode, function(Pappai, side) {
        this.give("side", side);
        return this._super;
    });

    CSquare.prototype.mid = function(x, y) {
        return [
            x + (this.side / 2),
            y + (this.side / 2)
        ]
    }

    CSquare.prototype.render = function() {
        this.PAPER.style.backgroundColor = this.bcolor;
        this.PAINT.fillStyle = this.fcolor;
        this.PAINT.strokeStyle = this.scolor;
        this.PAINT.lineWidth = this.size != null ? this.size : 1;
        this.PAINT.beginPath();
        this.PAINT.rect(this.x, this.y, this.side, this.side);
        this.PAINT.closePath();
        if (!this.noFill) {
            this.PAINT.fill();
        }
        if (this.doStroke) {
            this.PAINT.stroke();
        }
        return this;
    }

    var Pappai = {
        Init: function(width, height, theater) {
            var canvas = document.createElement("canvas"),
                self = this;
            canvas.id = "pappai";
            document.body.appendChild(canvas);
            if (theater) {
                var html = document.querySelector("html");
                html.style.margin = 0;
                html.style.padding = 0;
                var body = document.querySelector("body");
                body.style.margin = 0;
                body.style.padding = 0;
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                canvas.style.display = "block";
            } else {
                canvas.width = width;
                canvas.height = height;
                var xm = (window.innerHeight - height) / 2,
                    ym = (window.innerWidth - width) / 2;
                canvas.style.margin = xm + "px " + ym "px";
                canvas.style.display = "block";
            }
            return (function(ctx) {
                ctx.width = ctx.canvas.width;
                ctx.height = ctx.canvas.height;
                ctx.clear = function() {
                    self.clearRect(0, 0, self.width, self.height);
                }
                return ctx;
            })(canvas.getContext("2d"));
        },
        Node: function() {
            return new CNode();
        },
        Circle: function(radius) {
            return new CCircle(this, radius);
        },
        Box: function(width, height) {
            return new CBox(this, width, height);
        },
        Square: function(side) {
            return new CSquare(this, side);
        }
    };

    export.Pappai = Pappai;
})(window);