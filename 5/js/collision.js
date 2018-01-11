(function(_) {
    var module = {};

    //valor en intervalo?
    var between = module.between = function(x, a, b) {
        return x >= a && x <= b;
    };
    //intervalos se superponen?
    var isect = module.isect = function(a, b, c, d) {
        var ra = between(a, c, d), rb = between(b, c, d);
        if(ra && rb) return b - a;
        if(ra) return d - a;
        if(rb) return b - c;
        if(between(c, a, b)) return d - c;
        return -1;
    };
    //rectángulos se superponen?
    module.collideRectRect = function(x1, y1, w1, h1, x2, y2, w2, h2) {
        var r1 = isect(x1, x1+w1, x2, x2+w2), r2 = isect(y1, y1+h1, y2, y2+h2);
        if(r1 >= 0 && r2 >= 0) return [r1, r2];
        return false;
    };

    _.collision = module;
})(this);
