let board = [
    ['br1', 'bn1', 'bb1', 'bq', 'bk', 'bb1', 'bn1', 'br1'],
    ['bp1', 'bp2', 'bp3', 'bp4', 'bp5', 'bp6', 'bp7', 'bp8'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', '.', '.', '.', '.', '.', '.', '.'],
    ['.', 'bp2', '.', '.', '.', '.', '.', '.'],
    ['wp1', 'wp2', 'wp3', 'wp4', 'wp5', 'wp6', 'wp7', 'wp8'],
    ['wr1', 'wn1', 'wb1', 'wq', 'wk', 'wb2', 'wn2', 'wr2']
];
console.log(board);
// let board = [
//     ['.', '.', '.', '.', 'bk', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', 'wr1', '.', '.', '.', '.', '.'],
//     ['wq', '.', '.', 'bk', 'wk', '.', '.', '.'],
//     ['.', '.', '.', '.', 'wp1', '.', '.', '.'],
//     ['.', '.', '.', '.', '.', '.', '.', '.'],
//     ['.', '.', '.', '.', 'wk', '.', '.', '.']
// ];
let isWhiteTurn = true;
let availableMoves = [];
let selectedPiece = null;

function setBoardDefaultColors(){
    let color_1 = 'rgba(209, 139, 71, .5)',
        color_2 = 'rgba(255, 189, 161, .5)';

    for(let i = 0; i < 64; i++){
        if(i % 8 == 0){
            let tempColor = color_2;
            color_2 = color_1;
            color_1 = tempColor;
        }

        $('.square').eq(i++).css('backgroundColor', color_1);
        $('.square').eq(i).css('backgroundColor', color_2);
    }
    $('.square').css('border', 'none');
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
        // todo
        let index = getClickedIndex(i);
        let piece = board[index[0]][index[1]];

        if(availableMoves.length > 0){
            let move = availableMoves.findIndex((i)=>{
                return getElementIndex(i) == getElementIndex(index);
            })

            if(move != -1){
                // console.log(board);
                // console.log(selectedPiece + " - " + availableMoves[move]);
                movePiece(selectedPiece, availableMoves[move]);
                moveElements(selectedPiece, availableMoves[move]);

                availableMoves = [];
                isWhiteTurn = !isWhiteTurn;
                setBoardDefaultColors();
                return;
            }
        }

        if(piece == '.'){
            return;
        }

        if(isWhiteTurn){
            setBoardDefaultColors();
            if(piece.charAt(0) == 'b') return;
            console.log('white');

            availableMoves = getValidMoves(index, piece);
            if(availableMoves.length == 0) return;
            showAvailableMoves(availableMoves);
            selectedPiece = index;
            if(showAvailableMoves.length > 0) return;

            isWhiteTurn = false;

        }else{
            setBoardDefaultColors();
            if(piece.charAt(0) == 'w') return;
            console.log('black');

            availableMoves = getValidMoves(index, piece);
            if(availableMoves.length == 0) return;
            showAvailableMoves(availableMoves);
            selectedPiece = index;
            if(showAvailableMoves.length > 0) return;

            isWhiteTurn = true;
        }

    });
}

function movePiece(piece, move){
    let state = move[2];

    if(state == 'e'){
        board[move[0]][move[1]] = board[piece[0]][piece[1]];
        board[piece[0]][piece[1]] = '.';
    }else{
        let killedPiece = board[move[0]][move[1]];
        
        board[move[0]][move[1]] = board[piece[0]][piece[1]];
        board[piece[0]][piece[1]] = '.';
    }
}

function moveElements(piece, move){
    let element = $('.square').eq(getElementIndex(piece)).html();
    let elementId = $('.square').eq(getElementIndex(piece)).attr('id');

    $('.square').eq(getElementIndex(piece)).html('');
    $('.square').eq(getElementIndex(piece)).attr('id', '');

    $('.square').eq(getElementIndex(move)).html(element);
    $('.square').eq(getElementIndex(move)).attr('id', elementId);
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
        moves.push(...getForwardRightMoves(index, color, 8));
        moves.push(...getForwardLeftMoves(index, color, 8));
        moves.push(...getBackwardRightMoves(index, color, 8));
        moves.push(...getBackwardLeftMoves(index, color, 8));
    }else if(name == 'q'){
        moves.push(...getForwardMoves(index, color, index[0]));
        moves.push(...getBackwardMoves(index, color, 7 - index[0]));
        moves.push(...getRightMoves(index, color, 7 - index[1]));
        moves.push(...getLeftMoves(index, color, index[1]));
        moves.push(...getForwardRightMoves(index, color, 8));
        moves.push(...getForwardLeftMoves(index, color, 8));
        moves.push(...getBackwardRightMoves(index, color, 8));
        moves.push(...getBackwardLeftMoves(index, color, 8));
    }else if(name == 'k'){
        moves.push(...getForwardMoves(index, color, 1));
        moves.push(...getBackwardMoves(index, color, 1));
        moves.push(...getRightMoves(index, color, 1));
        moves.push(...getLeftMoves(index, color, 1));
        moves.push(...getForwardRightMoves(index, color, 1));
        moves.push(...getForwardLeftMoves(index, color, 1));
        moves.push(...getBackwardRightMoves(index, color, 1));
        moves.push(...getBackwardLeftMoves(index, color, 1));
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
        if(row < 0) return moves;
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
        if(row > 7) return moves;
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

    const checkKnightState = (row, col, color) =>{
        let state = moveState(row, col, color);
        if(state == 'ok'){
            moves.push([row, col, 'e']);
        }else if(state == 'target'){
            moves.push([row, col, 't']);
        }
    }

    //near row checek
    for(let i = row - 1; i <= row + 1; i+=2){
        try { checkKnightState(i, col-2, color) } catch (error) {}
        try { checkKnightState(i, col+2, color) } catch (error) {}
    }
    //near col check
    for(let i = row - 2; i <= row + 2; i+=4){
        try { checkKnightState(i, col-1, color) } catch (error) {}
        try { checkKnightState(i, col+1, color) } catch (error) {}
    }

    return moves;
}

function getForwardRightMoves(index, color, steps){
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
        if(--steps <= 0) return moves;
    }

    return moves;
}

function getForwardLeftMoves(index, color, steps){
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
        if(--steps <= 0) return moves;
    }

    return moves;
}

function getBackwardRightMoves(index, color, steps){
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
        if(--steps <= 0) break;
    }

    return moves;
}

function getBackwardLeftMoves(index, color, steps){
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
        if(--steps <= 0) break;
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
            $('.square').eq(getElementIndex(move)).css('background', 'rgba(53, 255, 77, 0.5)');
            $('.square').eq(getElementIndex(move)).css('border', '1px solid white');
            // $('.square').eq(getElementIndex(move)).css('boxShadow', 'inset 0 0 1px 5px green');
        }else{
            $('.square').eq(getElementIndex(move)).css('background', 'rgba(255, 56, 56, .5)');
            $('.square').eq(getElementIndex(move)).css('border', '1px solid red');
            // $('.square').eq(getElementIndex(move)).css('boxShadow', 'inset 0 0 1px 5px red');
        }
    }
}
