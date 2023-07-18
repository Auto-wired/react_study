import { useState } from "react";

function Square ({ value, onSquareClick, isWinner }) {
    return <button className={ isWinner ? "win square" : "square" } onClick={ onSquareClick }>{ value }</button>;
}

function Board ({ xIsNext, squares, onPlay }) {
    function handleClick (i) {
        if (squares[i] || calculateWinner(squares)) {
            return;
        }

        const nextSquares = squares.slice();

        if (xIsNext) {
            nextSquares[i] = "X";
        } else {
            nextSquares[i] = "O";
        }

        onPlay(nextSquares);
    }

    const winnerInfo = calculateWinner(squares);

    let status;

    if (winnerInfo) {
        if (winnerInfo.winner) {
            status = `Winner: ${ winnerInfo.winner }`;
        } else {
            status = "This game is a tie";
        }
    } else {
        status = `Next players: ${ xIsNext ? "X" : "O" }`;
    }

    const board = [];

    for (let i = 0; i < 3; i++) {
        const lines = [];

        for (let j = 0; j < 3; j++) {
            const index = (i * 3) + j;

            lines.push(<Square key={ `${i}-${j}` } value={ squares[index] } onSquareClick={ () => handleClick(index) } isWinner={ winnerInfo && winnerInfo.winner && winnerInfo.lines.indexOf(index) !== -1 }></Square>);
        }

        board.push(<div key={ i } className="board-view">{ lines }</div>);
    }

    return (
        <>
            <div className="status">{ status }</div>
            <>
                { board }
            </>
        </>
    );
}

export default function Game () {
    const [history, setHistory] = useState([Array(9).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const [isAsc, setIsAsc] = useState(true);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay (nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo (nextMove) {
        setCurrentMove(nextMove);
    }

    function changeSorting () {
        setIsAsc(!isAsc);
    }

    let moves = history.map((squares, move) => {
        let description;
        let row;
        let column;

        if (move !== 0) {
            for (let i = 0; i < 9; i++) {
                if (!history[move - 1][i] && squares[i]) {
                    row = i % 3 + 1;
                    column = Math.floor(i / 3) + 1;
                }
            }
        }

        if (move !== 0 && currentMove === move) {
            description = `You are at move #${ move }, { ${ row }, ${ column } }`;
        } else if (move > 0) {
            description = `Go to move #${ move }, { ${ row }, ${ column } }`;
        } else {
            description = "Go to game start";
        }

        return (
            <li key={ move }>
                <button onClick={ () => jumpTo(move) }>{ description }</button>
            </li>
        );
    });

    if (!isAsc) {
        moves = moves.reverse();
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={ xIsNext } squares={ currentSquares } onPlay={ handlePlay }></Board>
            </div>
            <div className="game-info">
                <ol>
                    <button onClick={ changeSorting } style={{ width: 54 }}>{ isAsc ? "DESC" : "ASC" }</button>
                </ol>
                <ol>{ moves }</ol>
            </div>
        </div>
    );
}

function calculateWinner (squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    let isEmpty = false;

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                lines: lines[i],
            };
        }

        if (!squares[a] || !squares[b] || !squares[c]) {
            isEmpty = true;
        }
    }

    return isEmpty ? null : {
        winner: null,
    };
}