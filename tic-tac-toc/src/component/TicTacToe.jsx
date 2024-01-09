import Board from "./Board";
import { useEffect, useState } from "react";
import GameOver from "./GameOver";
import GameState from "./GameState";
import Reset from "./Reset";
import gameOverSoundAsset from '../sounds/game_over.wav';
import clickSoundAsset from '../sounds/click.wav';

const gameOverSound=new Audio(gameOverSoundAsset);
gameOverSound.volume=0.2;
const clickSound=new Audio(clickSoundAsset);
clickSound.volume=0.9;

const Player_x = "X";
const Player_O = "O";

const winningCombinations = [
    //Rows
    { combo: [0, 1, 2], strikeClass: "strike-row-1" },
    { combo: [3, 4, 5], strikeClass: "strike-row-2" },
    { combo: [6, 7, 8], strikeClass: "strike-row-3" },

    //columns
    { combo: [0, 3, 6], strikeClass: "strike-column-1" },
    { combo: [1, 4, 7], strikeClass: "strike-column-2" },
    { combo: [2, 5, 8], strikeClass: "strike-column-3" },

    //diagonals
    { combo: [0, 4, 8], strikeClass: "strike-diagonal-1" },
    { combo: [2, 4, 6], strikeClass: "strike-diagonal-2" },

];

function checkWinner(tiles, setStrikeClass, setGameState) {
    for (const { combo, strikeClass } of winningCombinations) {
        const tileValue1 = tiles[combo[0]];
        const tileValue2 = tiles[combo[1]];
        const tileValue3 = tiles[combo[2]];

        if (tileValue1 !== null && tileValue1 === tileValue2 && tileValue2 === tileValue3) {
            setStrikeClass(strikeClass);
            // console.log("Combo:", combo);
            // console.log("Strike Class:", strikeClass);
            // console.log("Tile Values:", tileValue1, tileValue2, tileValue3);

            if (tileValue1 === Player_x) {
                setGameState(GameState.playerXWins)
            }
            else {
                setGameState(GameState.playerOWins)
            }
            return;
        }

    }

    const areAllTilesFilledIn = tiles.every((tile) => tile !== null);
    if (areAllTilesFilledIn) {
        setGameState(GameState.draw);
    }
}

function TicTacToe() {
    const [tiles, setTiles] = useState(Array(9).fill(null));
    const [playerTurn, setPlayerTurn] = useState(Player_x);
    const [strikeClass, setStrikeClass] = useState();
    const [gameState, setGameState] = useState(GameState.inProgress);

    const handleTileClick = (index) => {

        if (gameState !== GameState.inProgress) {
            return;
        }

        if (tiles[index] !== null) {
            return;
        }

        const newTiles = [...tiles];
        newTiles[index] = playerTurn;
        setTiles(newTiles);

        if (playerTurn === Player_x) {
            setPlayerTurn(Player_O);
        }
        else {
            setPlayerTurn(Player_x);
        }
    };

    const handleReset = ()=>{
        setGameState(GameState.inProgress);
        setTiles(Array(9).fill(null));
        if(playerTurn === Player_x){
            setPlayerTurn(Player_x);
        }
        else{
            setPlayerTurn(Player_O);
        }
        setStrikeClass(null);
    };

    useEffect(() => {
        checkWinner(tiles, setStrikeClass, setGameState);
    }, [tiles]);

    useEffect(()=>{
        if(tiles.some((tile)=> tile !== null)){
            clickSound.play();
        }
    },[tiles]);

    useEffect(()=>{
        if(gameState !== GameState.inProgress){
            gameOverSound.play();
        }
    },[gameState]);

    return (
        <div>
            <h1>Tic Tac Toe</h1>
            <Board strikeClass={strikeClass} playerTurn={playerTurn} tiles={tiles} onTileClick={handleTileClick} />
            <GameOver gameState={gameState} />
            <Reset gameState={gameState} onReset={handleReset}/>
        </div>
    );
}

export default TicTacToe;
