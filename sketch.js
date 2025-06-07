let canvas;
let video;
let detections = [];

let blocks = [];
let targetWords = ["教", "育", "科", "技"];
let caughtWords = [];
let timer = 30;
let gameOver = false;
let gameSuccess = false;
let restartTimer = 0;
let lastBlockTime = 0;

function setup() {
  canvas = createCanvas(640, 480);
  canvas.parent(document.body);

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  setupHandTracking();

  textAlign(CENTER, CENTER);
  rectMode(CENTER);
}

function draw() {
  background(255);

  // 翻轉鏡頭畫面
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  drawTimer();
  if (!gameOver && !gameSuccess) {
    drawBlocks();
    checkGameStatus();
    spawnBlocks();
  } else {
    drawResult();
    restartTimer--;
    if (restartTimer <= 0) {
      restartGame();
    }
  }
}

function setupHandTracking() {
  const hands = new Hands({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
  });

  hands.setOptions({
    maxNumHands: 1,
    modelComplexity: 1,
    minDetectionConfidence: 0.8,
    minTrackingConfidence: 0.5,
  });

  hands.onResults(results => {
    detections = results.multiHandLandmarks;
  });

  const camera = new Camera(video.elt, {
    onFrame: async () => {
      await hands.send({ image: video.elt });
    },
    width: 640,
    height: 480,
  });
  camera.start();
}

function drawHand() {
  if (detections.length > 0) {
    let landmarks = detections[0];
    let thumbTip = landmarks[4];
    let indexTip = landmarks[8];

    let x1 = width - thumbTip.x * width;
    let y1 = thumbTip.y * height;
    let x2 = width - indexTip.x * width;
    let y2 = indexTip.y * height;

    stroke(0, 255, 0);
    strokeWeight(4);
    line(x1, y1, x2, y2);

    return { x: (x1 + x2) / 2, y: (y1 + y2) / 2 };
  }
  return null;
}

function spawnBlocks() {
  if (millis() - lastBlockTime > 1000) {
    lastBlockTime = millis();

    let r = random();
    let newBlock = {
      x: random(50, width - 50),
      y: -40,
      text: "",
      type: "normal",
      caught: false
    };

    if (r < 0.2) {
      newBlock.text = "+5秒";
      newBlock.type = "timePlus";
      newBlock.value = 5;
    } else if (r < 0.3) {
      newBlock.text = "+10秒";
      newBlock.type = "timePlus";
      newBlock.value = 10;
    } else if (r < 0.35) {
      newBlock.text = "+15秒";
      newBlock.type = "timePlus";
      newBlock.value = 15;
    } else if (r < 0.45) {
      newBlock.text = "-3秒";
      newBlock.type = "timeMinus";
      newBlock.value = -3;
    } else {
      newBlock.text = random(targetWords);
      newBlock.type = "target";
    }

    blocks.push(newBlock);
  }
}

function drawBlocks() {
  let handPos = drawHand();

  for (let block of blocks) {
    if (!block.caught) {
      block.y += 2;

      fill(200, 100, 100);
      rect(block.x, block.y, 60, 40, 5);
      fill(255);
      textSize(18);
      text(block.text, block.x, block.y);

      if (handPos && dist(handPos.x, handPos.y, block.x, block.y) < 40) {
        block.caught = true;
        if (block.type === "timePlus") {
          timer += block.value;
        } else if (block.type === "timeMinus") {
          timer += block.value;
        } else if (block.type === "target" && !caughtWords.includes(block.text)) {
          caughtWords.push(block.text);
        }
      }
    }
  }
}

function drawTimer() {
  fill(0);
  textSize(20);
  text("剩餘時間: " + timer.toFixed(1), width / 2, 30);
  if (!gameOver && !gameSuccess) {
    timer -= deltaTime / 1000;
  }
}

function checkGameStatus() {
  if (timer <= 0) {
    gameOver = true;
    restartTimer = 300;
  }
  if (targetWords.every(word => caughtWords.includes(word))) {
    gameSuccess = true;
    restartTimer = 300;
  }
}

function drawResult() {
  textSize(32);
  if (gameSuccess) {
    fill(0, 200, 0);
    text("挑戰成功！", width / 2, height / 2);
  } else if (gameOver) {
    fill(200, 0, 0);
    text("挑戰失敗", width / 2, height / 2);
  }
}

function restartGame() {
  blocks = [];
  caughtWords = [];
  timer = 30;
  gameOver = false;
  gameSuccess = false;
}
