<!DOCTYPE html>
<html>
<head>
  <title> my HTML javascript Game</title>
  <meta charset="UTF-8">
  <style>
    html, body {
      height: 100%;
      margin: 0;
    }

    body {
      background: #5568d6;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    canvas {
      border: 1px solid white;
    }

    #score {
      color: rgb(68, 239, 49);
      font-size: 20px;
      margin-top: 10px;
    }
  </style>
</head>
<body>
  <canvas width="400" height="400" id="game"></canvas>
  <div id="score">Score: 0</div>
  <script>
    var canvas = document.getElementById('game');
    var context = canvas.getContext('2d');

    var grid = 16;
    var count = 0;
    var score = 0;

    var worm = {
      x: 160,
      y: 160,
      dx: grid,
      dy: 0,
      cells: [],
      maxCells: 4
    };

    var apple = {
      x: 320,
      y: 320
    };

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    function updateScore() {
      score++;
      document.getElementById('score').innerHTML = 'Score: ' + score;
    }

    function loop() {
      requestAnimationFrame(loop);

      if (++count < 4) {
        return;
      }

      count = 0;
      context.clearRect(0,0,canvas.width,canvas.height);

      worm.x += worm.dx;
      worm.y += worm.dy;

      if (worm.x < 0) {
        worm.x = canvas.width - grid;
      }
      else if (worm.x >= canvas.width) {
        worm.x = 0;
      }

      if (worm.y < 0) {
        worm.y = canvas.height - grid;
      }
      else if (worm.y >= canvas.height) {
        worm.y = 0;
      }

      worm.cells.unshift({x: worm.x, y: worm.y});

      if (worm.cells.length > worm.maxCells) {
        worm.cells.pop();
      }

      context.fillStyle = 'red';
      context.fillRect(apple.x, apple.y, grid-1, grid-1);

      context.fillStyle = 'green';
      worm.cells.forEach(function(cell, index) {
        context.fillRect(cell.x, cell.y, grid-1, grid-1);

        if (cell.x === apple.x && cell.y === apple.y) {
          worm.maxCells++;
          updateScore();

          apple.x = getRandomInt(0, 25) * grid;
          apple.y = getRandomInt(0, 25) * grid;
        }

        for (var i = index + 1; i < worm.cells.length; i++) {
          if (cell.x === worm.cells[i].x && cell.y === worm.cells[i].y) {
            worm.x = 160;
            worm.y = 160;
            worm.cells = [];
            worm.maxCells = 4;
            worm.dx = grid;
            worm.dy = 0;

            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;

            score = 0;
            document.getElementById('score').innerHTML = 'Score: ' + score;
          }
        }
      });
    }

    document.addEventListener('keydown', function(e) {
      if (e.which === 37 && worm.dx === 0) {
        worm.dx = -grid;
        worm.dy = 0;
      }
      else if (e.which === 38 && worm.dy === 0) {
        worm.dy = -grid;
        worm.dx = 0;
      }
      else if (e.which === 39 && worm.dx === 0) {
        worm.dx = grid;
        worm.dy = 0;
      }
      else if (e.which === 40 && worm.dy === 0) {
        worm.dy = grid;
        worm.dx = 0;
      }
    });

    requestAnimationFrame(loop);
  </script>
</body>
</html>
