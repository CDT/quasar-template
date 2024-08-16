<template>
  <q-page class="flex flex-center">
    <div class="column items-center">
      <h1 class="text-h3 q-mb-md">来把井字棋</h1>
      <div class="tic-tac-toe-board">
        <q-btn
          v-for="(cell, index) in board"
          :key="index"
          :label="cell"
          class="tic-tac-toe-cell"
          :disable="cell !== '' || gameOver"
          @click="makeMove(index)"
          size="lg"
          color="primary"
          text-color="white"
        />
      </div>
      <div class="q-mt-md">
        <p v-if="gameOver" class="text-h5">
          {{ winner ? (winner === 'X' ? '你赢了！' : '电脑赢了！') : "平局" }}
        </p>
        <p v-else class="text-h5">{{ currentPlayer === 'X' ? '该你了' : '电脑正在思考...' }}</p>
      </div>
      <q-btn
        @click="resetGame"
        color="secondary"
        label="重来"
        class="q-mt-md"
      />
    </div>
  </q-page>
</template>

<script>
import { ref, computed, watch } from 'vue';

export default {
  name: 'TicTacToePage',
  setup() {
    const board = ref(Array(9).fill(''));
    const currentPlayer = ref('X');
    const gameOver = ref(false);
    const winner = ref(null);

    const winningCombos = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    const checkWinner = (board) => {
      for (const combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
          return board[a];
        }
      }
      return null;
    };

    const isDraw = computed(() => {
      return board.value.every(cell => cell !== '') && !winner.value;
    });

    const makeMove = (index) => {
      if (board.value[index] === '' && !gameOver.value && currentPlayer.value === 'X') {
        board.value[index] = 'X';
        checkGameState();
        if (!gameOver.value) {
          currentPlayer.value = 'O';
          setTimeout(aiMove, 500); // Delay AI move for better UX
        }
      }
    };

    const checkGameState = () => {
      winner.value = checkWinner(board.value);
      if (winner.value || isDraw.value) {
        gameOver.value = true;
      }
    };

    const aiMove = () => {
      if (!gameOver.value) {
        const bestMove = findBestMove(board.value);
        board.value[bestMove] = 'O';
        checkGameState();
        currentPlayer.value = 'X';
      }
    };

    const findBestMove = (board) => {
      let bestScore = -Infinity;
      let bestMove;
      for (let i = 0; i < 9; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          let score = minimax(board, 0, false);
          board[i] = '';
          if (score > bestScore) {
            bestScore = score;
            bestMove = i;
          }
        }
      }
      return bestMove;
    };

    const minimax = (board, depth, isMaximizing) => {
      const result = checkWinner(board);
      if (result) {
        return result === 'O' ? 10 - depth : depth - 10;
      }
      if (board.every(cell => cell !== '')) {
        return 0;
      }

      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, depth + 1, false);
            board[i] = '';
            bestScore = Math.max(score, bestScore);
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
          if (board[i] === '') {
            board[i] = 'X';
            let score = minimax(board, depth + 1, true);
            board[i] = '';
            bestScore = Math.min(score, bestScore);
          }
        }
        return bestScore;
      }
    };

    const resetGame = () => {
      board.value = Array(9).fill('');
      currentPlayer.value = 'X';
      gameOver.value = false;
      winner.value = null;
    };

    return {
      board,
      currentPlayer,
      gameOver,
      winner,
      makeMove,
      resetGame,
    };
  },
};
</script>

<style scoped>
.tic-tac-toe-board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  width: 300px;
}

.tic-tac-toe-cell {
  height: 100px;
  font-size: 2rem;
  font-weight: bold;
}
</style>