let video;
let faceapi;
let detections = [];
let gameStarted = false;
let currentQuestion = 0;
let questions = [
  { text: "大一必修課：哪一門課教AI與程式語言？", answer: "AI與程式語言" },
  { text: "大二必修課：哪門課需要進行教學設計？", answer: "教學設計" },
  { text: "大三必修課：與教材互動有關的是？", answer: "互動教材設計與實習" },
  { text: "大四：課程評鑑與設計是哪門課？", answer: "課程發展與評鑑" }
];
let userInput = "";

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  let faceOptions = {
    withLandmarks: false,
    withDescriptors: false,
  };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);
}

function modelReady() {
  console.log("FaceAPI Ready!");
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  detections = result;
  faceapi.detect(gotResults);
}

function draw() {
  background(0);
  image(video, 0, 0, width, height);
  drawGameUI();

  // 簡單臉部互動（如果有偵測到臉）
  if (detections && detections.length > 0) {
    fill(0, 255, 0);
    textSize(24);
    text("你好！準備好了嗎？", 20, height - 40);
  }
}

function drawGameUI() {
  fill(255);
  rect(0, 0, width, 100);
  fill(0);
  textSize(20);
  textAlign(LEFT, TOP);

  if (!gameStarted) {
    text("按任意鍵開始問答遊戲", 20, 20);
  } else {
    text(`第 ${currentQuestion + 1} 題：${questions[currentQuestion].text}`, 20, 20);
    text(`你的答案：${userInput}`, 20, 60);
  }
}

function keyPressed() {
  if (!gameStarted) {
    gameStarted = true;
    return;
  }

  if (keyCode === ENTER) {
    if (userInput === questions[currentQuestion].answer) {
      currentQuestion++;
      if (currentQuestion >= questions.length) {
        gameStarted = false;
        currentQuestion = 0;
        userInput = "";
        alert("恭喜你完成所有問題！");
      } else {
        userInput = "";
      }
    } else {
      alert("答錯了，再想想！");
    }
  } else if (keyCode === BACKSPACE) {
    userInput = userInput.slice(0, -1);
  } else {
    userInput += key;
  }
}
