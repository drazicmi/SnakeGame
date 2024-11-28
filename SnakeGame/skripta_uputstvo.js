$(document).ready(function () {

    $("#small-board").click(function () {
        startGame(10, 10);
    });

    $("#medium-board").click(function () {
        startGame(15, 15);
    });

    $("#large-board").click(function () {
        startGame(20, 20);
    });

    $("#start-game").click(function () {
        var selectedSpeed = $("input[name='snake-speed']:checked").val();
        localStorage.setItem("snakeSpeed", selectedSpeed);
        window.location.href = "zmijica-igra.html";
    });

    $("#results-button").click(function () {
        window.location.href = "zmijica-rezultati.html";
    });

    function startGame(width, height) {
        localStorage.setItem("boardWidth", width);
        localStorage.setItem("boardHeight", height);

        $("#speed-options").show();
        $("#start-game").show();
    }
});
