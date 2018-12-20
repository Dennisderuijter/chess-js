var player = {
    light: {
        name: 'Player 1',
        color: 'l'
    },
    dark: {
        name: 'Player 2',
        color: 'd'
    }
};

var b = [];
var u = undefined;
var turn = player.light;

var selectedUnit = '';
var selectedUnitY = '';
var selectedUnitX = '';
var lastMove = {
    l: {
        x: '',
        y: '',
        unit: ''
    },
    d: {
        x: '',
        y: '',
        unit: ''
    }
};

$(document).ready(function(){
    createBoard();
    $('.board .row .cel').click(function() {
        var selectedCel = $(this).attr('class').match(/[\w-]*_[\w-]*/g)[0].split("_").pop();
        var selectedRow = $(this).parent().attr('class').match(/[\w-]*_[\w-]*/g)[0].split("_").pop();
        if (b[selectedRow][selectedCel].slice(-1) == turn.color) {
            $('.board').find('.selected').removeClass('selected');
            $('.board').find('.move').removeClass('move');
            $('.board').find('.strike').removeClass('strike');

            selectedUnit = b[selectedRow][selectedCel];
            selectedUnitY = selectedRow;
            selectedUnitX = selectedCel;

            $(this).addClass('selected');
            checkMoves(parseInt(selectedRow), parseInt(selectedCel));
        } else if ($(this).hasClass('move') || $(this).hasClass('strike')) {
            move(selectedUnit, selectedUnitY, selectedUnitX, selectedRow, selectedCel);
            $('.board').find('.selected').removeClass('selected');
            $('.board').find('.move').removeClass('move');
            $('.board').find('.strike').removeClass('strike');
        } else {
            $('.board').find('.selected').removeClass('selected');
            $('.board').find('.move').removeClass('move');
            $('.board').find('.strike').removeClass('strike');
        }
    });
});

function createBoard() {
    for (var y = 0; y < 8; y++) {
        $('.board').append('<tr class="row row_' + y + '"></tr>');
        b[y] = [];

        for (var x = 0; x < 8; x++) {
            $('.board .row_' + y).append('<td class="cel cel_' + x + '"></td>');
            b[y][x] = '--';
        }
    }

    b[0] = ['rd', 'nd', 'bd', 'qd', 'kd', 'bd', 'nd', 'rd'];
    //b[1].fill('pd');
    //b[6].fill('pl');
    b[7] = ['rl', 'nl', 'bl', 'ql', 'kl', 'bl', 'nl', 'rl'];

    checkBoard();
    draw();
}

function draw() {
    for (var y = 0; y < b.length; y++) {
        for (var x = 0; x < b[y].length; x++) {
            if (b[y][x] != '--') {
                $('.board .row_' + y + ' .cel_' + x).css( 'background-image', 'url(images/Chess_' + b[y][x] + 't60.png)' );
            } else {
                $('.board .row_' + y + ' .cel_' + x).css( 'background-image', 'none' );
            }
        }
    }
}

