let video;
let handpose;
let predictions = [];

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
let gameState = "waiting";

function setup() {
  createCanvas(640, 480);
}

function startGame() {
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, modelReady);
  handpose.on("predict", results => {
    predictions = results;
  });

  gameState = "start";
}

function modelReady() {
  console.log("Handpose model ready!");
}

function draw() {
  background(220);

  if (gameState === "waiting") {
    drawStartScreen();
  } else {
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    drawQuestion();

    if (predictions.length > 0) {
      let hand = predictions[0];
      // 手指尖座標：食指指尖是 landmarks[8]
      let [x, y, z] = hand.landmarks[8];
      
      // 因為鏡像，我們要把x反轉
      let flippedX = width - x;

      fill(0, 255, 0);
      noStroke();
      ellipse(flippedX, y, 20, 20);

      detectHandSelection(flippedX, y);
    }
  }

}

function drawStartScreen() {
  background(50, 100, 200);
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("點擊開始遊戲", width / 2, height / 2 - 50);

  fill(0, 200, 100);
  rect(width / 2 - 80, height / 2, 160, 60, 20);
  fill(255);
  textSize(24);
  text("開始", width / 2, height / 2 + 30);
}

function mousePressed() {
  if (gameState === "waiting") {
    if (mouseX > width / 2 - 80 && mouseX < width / 2 + 80 &&
      mouseY > height / 2 && mouseY < height / 2 + 60) {
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

let selectionCooldown = false; // 避免短時間內多次判斷

function detectHandSelection(x, y) {
  if (selectionCooldown) return;

  let q = questions[currentQuestion];
  for (let i = 0; i < q.options.length; i++) {
    let optionY = 100 + i * 100;
    if (x > 100 && x < 540 && y > optionY && y < optionY + 60) {
      selectionCooldown = true;

      if (q.options[i] === q.answer) {
        gameState = "correct";
      } else {
        gameState = "wrong";
      }

      setTimeout(() => {
        nextQuestion();
        selectionCooldown = false;
      }, 1500);
      break;
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
