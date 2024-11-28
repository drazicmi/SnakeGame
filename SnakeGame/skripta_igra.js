$(document).ready(function () {
    var boardWidth;
    var boardHeight;

    var snake = [{ x: 5, y: 5 }];
    var direction = "right";

    var food = { x: 5, y: 5 };

    var superFood = { x: -1, y: -1 };
    var superFoodActive = false;

    var score = 0;

    var $gameBoard = $("#game-board");

    function generateBoard(width, height) {
        $gameBoard.empty();

        boardHeight = height;
        boardWidth = width;

        $gameBoard.css("--size", width);

        for (var y = 0; y < boardHeight; y++) {
            for (var x = 0; x < boardWidth; x++) {
                var $cell = $("<div>").addClass("cell").attr("id", x + "-" + y);
                $gameBoard.append($cell);
            }
        }
    }

    function renderSnake() {
        $(".cell").removeClass("snake");
        snake.forEach(function (segment) {
            $("#" + segment.x + "-" + segment.y).addClass("snake");
        });
    }

    function renderFood() {
        $(".cell").removeClass("food super-food");
        $("#" + food.x + "-" + food.y).addClass("food");
        if (superFoodActive) {
            $("#" + superFood.x + "-" + superFood.y).addClass("super-food");
        }
    }

    $(document).keydown(function (e) {
        // The preventDefault() method of the Event interface tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be.
        e.preventDefault();
        // In the provided code, e.which refers to the numeric code of the key that was pressed during a keydown event.
        switch (e.which) {
            case 37:
                direction = "left";
                break;
            case 38:
                direction = "up";
                break;
            case 39:
                direction = "right";
                break;
            case 40:
                direction = "down";
                break;
        }
    });

    function checkFoodCollision() {
        if (snake[0].x === food.x && snake[0].y === food.y) {
            var tail = { x: snake[snake.length - 1].x, y: snake[snake.length - 1].y };
            snake.push(tail);
            score++;
            $("#score").text("Score: " + score);
            $("#" + food.x + "-" + food.y).removeClass("food");
            food = { x: -1, y: -1 }; // Set food coordinates outside the game board
            generateFood();
        } else if (superFoodActive && snake[0].x == superFood.x && snake[0].y == superFood.y) {
            score += 10;
            $("#score").text("Score: " + score);
            removeSuperFood();
        }
    }

    function generateFood() {
        var occupiedPositions = [...snake.map(segment => segment.x + "-" + segment.y)];

        if (superFoodActive) {
            occupiedPositions.push(superFood.x + "-" + superFood.y);
        }

        do {
            food.x = Math.floor(Math.random() * boardWidth);
            food.y = Math.floor(Math.random() * boardHeight);
            var foodPosition = food.x + "-" + food.y;
        } while (occupiedPositions.includes(foodPosition));

        $("#" + foodPosition).addClass("food");
    }


    function generateSuperFood() {
        if (superFoodActive) return;
        var occupiedPositions = [...snake.map(segment => segment.x + "-" + segment.y), food.x + "-" + food.y];

        do {
            superFood.x = Math.floor(Math.random() * boardWidth);
            superFood.y = Math.floor(Math.random() * boardHeight);
            superFoodPosition = superFood.x + "-" + superFood.y;
        } while (occupiedPositions.includes(superFoodPosition));

        superFoodActive = true;
        $("#" + superFoodPosition).addClass("super-food");
    }

    function removeSuperFood() {
        if (superFoodActive == false) return;
        $(".cell").removeClass("super-food");
        superFoodActive = false;
    }

    function gameLoop() {
        var head = { x: snake[0].x, y: snake[0].y };
        switch (direction) {
            case "left":
                head.x--;
                break;
            case "up":
                head.y--;
                break;
            case "right":
                head.x++;
                break;
            case "down":
                head.y++;
                break;
        }

        if (head.x < 0 || head.y < 0 || head.x >= boardWidth || head.y >= boardHeight || isSnakeCollision(head)) {
            endGame();
            return;
        }

        // Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
        snake.unshift(head);
        checkFoodCollision();

        if (snake.length > score + 1) {
            snake.pop();
        }

        renderSnake();
        renderFood();

        setTimeout(gameLoop, gameLoopDelay);
    }

    function isSnakeCollision(head) {
        for (var i = 1; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                return true;
            }
        }
        return false;
    }

    // Game loop delay time based on speed
    var gameLoopDelay;

    // Initialize the game
    function initGame() {
        var width = localStorage.getItem("boardWidth");
        var height = localStorage.getItem("boardHeight");
        var speed = localStorage.getItem("snakeSpeed");

        if (width && height) {
            generateBoard(parseInt(width), parseInt(height));
            generateFood();
            renderFood();
            calculateGameLoopDelay(speed);
            gameLoop();
            startSuperFoodTimer();
        } else {
            console.log("Board size not selected.");
        }
    }

    // Calculate delay time based on speed
    function calculateGameLoopDelay(speed) {
        switch (speed) {
            case "slow":
                gameLoopDelay = 200;
                break;
            case "medium":
                gameLoopDelay = 100;
                break;
            case "fast":
                gameLoopDelay = 50;
                break;
            default:
                gameLoopDelay = 200;
                break;
        }
    }

    var interval10Handler;

    function startSuperFoodTimer() {
        closeInterval10 = setInterval(function () {
            generateSuperFood();
            setTimeout(removeSuperFood, 3000);
        }, 10000);
    }


    function endGame() {
        clearInterval(interval10Handler);
        var playerName = prompt("Game over! Please enter your name:");
        if (playerName) {

            var previousResults = JSON.parse(localStorage.getItem("snakeGameResults")) || [];
            var result = { name: playerName, score: score };
            previousResults.push(result);

            localStorage.setItem("snakeGameResults", JSON.stringify(previousResults));
            localStorage.setItem("lastPlayer", JSON.stringify(result));

            window.location.href = "zmijica-rezultati.html";
        }
    }

    initGame();
});
