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
var turn = player.light;

var selectedUnit = '';
var selectedUnitY = '';
var selectedUnitX = '';

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
    b[1].fill('pd');

    b[6].fill('pl');
    b[7] = ['rl', 'nl', 'bl', 'ql', 'kl', 'bl', 'nl', 'rl'];

    console.log(b);

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
            switch (unitColor) {
                case 'l':
                    if (b[y-1] !== undefined && b[y-1][x] !== undefined && b[y-1][x] == '--') {
                        var pawnY = y-1;
                        pawn.push('b[' + pawnY + '][' + x + ']');
                        if (b[y-2] !== undefined && b[y-2][x] !== undefined) {
                            var pawnY = y-2;
                            pawn.push('b[' + pawnY + '][' + x + ']');
                        }
                    }
                    break;
                case 'd':
                    if (b[y+1] !== undefined && b[y+1][x] !== undefined && b[y+1][x] == '--') {
                        var pawnY = y+1;
                        pawn.push('b[' + pawnY + '][' + x + ']');
                        if (b[y+2] !== undefined && b[y+2][x] !== undefined) {
                            var pawnY = y+2;
                            pawn.push('b[' + pawnY + '][' + x + ']');
                        }
                    }
                    break;
            }
            for (var i = 0; i < pawn.length; i++) {
                var py = pawn[i].substr(2, 1);
                var px = pawn[i].substr(5, 1);
                if (b[py][px] == '--') {
                    $('.board .row_' + py + ' .cel_' + px).addClass('move');
                }
            }
            break;
        case 'k': // KING
            var king = [];
            if (b[y-1] !== undefined && b[y-1][x] !== undefined) {
                var kingY = y-1;
                king.push('b[' + kingY + '][' + x + ']');
            }
            if (b[y-1] !== undefined && b[y-1][x+1] !== undefined) {
                var kingY = y-1;
                var kingX = x+1;
                king.push('b[' + kingY + '][' + kingX + ']');
            }
            if (b[y] !== undefined && b[y][x+1] !== undefined) {
                var kingX = x+1;
                king.push('b[' + y + '][' + kingX + ']');
            }
            if (b[y+1] !== undefined && b[y+1][x+1] !== undefined) {
                var kingY = y+1;
                var kingX = x+1;
                king.push('b[' + kingY + '][' + kingX + ']');
            }
            if (b[y+1] !== undefined && b[y+1][x] !== undefined) {
                var kingY = y+1;
                king.push('b[' + kingY + '][' + x + ']');
            }
            if (b[y+1] !== undefined && b[y+1][x-1] !== undefined) {
                var kingY = y+1;
                var kingX = x-1;
                king.push('b[' + kingY + '][' + kingX + ']');
            }
            if (b[y] !== undefined && b[y][x-1] !== undefined) {
                var kingX = x-1;
                king.push('b[' + y + '][' + kingX + ']');
            }
            if (b[y-1] !== undefined && b[y-1][x-1] !== undefined) {
                var kingY = y-1;
                var kingX = x-1;
                king.push('b[' + kingY + '][' + kingX + ']');
            }
            for (var i = 0; i < king.length; i++) {
                var ky = king[i].substr(2, 1);
                var kx = king[i].substr(5, 1);
                if (b[ky][kx] == '--') {
                    $('.board .row_' + ky + ' .cel_' + kx).addClass('move');
                }
            }
            break;
        case 'q': // QUEEN
            for (var i = y - 1; i >= 0; i--) { // UP
                if (b[i][x] == '--') {
                    $('.board .row_' + i + ' .cel_' + x).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y + 1; i < b.length; i++) { // DOWN
                if (b[i][x] == '--') {
                    $('.board .row_' + i + ' .cel_' + x).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = x - 1; i >= 0; i--) { // LEFT
                if (b[y][i] == '--') {
                    $('.board .row_' + y + ' .cel_' + i).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = x + 1; i < b[y].length; i++) { // RIGHT
                if (b[y][i] == '--') {
                    $('.board .row_' + y + ' .cel_' + i).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y - 1, j = x + 1; i >= 0 && j < b.length; i--, j++) { // UP-RIGHT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x + 1; i < b.length && j < b.length; i++, j++) { // DOWN-RIGHT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x - 1; i < b.length && j >= 0; i++, j--) { // DOWN-LEFT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y - 1, j = x - 1; i >= 0 && j >= 0; i--, j--) { // UP-LEFT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            break;
        case 'r': // ROOK
            for (var i = y - 1; i >= 0; i--) { // UP
                if (b[i][x] == '--') {
                    $('.board .row_' + i + ' .cel_' + x).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y + 1; i < b.length; i++) { // DOWN
                if (b[i][x] == '--') {
                    $('.board .row_' + i + ' .cel_' + x).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = x - 1; i >= 0; i--) { // LEFT
                if (b[y][i] == '--') {
                    $('.board .row_' + y + ' .cel_' + i).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = x + 1; i < b[y].length; i++) { // RIGHT
                if (b[y][i] == '--') {
                    $('.board .row_' + y + ' .cel_' + i).addClass('move');
                } else {
                    break;
                }
            }
            break;
        case 'n': // KNIGHT
            var knight = [];
            if (b[y-2] !== undefined && b[y-2][x-1] !== undefined) {
                var knightY = y-2;
                var knightX = x-1;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y-2] !== undefined && b[y-2][x+1] !== undefined) {
                var knightY = y-2;
                var knightX = x+1;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y-1] !== undefined && b[y-1][x-2] !== undefined) {
                var knightY = y-1;
                var knightX = x-2;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y-1] !== undefined && b[y-1][x+2] !== undefined) {
                var knightY = y-1;
                var knightX = x+2;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y+1] !== undefined && b[y+1][x-2] !== undefined) {
                var knightY = y+1;
                var knightX = x-2;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y+1] !== undefined && b[y+1][x+2] !== undefined) {
                var knightY = y+1;
                var knightX = x+2;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y+2] !== undefined && b[y+2][x-1] !== undefined) {
                var knightY = y+2;
                var knightX = x-1;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            if (b[y+2] !== undefined && b[y+2][x+1] !== undefined) {
                var knightY = y+2;
                var knightX = x+1;
                knight.push('b[' + knightY + '][' + knightX + ']');
            }
            for (var i = 0; i < knight.length; i++) {
                var ny = knight[i].substr(2, 1);
                var nx = knight[i].substr(5, 1);
                switch (true) {
                    case b[ny][nx] == '--':
                        $('.board .row_' + ny + ' .cel_' + nx).addClass('move');
                        break;
                    case b[ny][nx].substr(1, 1) == 'd' && unitColor == 'l':
                        $('.board .row_' + ny + ' .cel_' + nx).addClass('strike');
                        break;
                    case b[ny][nx].substr(1, 1) == 'l' && unitColor == 'd':
                        $('.board .row_' + ny + ' .cel_' + nx).addClass('strike');
                        break;
                }
            }
            break;
        case 'b': // BISHOP
            for (var i = y - 1, j = x + 1; i >= 0 && j < b.length; i--, j++) { // UP-RIGHT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x + 1; i < b.length && j < b.length; i++, j++) { // DOWN-RIGHT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y + 1, j = x - 1; i < b.length && j >= 0; i++, j--) { // DOWN-LEFT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            for (var i = y - 1, j = x - 1; i >= 0 && j >= 0; i--, j--) { // UP-LEFT
                if (b[i][j] == '--') {
                    $('.board .row_' + i + ' .cel_' + j).addClass('move');
                } else {
                    break;
                }
            }
            break;
    }

}

function move(unit, unitY, unitX, y, x) {

    b[y][x] = unit;
    b[unitY][unitX] = '--';

    swapTurn();

}

function swapTurn() {

    draw();
    console.log(b);

    if (turn == player.light) {
        turn = player.dark
        console.log('Next move ' + player.dark.name + '!');
    } else {
        turn = player.light
        console.log('Next move ' + player.light.name + '!');
    }

}
