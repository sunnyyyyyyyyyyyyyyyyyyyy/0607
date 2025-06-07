let video;
let handpose;
let predictions = [];
let isStarted = false;

function setup() {
  createCanvas(640, 480);
  background(0);

  // 綁定開始按鈕
  let btn = document.getElementById('startBtn');
  btn.addEventListener('click', startGame);
}

function startGame() {
  if (isStarted) return;

  // 啟用攝影機
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 載入 handpose 模型
  handpose = ml5.handpose(video, () => {
    console.log('✔ Handpose 模型載入完成');
  });

  handpose.on('predict', results => {
    predictions = results;
  });

  isStarted = true;

  // 改變按鈕狀態
  let btn = document.getElementById('startBtn');
  btn.disabled = true;
  btn.innerText = '偵測中...';
}

function draw() {
  background(0);

  if (isStarted && video) {
    // 鏡像畫面
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // 畫手勢點
    drawHands();
  } else {
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('請點「開始」以啟動遊戲', width / 2, height / 2);
  }
}

function drawHands() {
  if (predictions.length > 0) {
    for (let hand of predictions) {
      for (let keypoint of hand.landmarks) {
        // 鏡像座標轉換（左右反過來）
        let mirroredX = width - keypoint[0];
        let y = keypoint[1];

        fill(0, 255, 0);
        noStroke();
        ellipse(mirroredX, y, 10, 10);
      }
    }
  }
}
