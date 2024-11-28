document.addEventListener("DOMContentLoaded", function () {

    var resultsBody = document.getElementById("results-body");
    var lastPlayerBody = document.getElementById("last-player-body");

    var results = JSON.parse(localStorage.getItem("snakeGameResults")) || [];

    results.sort(function (a, b) {
        return b.score - a.score;
    });

    results = results.slice(0, 5);

    results.forEach(function (result) {
        var row = document.createElement("tr");
        var playerNameCell = document.createElement("td");
        var scoreCell = document.createElement("td");

        playerNameCell.textContent = result.name;
        scoreCell.textContent = result.score;

        row.appendChild(playerNameCell);
        row.appendChild(scoreCell);

        resultsBody.appendChild(row);
    });

    var lastPlayer = JSON.parse(localStorage.getItem("lastPlayer"));
    
    if (lastPlayer) {
        row = document.createElement("tr");
        playerNameCell = document.createElement("td");
        scoreCell = document.createElement("td");

        playerNameCell.textContent = lastPlayer.name;
        scoreCell.textContent = lastPlayer.score;

        row.appendChild(playerNameCell);
        row.appendChild(scoreCell);

        lastPlayerBody.appendChild(row);
    }
    
    var backButton = document.getElementById("back-button");
    backButton.addEventListener("click", function () {
        window.location.href = "zmijica-uputstvo.html";
    });

});