function checkMoves(y, x) {
    var unit = b[y][x].slice(0, -1);
    var unitColor = b[y][x].slice(1);
    switch (unit) {
        case 'p': // PAWN
            var pawn = [];
            var strike = [];
            switch (unitColor) {
                case 'l':
                    if (b[y-1] !== undefined && b[y-1][x] !== undefined && b[y-1][x] == '--') {
                        var pawnY = y-1;
                        pawn.push('b[' + pawnY + '][' + x + ']');
                        if (b[y-2] !== undefined && b[y-2][x] !== undefined && y == 6) {
                            pawnY = y-2;
                            pawn.push('b[' + pawnY + '][' + x + ']');
                        }
                    }
                    if (b[y-1] !== undefined && b[y-1][x+1] !== undefined && b[y-1][x+1].substr(1, 1) == 'd') {
                        var pawnY = y-1;
                        var pawnX = x+1;
                        strike.push('b[' + pawnY + '][' + pawnX + ']');
                    }
                    if (b[y-1] !== undefined && b[y-1][x-1] !== undefined && b[y-1][x-1].substr(1, 1) == 'd') {
                        var pawnY = y-1;
                        var pawnX = x-1;
                        strike.push('b[' + pawnY + '][' + pawnX + ']');
                    }
                    break;
                case 'd':
                    if (b[y+1] !== undefined && b[y+1][x] !== undefined && b[y+1][x] == '--') {
                        var pawnY = y+1;
                        pawn.push('b[' + pawnY + '][' + x + ']');
                        if (b[y+2] !== undefined && b[y+2][x] !== undefined && y == 1) {
                            pawnY = y+2;
                            pawn.push('b[' + pawnY + '][' + x + ']');
                        }
                    }
                    if (b[y+1] !== undefined && b[y+1][x+1] !== undefined && b[y+1][x+1].substr(1, 1) == 'l') {
                        var pawnY = y+1;
                        var pawnX = x+1;
                        strike.push('b[' + pawnY + '][' + pawnX + ']');
                    }
                    if (b[y+1] !== undefined && b[y+1][x-1] !== undefined && b[y+1][x-1].substr(1, 1) == 'l') {
                        var pawnY = y+1;
                        var pawnX = x-1;
                        strike.push('b[' + pawnY + '][' + pawnX + ']');
                    }
                    break;
            }
            for (var i = 0; i < pawn.length; i++) {
                var py = pawn[i].substr(2, 1);
                var px = pawn[i].substr(5, 1);
                if (b[py][px] == '--') {
                    addMove(py, px);
                }
            }
            for (var i = 0; i < strike.length; i++) {
                var sy = strike[i].substr(2, 1);
                var sx = strike[i].substr(5, 1);
                if (b[sy][sx].substr(1, 1) == 'd' && unitColor == 'l' || b[sy][sx].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(sy, sx);
                }
            }
            break;
        case 'k': // KING
            var king = [];
            var moves = [
                {y: y-1, x: x},
                {y: y-1, x: x+1},
                {y: y,   x: x+1},
                {y: y+1, x: x+1},
                {y: y+1, x: x},
                {y: y+1, x: x-1},
                {y: y,   x: x-1},
                {y: y-1, x: x-1}
            ];
            allMoves(y, x, moves, king);
            for (var i = 0; i < king.length; i++) {
                var ky = king[i].substr(2, 1);
                var kx = king[i].substr(5, 1);
                switch (true) {
                    case b[ky][kx] == '--':
                        addMove(ky, kx);
                        break;
                    case b[ky][kx].substr(1, 1) == 'd' && unitColor == 'l' || b[ky][kx].substr(1, 1) == 'l' && unitColor == 'd':
                        addStrike(ky, kx);
                        break;
                }
            }
            break;
        case 'q': // QUEEN
            for (var i = y - 1; i >= 0; i--) { // UP
                if (b[i][x] == '--') {
                    addMove(i, x);
                } else if (b[i][x].substr(1, 1) == 'd' && unitColor == 'l' || b[i][x].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, x);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y + 1; i < b.length; i++) { // DOWN
                if (b[i][x] == '--') {
                    addMove(i, x);
                } else if (b[i][x].substr(1, 1) == 'd' && unitColor == 'l' || b[i][x].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, x);
                    break;
                } else {
                    break;
                }
            }
            for (var i = x - 1; i >= 0; i--) { // LEFT
                if (b[y][i] == '--') {
                    addMove(y, i);
                } else if (b[y][i].substr(1, 1) == 'd' && unitColor == 'l' || b[y][i].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(y, i);
                    break;
                } else {
                    break;
                }
            }
            for (var i = x + 1; i < b[y].length; i++) { // RIGHT
                if (b[y][i] == '--') {
                    addMove(y, i);
                } else if (b[y][i].substr(1, 1) == 'd' && unitColor == 'l' || b[y][i].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(y, i);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y - 1, j = x + 1; i >= 0 && j < b.length; i--, j++) { // UP-RIGHT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x + 1; i < b.length && j < b.length; i++, j++) { // DOWN-RIGHT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x - 1; i < b.length && j >= 0; i++, j--) { // DOWN-LEFT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y - 1, j = x - 1; i >= 0 && j >= 0; i--, j--) { // UP-LEFT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            break;
        case 'r': // ROOK
            for (var i = y - 1; i >= 0; i--) { // UP
                if (b[i][x] == '--') {
                    addMove(i, x);
                } else if (b[i][x].substr(1, 1) == 'd' && unitColor == 'l' || b[i][x].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, x);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y + 1; i < b.length; i++) { // DOWN
                if (b[i][x] == '--') {
                    addMove(i, x);
                } else if (b[i][x].substr(1, 1) == 'd' && unitColor == 'l' || b[i][x].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, x);
                    break;
                } else {
                    break;
                }
            }
            for (var i = x - 1; i >= 0; i--) { // LEFT
                if (b[y][i] == '--') {
                    addMove(y, i);
                } else if (b[y][i].substr(1, 1) == 'd' && unitColor == 'l' || b[y][i].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(y, i);
                    break;
                } else {
                    break;
                }
            }
            for (var i = x + 1; i < b[y].length; i++) { // RIGHT
                if (b[y][i] == '--') {
                    addMove(y, i);
                } else if (b[y][i].substr(1, 1) == 'd' && unitColor == 'l' || b[y][i].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(y, i);
                    break;
                } else {
                    break;
                }
            }
            break;
        case 'n': // KNIGHT
            var knight = [];
            var moves = [
                {y: y-2, x: x-1},
                {y: y-2, x: x+1},
                {y: y-1, x: x-2},
                {y: y-1, x: x+2},
                {y: y+1, x: x-2},
                {y: y+1, x: x+2},
                {y: y+2, x: x-1},
                {y: y+2, x: x+1}
            ];
            allMoves(y, x, moves, knight);
            for (var i = 0; i < knight.length; i++) {
                var ny = knight[i].substr(2, 1);
                var nx = knight[i].substr(5, 1);
                switch (true) {
                    case b[ny][nx] == '--':
                        addMove(ny, nx);
                        break;
                    case b[ny][nx].substr(1, 1) == 'd' && unitColor == 'l' || b[ny][nx].substr(1, 1) == 'l' && unitColor == 'd':
                        addStrike(ny, nx);
                        break;
                }
            }
            break;
        case 'b': // BISHOP
            for (var i = y - 1, j = x + 1; i >= 0 && j < b.length; i--, j++) { // UP-RIGHT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x + 1; i < b.length && j < b.length; i++, j++) { // DOWN-RIGHT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x - 1; i < b.length && j >= 0; i++, j--) { // DOWN-LEFT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            for (var i = y - 1, j = x - 1; i >= 0 && j >= 0; i--, j--) { // UP-LEFT
                if (b[i][j] == '--') {
                    addMove(i, j);
                } else if (b[i][j].substr(1, 1) == 'd' && unitColor == 'l' || b[i][j].substr(1, 1) == 'l' && unitColor == 'd') {
                    addStrike(i, j);
                    break;
                } else {
                    break;
                }
            }
            break;
    }
}

