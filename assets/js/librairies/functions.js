// Déclaration des variables globales
var canvas, gameContainer, scoreContainer, ctx;
var playerName = ''; // Variable pour stocker le nom du joueur
var scores = JSON.parse(localStorage.getItem('scores')) || []; // Chargement des scores depuis le localStorage ou initialisation avec un tableau vide

// Constantes pour la configuration du canvas et du jeu
const canvaSize = 400;
const canvaBorder = "3px solid red";
const canvaBackgroundColor = "#1d1d1d";
const canvaOpacity = 0.8;
const scoreColor = "white";
const snakeColor = "orange";
const foodColor = "green"; // Changer la couleur de la nourriture en vert
const snakeSize = 20;

// Variables pour la position et le mouvement du serpent
var blockUnit = canvaSize / snakeSize;
var snakeX = Math.trunc(Math.random() * blockUnit) * snakeSize;
var snakeY = Math.trunc(Math.random() * blockUnit) * snakeSize;
var foodX = Math.trunc(Math.random() * blockUnit) * snakeSize;
var foodY = Math.trunc(Math.random() * blockUnit) * snakeSize;
var rayonFood = snakeSize / 2;
var stepX = 0;
var stepY = 0;
var score = 0;
var snakeBody = [{ x: snakeX, y: snakeY }]; // Stocke les segments du serpent

// Objet pour le jeu Snake
export const SnackGame = {
    // Démarrage du jeu
    start: () => {
        SnackGame.createCanvas();
        SnackGame.createSnake();
        SnackGame.initMoveSnake();
        setInterval(SnackGame.updateSnakePosition, 100);
    },

    // Création du canvas
    createCanvas: () => {
        gameContainer = document.createElement('div');
        gameContainer.id = 'game-container';

        scoreContainer = document.createElement('div');
        scoreContainer.id = 'score-container';
        scoreContainer.innerHTML = 'Score = ' + score;

        canvas = document.createElement('canvas');
        canvas.width = canvaSize;
        canvas.height = canvaSize;
        canvas.style.border = canvaBorder;
        canvas.style.backgroundColor = canvaBackgroundColor;
        canvas.style.opacity = canvaOpacity;

        scoreContainer.style.color = scoreColor;
        scoreContainer.style.fontSize = "20px";
        scoreContainer.style.zIndex = 1000;
        scoreContainer.style.position = "fixed";

        gameContainer.style.display = "flex";
        gameContainer.style.justifyContent = "center";
        gameContainer.style.alignItems = "center";

        console.log('canvas created');

        ctx = canvas.getContext('2d');
        gameContainer.appendChild(scoreContainer);
        gameContainer.appendChild(canvas);
        document.body.appendChild(gameContainer);

        askPlayerName(); // Demander le nom du joueur
    },

    // Création du serpent
    createSnake: () => {
        ctx.fillStyle = snakeColor;
        ctx.clearRect(0, 0, canvaSize, canvaSize);
        // Dessiner chaque segment du serpent
        for (let i = 0; i < snakeBody.length; i++) {
            ctx.fillRect(snakeBody[i].x, snakeBody[i].y, snakeSize, snakeSize);
        }
        SnackGame.createFood();
    },

    // Création de la nourriture
    createFood: () => {
        ctx.beginPath();
        ctx.arc(foodX + rayonFood, foodY + rayonFood, rayonFood, 0, 2 * Math.PI);
        ctx.fillStyle = foodColor; // Utiliser la couleur verte pour la nourriture
        ctx.fill();
        ctx.closePath();
    },

    // Mise à jour de la position du serpent
    updateSnakePosition: () => {
        // Calculer la nouvelle position de la tête du serpent
        let newSnakeX = snakeBody[0].x + stepX * snakeSize;
        let newSnakeY = snakeBody[0].y + stepY * snakeSize;

        // Vérifier si la nouvelle position est à l'intérieur des limites du canvas
        if (newSnakeX < 0 || newSnakeY < 0 || newSnakeX >= canvaSize || newSnakeY >= canvaSize) {
            // Si le serpent est sorti du canvas, afficher le message "Game over" et réinitialiser le jeu
            SnackGame.resetGame();
            return;
        }

        // Mettre à jour la position du serpent
        snakeBody.unshift({ x: newSnakeX, y: newSnakeY });

        // Vérifier si le serpent mange la nourriture
        if (newSnakeX === foodX && newSnakeY === foodY) {
            // Augmenter le score
            score++;
            scoreContainer.innerHTML = 'Score = ' + score;
            // Générer une nouvelle position pour la nourriture
            foodX = Math.trunc(Math.random() * blockUnit) * snakeSize;
            foodY = Math.trunc(Math.random() * blockUnit) * snakeSize;
        } else {
            // Si le serpent ne mange pas la nourriture, retirer le dernier segment
            snakeBody.pop();
        }

        // Dessiner le serpent à sa nouvelle position
        SnackGame.createSnake();
    },

    // Réinitialisation du jeu
    resetGame: () => {
        saveScore(); // Sauvegarder le score avant de réinitialiser le jeu
        alert('Game over');
        displayScores(); // Afficher le classement
        // Réinitialiser la position du serpent et de la nourriture
        snakeX = Math.trunc(Math.random() * blockUnit) * snakeSize;
        snakeY = Math.trunc(Math.random() * blockUnit) * snakeSize;
        foodX = Math.trunc(Math.random() * blockUnit) * snakeSize;
        foodY = Math.trunc(Math.random() * blockUnit) * snakeSize;
        snakeBody = [{ x: snakeX, y: snakeY }];
        stepX = 0;
        stepY = 0;
        score = 0;
        scoreContainer.innerHTML = 'Score = ' + score;
        SnackGame.createSnake();
    },

    // Initialisation des mouvements du serpent
    initMoveSnake: () => {
        document.addEventListener('keydown', (event) => {
            console.log(event.key);
            switch (event.key) {
                case 'ArrowUp':
                    stepY = -1;
                    stepX = 0;
                    break;
                case 'ArrowDown':
                    stepY = 1;
                    stepX = 0;
                    break;
                case 'ArrowLeft':
                    stepY = 0;
                    stepX = -1;
                    break;
                case 'ArrowRight':
                    stepY = 0;
                    stepX = 1;
                    break;
                case '':
                    stepX = 0;
                    stepY = 0;
                    break;
            }
        });
    }
};

