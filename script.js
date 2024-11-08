let turnCount = 0;
let putCount = 0;
let squares = [["", "", ""], ["", "", ""], ["", "", ""]];
let win = [['00', '01', '02'], ['10', '11', '12'], ['20', '21', '22'],
['00', '10', '20'], ['01', '11', '21'], ['02', '12', '22'],
['00', '11', '22'], ['02', '11', '20']];
let flag = 0;

const errorSound = new Audio('error.mp3');
const ketteiSound = new Audio('kettei_sound.mp3');
const successSound = new Audio('success.mp3');
const failureSound = new Audio('failure.mp3');

const timingDialog = document.getElementById('timing');
const timingBar = document.getElementById('timing-bar');
const timingRange = document.getElementById('timing-range');
const timingMoving = document.getElementById('timing-moving');

function randomRange(min, maxEqual) {
  return Math.floor(Math.random() * ((maxEqual + 1) - min)) + min;
}

function timing(callback) {
  timingDialog.showModal();

  const barWidth = 400;
  timingBar.style.width = `${barWidth}px`;
  const rangeWidth = randomRange(15, 30);
  timingRange.style.width = `${rangeWidth}px`;
  let rangeLeft = randomRange(0, barWidth);
  timingRange.style.left = `${rangeLeft}px`;
  const movingWidth = randomRange(5, 10);
  timingMoving.style.width = `${movingWidth}px`;
  let movingLeft = randomRange(0, barWidth);
  timingMoving.style.left = `${movingLeft}px`;

  let rangeStep = -randomRange(1, 5);
  let movingStep = randomRange(5, 10);

  const intervalId = setInterval(() => {
    if (
      rangeStep > 0
        ? (rangeLeft > barWidth - rangeWidth - rangeStep)
        : (rangeLeft < Math.abs(rangeStep))
    ) {
      rangeStep = -rangeStep;
    }

    rangeLeft += rangeStep;
    timingRange.style.left = `${rangeLeft}px`;

    if (
      movingStep > 0
        ? (movingLeft > barWidth - movingWidth - movingStep)
        : (movingLeft < Math.abs(movingStep))
    ) {
      movingStep = -movingStep;
    }

    movingLeft += movingStep;
    timingMoving.style.left = `${movingLeft}px`;
  }, 20);

  const handler = (event) => {
    console.log(event.code, event.key);
    if (event.type === 'keydown' && event.code !== 'Space' && event.code !== 'Enter') {
      return;
    }

    event.preventDefault();

    document.removeEventListener('pointerdown', handler);
    document.removeEventListener('keydown', handler);

    clearInterval(intervalId);

    const result = movingLeft > rangeLeft - movingWidth && movingLeft < rangeLeft + rangeWidth;

    if (result) {
      successSound.play();
    } else {
      console.log('failure');
      failureSound.play();
    }

    setTimeout(() => {
      timingDialog.close();
      callback(result);
    }, 1000);
  };

  document.addEventListener('pointerdown', handler);
  document.addEventListener('keydown', handler)
}

const table = document.getElementById('table');
table.classList.add(randomRange(0, 1) === 0 ? 'preset1' : 'preset2');

function game(input) {
  let cell = document.getElementById(input);
  let info = document.getElementById("info");

  if (flag == 1 || squares[input.charAt(0)][input.charAt(1)] != "") {
    alert("ここはクリックできません!");
    errorSound.play();
    return;
  }

  ketteiSound.play();

  timing(function (timingResult) {
    if (!timingResult) {
      turnCount += 1;

      if (turnCount % 2 === 0) {
        info.textContent = "◯の番！";
      }
      else {
        info.textContent = "✕の番！";
      }
      return;
    }

    if (turnCount % 2 === 0) {
      cell.dataset.symbol = "◯";
      squares[input.charAt(0)][input.charAt(1)] = "◯";
    } else {
      cell.dataset.symbol = "✕";
      squares[input.charAt(0)][input.charAt(1)] = "✕";
    }

    for (let i = 0; i < win.length; i++) {
      let cell1 = squares[win[i][0].charAt(0)][win[i][0].charAt(1)];
      let cell2 = squares[win[i][1].charAt(0)][win[i][1].charAt(1)];
      let cell3 = squares[win[i][2].charAt(0)][win[i][2].charAt(1)];
      if (cell1 == "◯" && cell2 == "◯" && cell3 == "◯") {
        info.textContent = "◯の勝ち";
        flag = 1;
        return;
      } else if (cell1 == "✕" && cell2 == "✕" && cell3 == "✕") {
        info.textContent = "✕の勝ち";
        flag = 1;
        return;
      } else {
        ;
      }
    }

    turnCount += 1;
    putCount += 1;

    if (flag == 0) {
      if (putCount == 9) {
        info.textContent = "引き分け！";
      }
      else if (turnCount % 2 === 0) {
        info.textContent = "◯の番！";
      }
      else {
        info.textContent = "✕の番！";
      }
    }
  });
}

function reset() {
  location.reload();
}
