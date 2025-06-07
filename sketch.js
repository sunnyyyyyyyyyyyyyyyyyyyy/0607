let video;
let faceapi;
let detections = [];

let questions = [
  {
    question: "大一會學到哪一門課？",
    options: ["2D動畫設計", "需求分析", "教育心理學"],
    answer: "教育心理學"
  },
  {
    question: "大三會學到哪一門課？",
    options: ["未來學習與AI", "互動教材設計", "平面設計"],
    answer: "互動教材設計"
  }
];

let currentQuestion = 0;
let gameState = "waiting"; // 新增狀態：等待開始

function setup() {
  createCanvas(640, 480);
  
  // 開始時不立即啟動攝影機和faceapi
  // 攝影機跟faceapi會在 startGame() 被呼叫時建立
}

function startGame() {
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);

  gameState = "start";
}

function modelReady() {
  console.log("FaceAPI loaded!");
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }

  detections = result;
  faceapi.detect(gotResults); // 持續偵測
}

function draw() {
  background(220);

  if (gameState === "waiting") {
    drawStartScreen();
  } else {
    // 鏡像翻轉畫面：先平移寬度，再scale X軸 -1
    push();
    translate(width, 0);
    scale(-1, 1);

    image(video, 0, 0, width, height);

    if (detections.length > 0) {
      drawFaceBox();
    }
    pop();

    if (gameState === "start") {
      drawQuestion();
      detectFaceSelection();
    } else if (gameState === "correct") {
      fill(0, 255, 0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("正確！", width / 2, height / 2);
      setTimeout(nextQuestion, 1500);
    } else if (gameState === "wrong") {
      fill(255, 0, 0);
      textSize(32);
      textAlign(CENTER, CENTER);
      text("答錯囉！", width / 2, height / 2);
      setTimeout(nextQuestion, 1500);
    }
  }
}

function drawStartScreen() {
  background(50, 100, 200);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("點擊開始遊戲", width / 2, height / 2 - 50);
  
  // 畫按鈕
  fill(0, 200, 100);
  rect(width/2 - 80, height/2, 160, 60, 20);
  fill(255);
  textSize(24);
  text("開始", width / 2, height / 2 + 30);
}

function mousePressed() {
  if (gameState === "waiting") {
    // 判斷滑鼠是否點擊到按鈕範圍
    if (mouseX > width/2 - 80 && mouseX < width/2 + 80 && mouseY > height/2 && mouseY < height/2 + 60) {
      startGame();
    }
  }
}

function drawQuestion() {
  let q = questions[currentQuestion];

  fill(255, 200);
  rect(0, 0, width, 60);
  fill(0);
  textSize(20);
  textAlign(CENTER, CENTER);
  text(q.question, width / 2, 30);

  for (let i = 0; i < q.options.length; i++) {
    fill(255, 255, 0, 150);
    rect(100, 100 + i * 100, 440, 60, 10);
    fill(0);
    textSize(18);
    text(q.options[i], width / 2, 130 + i * 100);
  }
}

function drawFaceBox() {
  let alignedRect = detections[0].alignedRect;
  let { x, y, width: w, height: h } = alignedRect._box;

  // 因為鏡像畫面，X座標也要反轉
  let centerX = width - (x + w / 2);
  let centerY = y + h / 2;

  fill(0, 255, 0);
  ellipse(centerX, centerY, 20, 20);
}

function detectFaceSelection() {
  if (detections.length > 0) {
    let alignedRect = detections[0].alignedRect;
    let { x, y, width: w, height: h } = alignedRect._box;

    let centerX = width - (x + w / 2); // 反轉X座標
    let centerY = y + h / 2;

    let q = questions[currentQuestion];
    for (let i = 0; i < q.options.length; i++) {
      let optionY = 100 + i * 100;
      if (centerX > 100 && centerX < 540 && centerY > optionY && centerY < optionY + 60) {
        if (q.options[i] === q.answer) {
          gameState = "correct";
        } else {
          gameState = "wrong";
        }
      }
    }
  }
}

function nextQuestion() {
  currentQuestion++;
  if (currentQuestion >= questions.length) {
    currentQuestion = 0;
  }
  gameState = "start";
}
