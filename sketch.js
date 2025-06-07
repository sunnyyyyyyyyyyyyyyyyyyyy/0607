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
let gameState = "start";

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);
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
  image(video, 0, 0, width, height);

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

function drawQuestion() {
  let q = questions[currentQuestion];

  fill(255);
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

function detectFaceSelection() {
  if (detections.length > 0) {
    let alignedRect = detections[0].alignedRect;
    let { x, y, width: w, height: h } = alignedRect._box;

    // 用臉中心點作為指標
    let centerX = x + w / 2;
    let centerY = y + h / 2;

    fill(0, 255, 0);
    ellipse(centerX, centerY, 20, 20); // 顯示臉部中點

    // 判斷是否碰到選項
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
