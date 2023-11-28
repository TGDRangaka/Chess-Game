let board = [
    ['br1', 'bn1', 'bb1', 'bq', 'bk', 'bb1', 'bn1', 'br1'],
    ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8'],
    ['wr1', 'wn1', 'wb1', 'wq', 'wk', 'wb2', 'wn2', 'wr2']
];
// let board = [
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.']
// ];
let isWhiteTurn = true;

function setBoardDefaultColors(){
    let color_1 = '#D18B47',
        color_2 = '#FFBDA1';

    for(let i = 0; i < 64; i++){
        if(i % 8 == 0){
            let tempColor = color_2;
            color_2 = color_1;
            color_1 = tempColor;
        }

        $('.square').eq(i++).css('backgroundColor', color_1);
        $('.square').eq(i).css('backgroundColor', color_2);
    }
}
setBoardDefaultColors();

function getClickedIndex(i){
    let a = i / 8,
        b = i % 8;

    return [Number.parseInt(a), b];
}
function getElementIndex(ar){
    return (ar[0] * 8) + ar[1];
}

// set actions to the squares
for(let i = 0; i < 64; i++){
    $('.square').eq(i).on('click', function(){
        $('.square').css('boxShadow', 'none');
        // todo
        let index = getClickedIndex(i);
        let piece = board[index[0]][index[1]];
        if(piece == '.'){
            return;
        }

        if(isWhiteTurn){
            if(piece.charAt(0) == 'b') return;
            console.log('white');

            let moves = getValidMoves(index, piece);
            if(moves.length == 0) return;
            showAvailableMoves(moves);
            console.log(moves);

            isWhiteTurn = false;

        }else{
            if(piece.charAt(0) == 'w') return;
            console.log('black');

            let moves = getValidMoves(index, piece);
            if(moves.length == 0) return;
            showAvailableMoves(moves);
            console.log(moves);

            isWhiteTurn = true;
        }

    });
}

function getValidMoves(index, piece){
    let color = piece.charAt(0),
        name = piece.charAt(1),
        moves = [];

    if(name == 'p'){
        if(color ==  'w'){
            if(index[0] === 6){
                moves.push(...getForwardMoves(index, 'w', 2));
            }else{
                moves.push(...getForwardMoves(index, 'w', 1));
            }
        }else {
            if(index[0] === 1){
                moves.push(...getBackwardMoves(index, 'b', 2));
            }else{
                moves.push(...getBackwardMoves(index, 'b', 1));
            }
        }
    }else if(name == 'r'){
        moves.push(...getForwardMoves(index, color, index[0]));
        moves.push(...getBackwardMoves(index, color, 7 - index[0]));
        moves.push(...getRightMoves(index, color, 7 - index[1]));
        moves.push(...getLeftMoves(index, color, index[1]));
    }else if(name == 'n'){
        moves.push(...getKnightMoves(index, color));
    }else if(name == 'b'){
        moves.push(...getForwardRightMoves(index, color));
        moves.push(...getForwardLeftMoves(index, color));
        moves.push(...getBackwardRightMoves(index, color));
        moves.push(...getBackwardLeftMoves(index, color));
    }else if(name == 'q'){
        moves.push(...getForwardMoves(index, color, index[0]));
        moves.push(...getBackwardMoves(index, color, 7 - index[0]));
        moves.push(...getRightMoves(index, color, 7 - index[1]));
        moves.push(...getLeftMoves(index, color, index[1]));
        moves.push(...getForwardRightMoves(index, color));
        moves.push(...getForwardLeftMoves(index, color));
        moves.push(...getBackwardRightMoves(index, color));
        moves.push(...getBackwardLeftMoves(index, color));
    }

    return moves;
}

function getForwardMoves(index, color, steps){
    let moves = [],
        row = index[0],
        col = index[1];

    // special move for pawn
    if(board[row][col].charAt(1) == 'p'){
        // check targetMoves
        for(let i = col - 1; i <= col + 1; i+=2){
            if(i < 0 || i > 7) continue;
            if(moveState(row - 1, i, color) == 'target'){
                moves.push([row - 1, i, 't']);
            }
        }

        
        for(let i = 0; i < steps; i++){
            --row;
            let state = moveState(row, col, color);

            if(state == 'stop' || state == 'target'){
                return moves;
            }else if(state == 'ok'){
                moves.push([row, col, 'e']);
            }
        }

        return moves;
    }

    for(let i = 0; i < steps; i++){
        --row;
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }


    // console.log(moves);
    return moves;
}