// Fonction pour demander le nom du joueur
function askPlayerName() {
    // Créez un conteneur pour l'input et le bouton
    let inputContainer = document.createElement('div');
    inputContainer.id = 'input-container';
    inputContainer.style.position = 'absolute';
    inputContainer.style.top = '45%';
    inputContainer.style.left = '50%';
    inputContainer.style.transform = 'translate(-50%, -50%)';
    inputContainer.style.zIndex = '1000';
    inputContainer.style.display = 'flex';
    inputContainer.style.flexDirection = 'column';
    inputContainer.style.alignItems = 'center';

    // Créez un élément input pour le nom du joueur
    let playerNameInput = document.createElement('input');
    playerNameInput.id = 'player-name';
    playerNameInput.placeholder = 'Entrez votre nom';

    // Créez un bouton de validation
    let submitButton = document.createElement('button');
    submitButton.innerHTML = 'Valider';
    submitButton.addEventListener('click', function() {
        playerName = playerNameInput.value;
        if (!playerName) {
            playerName = 'Player'; // Valeur par défaut si le joueur ne saisit pas de nom
        }
        // Cachez l'input et le bouton après la validation
        inputContainer.style.display = 'none';
    });

    // Ajoutez l'élément input et le bouton au conteneur
    inputContainer.appendChild(playerNameInput);
    inputContainer.appendChild(submitButton);

    // Ajoutez le conteneur à la zone de jeu
    gameContainer.appendChild(inputContainer);
}

// Fonction pour sauvegarder le score
function saveScore() {
    // Recherchez un score existant pour ce joueur
    let existingScore = scores.find(entry => entry.name === playerName);

    if (existingScore) {
        // Si le nouveau score est plus élevé, mettez à jour le score existant
        if (score > existingScore.score) {
            existingScore.score = score;
        }
    } else {
        // Sinon, ajoutez le nouveau score
        scores.push({ name: playerName, score: score });
    }

    scores.sort((a, b) => b.score - a.score); // Trier les scores par ordre décroissant
    localStorage.setItem('scores', JSON.stringify(scores)); // Sauvegarder les scores dans le localStorage
}

// Fonction pour afficher le classement
function displayScores() {
    let scoreBoard = document.createElement('div');
    scoreBoard.id = 'score-board';
    scoreBoard.style.color = 'white';
    scoreBoard.style.position = 'fixed';
    scoreBoard.style.top = '10px';
    scoreBoard.style.right = '10px';
    scoreBoard.style.backgroundColor = '#333';
    scoreBoard.style.padding = '10px';
    scoreBoard.style.borderRadius = '5px';
    scoreBoard.innerHTML = '<h3>Classement</h3>';

    // Afficher les 10 meilleurs scores
    scores.slice(0, 10).forEach((entry, index) => {
        scoreBoard.innerHTML += `<p>${index + 1}. ${entry.name}: ${entry.score}</p>`;
    });

    // Supprimer l'ancien tableau des scores s'il existe
    if (document.getElementById('score-board')) {
        document.body.removeChild(document.getElementById('score-board'));
    }

    // Ajouter le nouveau tableau des scores au document
    document.body.appendChild(scoreBoard);
}
