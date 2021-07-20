const mode = {
	PVP: "pvp",
	AI: "ai"
}
//https://alialaa.com/blog/tic-tac-toe-js

const playerFactory = (name, icon) => {
	let score = 0;
	let isAI = false;
	const getIcon = () => {
		let ico = document.createElement('span');
		ico.classList.add('material-icons-outlined', 'player-ico');
		ico.textContent = icon;
		return ico;
	};
	
	const resetScore = () => {
		score = 0;
	}
	
	return { name, getIcon, score, resetScore, icon, isAI };
};

const game = (() => {
	var currentMode = mode.PVP;
	const players = [];
	var turnBit = 0;
	var isPlaying = false;
	var aiDifficulty = 0;
	
	const gameboard = (() => {
		const board = [];
		
		const playSpace = (index) => {
			
		};
		
		const boardInit = () => {
			for (var i = 0; i < 9; i++)
				board[i] = -1;
		};
		
		return {
			board,
			playSpace,
			boardInit
		};
	})();
	
	const init = () => {
		players.push(playerFactory('Player 1','close'));
		players.push(playerFactory('Player 2','radio_button_unchecked'));
	};
	
	const setPlayerName = (id, name) => {
		players[id].name = name;
	};
	
	const toggleMode = () => {
		if (currentMode == mode.PVP)
			currentMode = mode.AI;
		else
			currentMode = mode.PVP;
	};
	
	const play = () => {
		isPlaying = true;
		gameboard.boardInit();
		if (currentMode == mode.PVP) {
			setPlayerName(0, util.qid('player1').value || 'Player 1');
			setPlayerName(1, util.qid('player2').value || 'Player 2');
			util.initScoreboard();
		} else {
			let playerChoice = util.qid('playerSelection').checked;
			if (playerChoice) {
				setPlayerName(1, util.qid('playerName').value || 'Player');
				setPlayerName(0, 'TTT Bot');
				players[0].isAI = true;
				players[1].isAI = false;
			} else {
				setPlayerName(0, util.qid('playerName').value || 'Player');
				setPlayerName(1, 'TTT Bot');
				players[0].isAI = false;
				players[1].isAI = true;
			}
			util.initScoreboard();
			setTimeout(aiPlay, 500);
		}
		util.toggleVis(util.qid('options'));
			
		
	};
	
	const processWinner = (winner) => {
		isPlaying = false;
		if (winner === 99) {
			util.showMessage('Cat game. No one wins.',util.MESSAGE_INFO, 6000);
		} else {
			players[winner].score++;
			util.showMessage(`${players[winner].name} wins!`,util.MESSAGE_INFO, 6000);
			util.updateScoreboard();
		}
		gameboard.boardInit();
		turnBit = 0;
		setTimeout(util.clearBoard, 500);
		setTimeout(() => {isPlaying = true}, 1000);
		if (currentMode == mode.AI && players[turnBit].isAI)
			setTimeout(aiPlay, 1500);
	};
	
	const aiPlay = () => {
		if (isPlaying) {
			if (players[turnBit].isAI == true) {
				if (aiDifficulty == 0) {
					let id = Math.floor((Math.random() * 100) % 9);
					while (gameboard.board[id] != -1) {
						id = Math.floor((Math.random() * 100) % 9);
					}
					if (gameboard.board[id] == -1) {
						gameboard.board[id] = turnBit;
						util.qid(`slot_${id}`).appendChild(players[turnBit].getIcon());
						turnBit = (turnBit + 1) % 2;
						let winner = checkForWinner();
						if (winner != -1) {
							processWinner(winner);
						}
					}
				}
			}
		}
	};
	
	const checkMode = (str) => {
		if (currentMode === str)
			return true;
		return false;
	}
	
	const checkForWinner = () => {
		let winner = -1;
		let cat = true;
		for (var i = 0; i < gameboard.board.length; i++) {
			if (gameboard.board[i] === -1) {
				cat = false;
				break;
			}
		}
		
		if (checkLine(0,1,2))
			winner = gameboard.board[0];
		else if (checkLine(3,4,5))
			winner = gameboard.board[3];
		else if (checkLine(6,7,8))
			winner = gameboard.board[6];
		else if (checkLine(0,3,6))
			winner = gameboard.board[0];
		else if (checkLine(1,4,7))
			winner = gameboard.board[1];
		else if (checkLine(2,5,8))
			winner = gameboard.board[2];
		else if (checkLine(0,4,8))
			winner = gameboard.board[0];
		else if (checkLine(2,4,6))
			winner = gameboard.board[2];
		else if (cat)
			winner = 99;
		return winner;
	};
	
	const checkLine = (idx1, idx2, idx3) => {
		if (gameboard.board[idx1] == -1 || gameboard.board[idx2] == -1 || gameboard.board[idx3] == -1)
			return false;
		if (gameboard.board[idx1] == gameboard.board[idx2] && gameboard.board[idx1] == gameboard.board[idx3])
			return true;
		return false;
	};
	
	const processMove = (e) => {
		if (isPlaying) {
			if (e.target.id.startsWith('slot_')) {
				if (currentMode == mode.PVP) {
					let slot = e.target;
					let id = e.target.id.slice(5);
					if (gameboard.board[id] == -1) {
						gameboard.board[id] = turnBit;
						e.target.appendChild(players[turnBit].getIcon());
						turnBit = (turnBit + 1) % 2;
						let winner = checkForWinner();
						if (winner != -1) {
							processWinner(winner);
						}
					}
				} else {
					if (players[turnBit].isAI == false) {
						let slot = e.target;
						let id = e.target.id.slice(5);
						if (gameboard.board[id] == -1) {
							gameboard.board[id] = turnBit;
							e.target.appendChild(players[turnBit].getIcon());
							turnBit = (turnBit + 1) % 2;
							let winner = checkForWinner();
							if (winner != -1) {
								processWinner(winner);
							}
						}
						setTimeout(aiPlay, 500);
					}
				}
			}
		} else {
			util.showMessage('There is not currently a game running. If you have already filled out the options, wait for the board to reset.', util.MESSAGE_DANGER);
		}
	};
	
	const resetGame = () => {
		isPlaying = false;
		util.toggleVis(util.qid('options'));
		util.qid('playerName').value = '';
		util.qid('player1').value = '';
		util.qid('player2').value = '';
		util.qid('playerSelection').checked = false;
		restartRound();
		players[0].score = 0;
		players[1].score = 0;
		util.updateScoreboard();
	};
	
	const restartRound = () => {
		gameboard.boardInit();
		util.clearBoard();
		turnBit = 0;
		if (currentMode == mode.AI)
			setTimeout(aiPlay, 500);
	};
	
	return {
		players,
		gameboard,
		play,
		init,
		setPlayerName,
		processMove,
		restartRound,
		resetGame,
		toggleMode,
		checkMode
	};
})();