function getBackwardMoves(index, color, steps){
    let moves = [],
        row = index[0],
        col = index[1];

    // special move for pawn
    if(board[row][col].charAt(1) == 'p'){
        // check targetMoves
        for(let i = col - 1; i <= col + 1; i+=2){
            if(i < 0 || i > 7) continue;
            if(moveState(row + 1, i, color) == 'target'){
                moves.push([row + 1, i, 't']);
            }
        }

        
        for(let i = 0; i < steps; i++){
            ++row;
            let state = moveState(row, col, color);

            if(state == 'stop' || state == 'target'){
                return moves;
            }else if(state == 'ok'){
                moves.push([row, col, 'e']);
            }
        }

        return moves;
    }

    for(let i = 0; i < steps; i++){
        ++row;
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }


    // console.log(moves);
    return moves;
}

function getLeftMoves(index, color, steps){
    let moves = [],
    row = index[0],
    col = index[1];

    for(let i = 0; i < steps; i++){
        --col;
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }

    // console.log(moves);
    return moves;
}

function getRightMoves(index, color, steps){
    let moves = [],
    row = index[0],
    col = index[1];

    for(let i = 0; i < steps; i++){
        ++col;
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }

    // console.log(moves);
    return moves;
}

function getKnightMoves(index, color){
    let moves = [],
        row = index[0],
        col = index[1];

        console.log(index);

    //near row checek
    for(let i = row - 1; i <= row + 1; i+=2){
        if(i < 0 || i > 7 || col-2 < 0 || col+2 > 7) continue;
        console.log('a')

        let state = moveState(i, col-2, color);
        if(state == 'ok'){
            moves.push([i, col-2, 'e']);
        }else if(state == 'target'){
            moves.push([i, col-2, 't']);
        }

        state = moveState(i, col+2, color);
        if(state == 'ok'){
            moves.push([i, col+2, 'e']);
        }else if(state == 'target'){
            moves.push([i, col+2, 't']);
        }
    }

    //near col check
    for(let i = row - 2; i <= row + 2; i+=4){
        if(i < 0 || i > 7 || col-1 < 0 || col+1 > 7) continue;
        console.log('b')

        let state = moveState(i, col-1, color);
        if(state == 'ok'){
            moves.push([i, col-1, 'e']);
        }else if(state == 'target'){
            moves.push([i, col-1, 't']);
        }

        state = moveState(i, col+1, color);
        if(state == 'ok'){
            moves.push([i, col+1, 'e']);
        }else if(state == 'target'){
            moves.push([i, col+1, 't']);
        }
    }

    return moves;
}

function getForwardRightMoves(index, color){
    let moves = [],
        row = index[0],
        col = index[1];

    while(--row >= 0 && ++col <= 7){
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }

    return moves;
}

function getForwardLeftMoves(index, color){
    let moves = [],
        row = index[0],
        col = index[1];

    while(--row >= 0 && --col >= 0){
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }

    return moves;
}

function getBackwardRightMoves(index, color){
    let moves = [],
        row = index[0],
        col = index[1];

    while(++row <= 7 && ++col <= 7){
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }

    return moves;
}

function getBackwardLeftMoves(index, color){
    let moves = [],
        row = index[0],
        col = index[1];

    while(++row <= 7 && --col >= 0){
        let state = moveState(row, col, color);

        if(state == 'stop'){
            return moves;
        }else if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else {
            moves.push([row, col, 't']);
            return moves;
        }
    }

    return moves;
}

function moveState(row, col, color){
    if(board[row][col].charAt(0) == color){
        return 'stop';
    }else if(board[row][col] == '.'){
        return 'ok';
    }else{
        return 'target';
    }
}

function showAvailableMoves(moves){
    for(let i = 0; i < moves.length; i++){
        let move = [moves[i][0], moves[i][1]];
        let state = moves[i][2];

        if(state == 'e'){
            $('.square').eq(getElementIndex(move)).css('boxShadow', 'inset 0 0 1px 5px green');
        }else{
            $('.square').eq(getElementIndex(move)).css('boxShadow', 'inset 0 0 1px 5px red');
        }
    }
}
