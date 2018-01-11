(function(_) {
    var module = {};

    var add = module.add = function(v, w) {
        return [v[0] + w[0], v[1] + w[1]];
    };
    var scl = module.scl = function(scl, v) {
        return [scl*v[0], scl*v[1]];
    };
    module.addscl = function(v, scale, w) {
        return add(v, scl(scale, w));
    };
    module.outOfBounds = function(v, min, sz) {
        return v[0] >= min[0] + sz[0] ||
               v[0] <= min[0] ||
               v[1] <= min[1] ||
               v[1] >= min[1] + sz[1];
    };
    _.vector = module;
})(this);