const util = (() => {
	const MESSAGE_SUCCESS = 'success';
	const MESSAGE_DANGER = 'danger';
	const MESSAGE_INFO = 'info'
	
	const toggleVis = (elem) => {
		if (elem.classList.contains('d-none')) {
			elem.classList.remove('d-none');
		} else {
			elem.classList.add('d-none');
		}
	};

	const toggleMode = (e) => {
		if (e.target.id === 'pvpModeBtn') {
			e.target.classList.add('btn-info');
			e.target.classList.remove('btn-outline-info');
			qid('aiModeBtn').classList.remove('btn-info');
			qid('aiModeBtn').classList.add('btn-outline-info');
			
			if (!game.checkMode(mode.PVP)) {
				toggleVis(document.querySelector('#pvpOptions'));
				toggleVis(document.querySelector('#aiOptions'));
				game.toggleMode();
			}
		} else if (e.target.id === 'aiModeBtn') {
			e.target.classList.add('btn-info');
			e.target.classList.remove('btn-outline-info');
			qid('pvpModeBtn').classList.remove('btn-info');
			qid('pvpModeBtn').classList.add('btn-outline-info');
			
			if (!game.checkMode(mode.AI)) {
				toggleVis(document.querySelector('#pvpOptions'));
				toggleVis(document.querySelector('#aiOptions'));
				game.toggleMode();
			}
		}
	};
	
	const initScoreboard = () => {
		qid('player1Name').textContent = game.players[0].name;
		qid('player2Name').textContent = game.players[1].name;
		qid('player1Score').textContent = game.players[0].score;
		qid('player2Score').textContent = game.players[1].score;
	};
	
	const updateScoreboard = () => {
		qid('player1Score').textContent = game.players[0].score;
		qid('player2Score').textContent = game.players[1].score;
	};
	
	const showMessage = async (str, type, timeout=3000) => {
		let alertContainer = document.querySelector('#alertContainer');
		let message = document.createElement('div');
		message['id'] = 'message';
		message.classList.add('alert', `alert-${type}`);
		message.textContent = str;
		alertContainer.appendChild(message);
		setTimeout(clearMessage, timeout);
	};
	
	const clearMessage = () => {
		let message = document.querySelector('#message');
		let alertContainer = document.querySelector('#alertContainer');
		if (message)
			alertContainer.removeChild(message);
	};
	
	const clearBoard = () => {
		qac('slot').forEach((elem) => {
			try {
				elem.textContent = '';
			} catch (err) {
				
			}
		});
	};
	
	const qid = (str) => {
		return document.querySelector(`#${str}`);
	};
	
	const qac = (str) => {
		return document.querySelectorAll(`.${str}`);
	}
	
	return {
		toggleVis,
		toggleMode,
		initScoreboard,
		showMessage,
		clearMessage,
		qid,
		MESSAGE_SUCCESS,
		MESSAGE_DANGER,
		MESSAGE_INFO,
		updateScoreboard,
		clearBoard
	};
})();


window.addEventListener('DOMContentLoaded', () => {
	game.init();
	
	util.qid('pvpModeBtn').addEventListener('click', util.toggleMode);
	util.qid('aiModeBtn').addEventListener('click', util.toggleMode);
	util.qid('resetBtn').addEventListener('click', game.resetGame);
	util.qid('restartBtn').addEventListener('click', game.restartRound);
	util.qid('boardContainer').addEventListener('click', game.processMove);
	util.qid('submitBtn').addEventListener('click', game.play);
});
