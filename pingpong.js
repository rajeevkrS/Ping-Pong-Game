(function(){

    // Getting the elements through id's using query selector
    var ball = document.querySelector('#ball');
    var rod1 = document.querySelector('#rod1');
    var rod2 = document.querySelector('#rod2');
    var rod1Score = document.querySelector('#rod1Score')
    var rod2Score = document.querySelector('#rod2Score')

    // Defining names for rods and storing the data in local storage
    const storeName = "PingPongName";
    const storeScore = "PingPongMaxScore";
    const rod1Name = "Rod 1";
    const rod2Name = "Rod 2";

    // Defining some more useful variables
    let rod1ScoreUpdate = 0
    let rod2ScoreUpdate  = 0

    let score1=0
    let score2=0

    let maximumScore,
        movement,
        rod,
        ballSpeedXAxis = 2,
        ballSpeedYAxis = 2;
    
    let started = false;

    // Storing the width and height of viewport
    let windowWidthInner = window.innerWidth,
        windowHeightInner = window.innerHeight;


    // Storing data in local storage
    (function () {
        rod = localStorage.getItem(storeName);
        maximumScore = localStorage.getItem(storeScore);
        if (rod === "null" || maximumScore === "null") {
            alert("LET'S PLAY THE GAME!!!");
            maximumScore = 0;
            rod = "Rod1"
        } 
        else {
            alert("KEY 'A' and 'S' to move Left & Right and 'Enter' to start the game.");
        }
        resetBoard(rod);
    })();



    // Resetting the game 
    function resetBoard(rodName) {

        rod1.style.left = (window.innerWidth - rod1.offsetWidth) / 2 + 'px';
        rod2.style.left = (window.innerWidth - rod2.offsetWidth) / 2 + 'px';
        ball.style.left = (windowWidthInner - ball.offsetWidth) / 2 + 'px';
        rod1ScoreUpdate = 0
        rod2ScoreUpdate = 0
        rod1Score.innerHTML = 0
        rod2Score.innerHTML = 0

        // Whoever losses the game get's the ball next time
        if (rodName === rod2Name) {
            ball.style.top = (rod1.offsetTop + rod1.offsetHeight) + 'px';
            ballSpeedYAxis = 2;
        } else if (rodName === rod1Name) {
            ball.style.top = (rod2.offsetTop - rod2.offsetHeight) + 'px';
            ballSpeedYAxis = -2;
        }

        score1 = 0;
        score2 = 0;
        started = false;

    }


    // After Winning Display Score
    function storeWin(rod, score) {
        console.log("rod name is " +rod + "Score is " + score)
        if (score > maximumScore) {
            maximumScore = score;
            localStorage.setItem(storeName, rod);
            localStorage.setItem(storeScore, maximumScore);
        }
        clearInterval(movement);
        resetBoard(rod);

        alert(rod + " wins with a score of " + (score * 1) + ". Max score is: " + 
            (maximumScore * 1));

    }


    // Adding Event Listener on pressing the key
    window.addEventListener('keypress', function (event) {
        let rodSpeed = 20;

        let rodRect = rod1.getBoundingClientRect();


        if (event.code === "KeyD" && ((rodRect.x + rodRect.width) < window.innerWidth)) {
            rod1.style.left = (rodRect.x) + rodSpeed + 'px';
            rod2.style.left = rod1.style.left;
        } else if (event.code === "KeyA" && (rodRect.x > 0)) {
            rod1.style.left = (rodRect.x) - rodSpeed + 'px';
            rod2.style.left = rod1.style.left;
        }

        // When user presses the Enter key
        if (event.code === "Enter") {

            if (!started) {
                started = true;
                let ballRect = ball.getBoundingClientRect();
                let ballX = ballRect.x;
                let ballY = ballRect.y;
                let ballDia = ballRect.width;

                let rod1Height = rod1.offsetHeight;
                let rod2Height = rod2.offsetHeight;
                let rod1Width = rod1.offsetWidth;
                let rod2Width = rod2.offsetWidth;

                movement = setInterval(function () {
                    // Moving the ball 
                    ballX += ballSpeedXAxis;
                    ballY += ballSpeedYAxis;

                    var rod1X = rod1.getBoundingClientRect().x;
                    var rod2X = rod2.getBoundingClientRect().x;

                    ball.style.left = ballX + 'px';
                    ball.style.top = ballY + 'px';


                    if ((ballX + ballDia) > windowWidthInner || ballX < 0) {
                        ballSpeedXAxis = -ballSpeedXAxis; // Reverses the direction
                    }

                    // Defining the center of the ball on display
                    let ballPos = ballX + ballDia / 2;

                    // Checking for Rod 1
                    if (ballY <= rod1Height) {
                        // Changing ball direction in the opposite direction
                        ballSpeedYAxis = -ballSpeedYAxis; 
                        score1++;
                        rod1ScoreUpdate++;
                        rod1Score.innerHTML = rod1ScoreUpdate*1;


                        // Checking if any of the rod losses
                        if ((ballPos < rod1X) || (ballPos > (rod1X + rod1Width))) {
                            storeWin(rod2Name, score1);
                        }
                    }

                    // Checking for Rod 2
                    else if ((ballY + ballDia) >= (windowHeightInner - rod2Height)) {
                        // Changing ball direction in the opposite direction
                        ballSpeedYAxis = -ballSpeedYAxis;
                        score2++;
                        rod2ScoreUpdate++;
                        rod2Score.innerHTML = rod2ScoreUpdate*1;

                        // Checking if any of the rod losses
                        if ((ballPos < rod2X) || (ballPos > (rod2X + rod2Width))) {
                            storeWin(rod1Name, score2);
                        }
                    }

                }, 10);

            }
        }

    });

})();