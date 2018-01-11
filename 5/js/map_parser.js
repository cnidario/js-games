(function(_) {
    "use strict";
    var module = {};
    // var exampleMap = [ '########',
    //                    '#####@.#',
    //                    '####.00#',
    //                    '####.0.#',
    //                    '###..#.#',
    //                    '###....#',
    //                    '##X..###',
    //                    '########'];
    //var exampleTileTypes = { '#': WALL, '.': GROUND, 'X': EXIT, PLAYER: GROUND, STONE: GROUND };
    //var exampleObjectTypes = { '@': PLAYER, '0': STONE };
    module.parse = function(rows, tileTypes, objectTypes) {
        var map = [], objects = {};
        for (var k in objectTypes) objects[objectTypes[k]] = [];
        for (var i = 0; i < rows.length; i++) {
            var scanRow = rows[i], mapRow = [];
            for (var j = 0; j < scanRow.length; j++) {
                var c = scanRow[j], obj = false;
                var obj = objectTypes[c], til;
                if(obj != undefined) {
                    objects[obj].push([i, j]);
                    til = tileTypes[obj];
                }
                else til = tileTypes[c];
                mapRow.push(til);
            }
            map.push(mapRow);
        }
        return { map: map, objects: objects };
    };

    _.mapParser = module;
})(this);