// Knight and King
function allMoves(y, x, moves, array) {
    for (var i = 0; i < moves.length; i++) {
        if (b[moves[i].y] !== u && b[moves[i].y][moves[i].x] !== u) {
            array.push('b[' + moves[i].y + '][' + moves[i].x + ']');
        }
    }
}

function addMove(y, x) {
    $('.board .row_' + y + ' .cel_' + x).addClass('move');
}

function addStrike(y, x) {
    $('.board .row_' + y + ' .cel_' + x).addClass('strike');
}

function move(unit, unitY, unitX, y, x) {
    b[y][x] = unit;
    b[unitY][unitX] = '--';
    switch (unit.substr(1, 1)) {
        case 'l':
            lastMove.l.y = y;
            lastMove.l.x = x;
            lastMove.l.unit = unit;
            break;
        case 'd':
            lastMove.d.y = y;
            lastMove.d.x = x;
            lastMove.d.unit = unit;
            break;
    }
    swapTurn();
}

function swapTurn() {
    draw();
    checkBoard();

    if (turn == player.light) {
        turn = player.dark
        console.log('Next move ' + player.dark.name + '!');
    } else {
        turn = player.light
        console.log('Next move ' + player.light.name + '!');
    }
}

function checkBoard() {
    console.log(b);
    for (var y = 0; y < 8; y++) {
        for (var x = 0; x < 8; x++) {
            checkMoves(y, x);
        }
    }
}
