(function(_) {
    module = {};
    module.KEY_ENTER = false;
    module.KEY_SHIFT = false;
    module.KEY_ESC = false;
    module.KEY_SPACE = false;
    module.KEY_LEFT = false;
    module.KEY_UP = false;
    module.KEY_RIGHT = false;
    module.KEY_DOWN = false;
    module.KEY_Z = false;
    module.KEY_X = false;
    module.KEY_C = false;
    module.KEY_A = false; 
    module.KEY_W = false;
    module.KEY_D = false;
    module.KEY_S = false;
    document.addEventListener('keydown', function(event) {
        switch(event.keyCode) {
            case 13: module.KEY_ENTER = true; break;
            case 16: module.KEY_SHIFT = true; break;
            case 27: module.KEY_ESC = true; break;
            case 32: module.KEY_SPACE = true; break;
            case 37: module.KEY_LEFT = true; break;
            case 38: module.KEY_UP = true; break;
            case 39: module.KEY_RIGHT = true; break;
            case 40: module.KEY_DOWN = true; break;
            case 90: module.KEY_Z = true; break;
            case 88: module.KEY_X = true; break;
            case 67: module.KEY_C = true; break;
            case 65: module.KEY_A = true;  break;
            case 87: module.KEY_W = true; break;
            case 68: module.KEY_D = true; break;
            case 83: module.KEY_S = true; break;
        }
    });
    document.addEventListener('keyup', function(event) {
        switch(event.keyCode) {
          case 13: module.KEY_ENTER = false; break;
          case 16: module.KEY_SHIFT = false; break;
          case 27: module.KEY_ESC = false; break;
          case 32: module.KEY_SPACE = false; break;
          case 37: module.KEY_LEFT = false; break;
          case 38: module.KEY_UP = false; break;
          case 39: module.KEY_RIGHT = false; break;
          case 40: module.KEY_DOWN = false; break;
          case 90: module.KEY_Z = false; break;
          case 88: module.KEY_X = false; break;
          case 67: module.KEY_C = false; break;
          case 65: module.KEY_A = false;  break;
          case 87: module.KEY_W = false; break;
          case 68: module.KEY_D = false; break;
          case 83: module.KEY_S = false; break;
        }
    });
    _.input = module;
})(this);
