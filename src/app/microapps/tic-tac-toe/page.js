"use client";

import { Button } from "@/components/ui/button";
import { useState, useCallback, useEffect } from "react";
import { User, Users } from "@phosphor-icons/react";

export default function TicTacToePage() {
    const [gameMode, setGameMode] = useState(null); // 'single' | 'dual' | null
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isStarTurn, setIsStarTurn] = useState(true);
    const [starMoves, setStarMoves] = useState([]);
    const [circleMoves, setCircleMoves] = useState([]);
    const [gameStatus, setGameStatus] = useState(null);

    const checkWinner = useCallback((currentBoard) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (let line of lines) {
            const [a, b, c] = line;
            if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
                return currentBoard[a];
            }
        }
        return null;
    }, []);

    const handleCellClick = useCallback((index) => {
        if (board[index] || gameStatus) return;

        // In single player mode, prevent clicking during computer's turn
        if (gameMode === 'single' && !isStarTurn) return;

        processMove(index);
    }, [board, gameStatus, gameMode, isStarTurn]);

    const processMove = useCallback((index) => {
        const newBoard = [...board];
        // Determine player based on current turn
        // Note: isStarTurn will be the value at the *start* of this move
        // So if isStarTurn is true, we are placing 'star'
        const currentPlayer = isStarTurn ? 'star' : 'circle';

        // However, we need to be careful inside the callback if we use the state 'isStarTurn' directly
        // The logic inside processMove should likely rely on the passed-in index and current state values.

        newBoard[index] = currentPlayer;

        let newStarMoves = [...starMoves];
        let newCircleMoves = [...circleMoves];

        if (currentPlayer === 'star') {
            newStarMoves.push(index);
            if (newStarMoves.length > 3) {
                const oldestMove = newStarMoves.shift();
                newBoard[oldestMove] = null;
            }
        } else {
            newCircleMoves.push(index);
            if (newCircleMoves.length > 3) {
                const oldestMove = newCircleMoves.shift();
                newBoard[oldestMove] = null;
            }
        }

        setBoard(newBoard);
        setStarMoves(newStarMoves);
        setCircleMoves(newCircleMoves);

        const winner = checkWinner(newBoard);
        if (winner) {
            setGameStatus(`${winner === 'star' ? 'Star' : 'Circle'} wins!`);
        }

        setIsStarTurn((prev) => !prev);
    }, [board, starMoves, circleMoves, checkWinner, isStarTurn]);

    // Computer Logic (Minimax)
    useEffect(() => {
        if (gameMode === 'single' && !isStarTurn && !gameStatus) {
            // It's computer's turn (Circle)
            const timer = setTimeout(() => {
                const bestMove = getBestMove(board, starMoves, circleMoves);
                if (bestMove !== -1) {
                    processMove(bestMove);
                }
            }, 600); // 600ms delay for natural feel

            return () => clearTimeout(timer);
        }
    }, [isStarTurn, gameMode, gameStatus, board, starMoves, circleMoves, processMove]);

    // --- Minimax Algorithm ---

    const getBestMove = (currentBoard, currentStarMoves, currentCircleMoves) => {
        let bestScore = -Infinity;
        let move = -1;
        const availableMoves = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

        // Optimization: If center is empty, take it (heuristic for speed & strength)
        if (availableMoves.includes(4) && currentBoard[4] === null) return 4;

        for (let i of availableMoves) {
            // Simulate the move for Circle (Maximizing for Computer)
            const nextBoard = [...currentBoard];
            nextBoard[i] = 'circle';
            const nextCircleMoves = [...currentCircleMoves, i];

            // Handle FIFO removal
            if (nextCircleMoves.length > 3) {
                const removed = nextCircleMoves.shift();
                nextBoard[removed] = null;
            }

            // Check immediate win to save time
            if (checkWinner(nextBoard) === 'circle') return i;

            const score = minimax(nextBoard, 0, false, [...currentStarMoves], nextCircleMoves, -Infinity, Infinity);

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
        return move;
    };

    const minimax = (currentBoard, depth, isMaximizing, sMoves, cMoves, alpha, beta) => {
        const winner = checkWinner(currentBoard);
        if (winner === 'circle') return 10 - depth;
        if (winner === 'star') return depth - 10;
        if (depth >= 6) return 0; // Depth limit to prevent lag in infinite game

        const availableMoves = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);

        if (isMaximizing) { // Computer (Circle)
            let maxEval = -Infinity;
            for (let i of availableMoves) {
                const nextBoard = [...currentBoard];
                nextBoard[i] = 'circle';
                const nextCircleMoves = [...cMoves, i];
                if (nextCircleMoves.length > 3) {
                    const removed = nextCircleMoves.shift();
                    nextBoard[removed] = null;
                }

                const evalScore = minimax(nextBoard, depth + 1, false, [...sMoves], nextCircleMoves, alpha, beta);
                maxEval = Math.max(maxEval, evalScore);
                alpha = Math.max(alpha, evalScore);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else { // Player (Star)
            let minEval = Infinity;
            for (let i of availableMoves) {
                const nextBoard = [...currentBoard];
                nextBoard[i] = 'star';
                const nextStarMoves = [...sMoves, i];
                if (nextStarMoves.length > 3) {
                    const removed = nextStarMoves.shift();
                    nextBoard[removed] = null;
                }

                const evalScore = minimax(nextBoard, depth + 1, true, nextStarMoves, [...cMoves], alpha, beta);
                minEval = Math.min(minEval, evalScore);
                beta = Math.min(beta, evalScore);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    };


    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsStarTurn(true);
        setStarMoves([]);
        setCircleMoves([]);
        setGameStatus(null);
    };

    const handleModeSelect = (mode) => {
        setGameMode(mode);
        resetGame();
    };

    const renderCell = (index) => {
        const cellValue = board[index];
        if (!cellValue) return null;

        if (cellValue === 'star') {
            return (
                <div className="w-16 h-16 flex items-center justify-center animate-in zoom-in duration-200">
                    <svg viewBox="0 0 27 26" fill="none" className="w-full h-full">
                        <path
                            d="M13.3332 22.045L7.08385 25.3303C5.73718 26.0383 4.16385 24.8957 4.41985 23.3957L5.61318 16.4357L0.55718 11.505C-0.533487 10.4437 0.0678465 8.593 1.57318 8.37167L8.56251 7.35833L11.6865 1.025C12.3598 -0.341667 14.3052 -0.341667 14.9798 1.025L18.1038 7.35833L25.0932 8.37167C26.5985 8.59167 27.1998 10.441 26.1105 11.505L21.0532 16.4357L22.2465 23.3957C22.5025 24.8957 20.9292 26.0397 19.5825 25.3303L13.3332 22.045Z"
                            fill="url(#paint0_linear_star)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_star"
                                x1="13.3332"
                                y1="-0.000333333"
                                x2="13.3332"
                                y2="25.5463"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#FFE61C" />
                                <stop offset="1" stopColor="#FFA929" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            );
        }

        if (cellValue === 'circle') {
            return (
                <div className="w-16 h-16 flex items-center justify-center animate-in zoom-in duration-200">
                    <svg viewBox="0 0 26 26" fill="none" className="w-full h-full">
                        <path
                            d="M13 0C5.82015 0 0 5.82015 0 13C0 20.1798 5.82015 25.9999 13 25.9999C20.1798 25.9999 25.9999 20.1798 25.9999 13C25.9999 5.82015 20.1798 0 13 0ZM13 20.7499C7.61523 20.7499 5.24999 18.3847 5.24999 13C5.24999 7.61523 7.61523 5.24999 13 5.24999C18.3847 5.24999 20.7499 7.61523 20.7499 13C20.7499 18.3847 18.3847 20.7499 13 20.7499Z"
                            fill="url(#paint0_linear_circle)"
                        />
                        <defs>
                            <linearGradient
                                id="paint0_linear_circle"
                                x1="-0.698166"
                                y1="-2.01184"
                                x2="24.4851"
                                y2="25.5866"
                                gradientUnits="userSpaceOnUse"
                            >
                                <stop stopColor="#BDC9CE" />
                                <stop offset="1" stopColor="#27292C" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>
            );
        }
    };

    if (!gameMode) {
        return (
            <main className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
                <div className="flex flex-col w-full max-w-xs items-center gap-8 text-center animate-in fade-in zoom-in duration-300">
                    <h1 className="text-sm font-semibold text-white/40 uppercase mb-4">Infinite Tic-Tac-Toe</h1>
                    <div className="flex flex-col gap-4 w-full">
                        <Button
                            className="px-20 bg-zinc-800 hover:bg-zinc-700 text-white h-16 text-lg flex items-center justify-center gap-3 w-full"
                            onClick={() => handleModeSelect('single')}
                        >
                            <User size={24} weight="bold" />
                            Single Player
                        </Button>
                        <Button
                            className="bg-zinc-800 hover:bg-zinc-700 text-white h-16 text-lg flex items-center justify-center gap-3 w-full"
                            onClick={() => handleModeSelect('dual')}
                        >
                            <Users size={24} weight="bold" />
                            Two Players
                        </Button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-900 flex flex-col items-center justify-center p-4">
            <div className="flex flex-col items-center gap-8 animate-in fade-in duration-300">
                <div className="grid grid-cols-3 gap-2">
                    {Array(9).fill(null).map((_, index) => (
                        <div
                            key={index}
                            className={`w-28 h-28 bg-zinc-800 rounded-lg flex items-center justify-center transition-colors active:scale-95 duration-300
                                ${!board[index] && !gameStatus && (gameMode === 'dual' || isStarTurn) ? 'cursor-pointer hover:bg-zinc-700' : 'cursor-default'}
                                ${board[index] ? 'bg-zinc-800/50' : ''}
                            `}
                            onClick={() => handleCellClick(index)}
                        >
                            {renderCell(index)}
                        </div>
                    ))}
                </div>

                {/* Game Status */}
                <div className="text-center text-white">
                    {gameStatus ? (
                        <>
                            <p className="font-medium text-sm mb-2">{gameStatus}</p>
                            <div className="flex gap-3">
                                <Button onClick={resetGame} variant="secondary">Play Again</Button>
                                <Button onClick={() => setGameMode(null)} variant="outline" className="bg-transparent text-zinc-400 border-zinc-700 hover:bg-zinc-700 hover:text-white">Change Mode</Button>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-zinc-400 mb-2">
                                {gameMode === 'single' ? (
                                    isStarTurn ? 'Your Turn (Star ⭐)' : 'Computer Thinking...'
                                ) : (
                                    `Current Turn: ${isStarTurn ? 'Star ⭐' : 'Circle ⚪'}`
                                )}
                            </p>
                            <Button onClick={() => setGameMode(null)} className="text-zinc-500 hover:text-zinc-300 bg-transparent">
                                Change Mode
                            </Button>
                        </>
                    )}
                </div>

                {/* Rules */}
                <div className="text-center text-zinc-500 text-xs max-w-xs">
                    <p>Each player can only have 3 pieces on the board. Oldest piece disappears when placing a 4th.</p>
                </div>
            </div>
        </main>
    );
}
