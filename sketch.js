let video;
let handpose;
let predictions = [];
let isStarted = false;

function setup() {
  createCanvas(640, 480);
  background(0);

  // 先不開啟鏡頭，等按鈕按下後才開始
  // 按鈕事件在 setup 裡面註冊
  let btn = document.getElementById('startBtn');
  btn.addEventListener('click', startGame);
}

function startGame() {
  if (isStarted) return; // 防止重複點擊

  // 開啟鏡頭
  video = createCapture(VIDEO, () => {
    console.log('鏡頭已啟動');
  });
  video.size(width, height);
  video.hide();

  // 載入 handpose 模型
  handpose = ml5.handpose(video, () => {
    console.log('Handpose 模型載入完成');
  });

  // 偵測手部
  handpose.on('predict', results => {
    predictions = results;
  });

  isStarted = true;

  // 按鈕禁用
  let btn = document.getElementById('startBtn');
  btn.disabled = true;
  btn.innerText = '遊戲開始';
}

function draw() {
  background(0);

  if (isStarted) {
    // 翻轉鏡頭畫面（左右反轉）
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    // 畫手部關鍵點
    drawHands();
  } else {
    // 未開始時提示
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text('請按開始按鈕', width / 2, height / 2);
  }
}

function drawHands() {
  if (predictions.length > 0) {
    for (let hand of predictions) {
      for (let keypoint of hand.landmarks) {
        fill(0, 255, 0);
        noStroke();
        ellipse(keypoint[0], keypoint[1], 10, 10);
      }
    }
  }
}
