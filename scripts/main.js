const mode = {
	PVP: "pvp",
	AI: "ai"
}

const playerFactory = (name, icon) => {
	let score = 0;
	const getIcon = () => {
		let ico = document.createElement('span');
		ico.classList.add('material-icons-outlined', 'player-ico');
		ico.textContent = icon;
		return ico;
	};
	
	const resetScore = () => {
		score = 0;
	}
	
	return { name, getIcon, score };
};

const game = (() => {
	let currentMode = mode.PVP;
	const players = [];
	
	const gameboard = (() => {
		const board = [];
		
		const playSpace = (index) => {
			
		};
		
		return {
			board,
			playSpace
		};
	})();
	
	const init = () => {
		players.push(playerFactory('','close'));
		players.push(playerFactory('','radio_button_unchecked'));
	};
	
	const setPlayerName = (id, name) => {
		players[id].name = name;
	};
	
	const play = () => {
		
	};
	
	return {
		currentMode,
		players,
		gameboard,
		play,
		init,
		setPlayerName
	};
})();



const util = (() => {
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
			document.querySelector('#aiModeBtn').classList.remove('btn-info');
			document.querySelector('#aiModeBtn').classList.add('btn-outline-info');
			game.currentMode = mode.PVP;
			toggleVis(document.querySelector('#pvpOptions'));
			toggleVis(document.querySelector('#aiOptions'));
		} else if (e.target.id === 'aiModeBtn') {
			e.target.classList.add('btn-info');
			e.target.classList.remove('btn-outline-info');
			document.querySelector('#pvpModeBtn').classList.remove('btn-info');
			document.querySelector('#pvpModeBtn').classList.add('btn-outline-info');
			game.currentMode = mode.AI;
			toggleVis(document.querySelector('#pvpOptions'));
			toggleVis(document.querySelector('#aiOptions'));
		}
	};
	
	const initScoreboard = () => {
		document.querySelector('#player1Name').textContent = game.players[0].name;
		document.querySelector('#player2Name').textContent = game.players[1].name;
		document.querySelector('#player1Score').textContent = game.players[0].score;
		document.querySelector('#player2Score').textContent = game.players[1].score;
	};
	
	return {
		toggleVis,
		toggleMode
	};
})();


window.addEventListener('DOMContentLoaded', () => {
	game.init();
	
	document.querySelector('#pvpModeBtn').addEventListener('click', util.toggleMode);
	document.querySelector('#aiModeBtn').addEventListener('click', util.toggleMode);
	document.querySelector('#resetBtn').addEventListener('click', () => {
	
	});
	document.querySelector('#restartBtn').addEventListener('click', () => {
		
	});
});
