let video;
let faceapi;
let detections = [];

let questions = [
  {
    course: "教育科技概論",
    options: ["介紹科技應用", "學會攝影", "程式動畫設計"],
    answer: 0
  },
  {
    course: "攝影與視覺傳達",
    options: ["拍照與構圖", "統計分析", "教學理論"],
    answer: 0
  }
];

let currentQuestion = 0;
let selectedZone = -1;
let zoneEnterTime = 0;
let feedback = "";

function setup() {
  createCanvas(800, 600);
  video = createCapture(VIDEO);
  video.size(800, 600);
  video.hide();

  const faceOptions = { withLandmarks: true, withExpressions: false, withDescriptors: false };
  faceapi = ml5.faceApi(video, faceOptions, modelReady);
}

function modelReady() {
  faceapi.detect(gotResults);
}

function gotResults(err, result) {
  if (err) {
    console.error(err);
    return;
  }
  detections = result;
  faceapi.detect(gotResults); // loop detection
}

function draw() {
  background(255);
  image(video, 0, 0, width, height);

  drawQuestion();

  if (detections && detections.length > 0) {
    let nose = detections[0].parts.nose[3]; // 鼻尖座標

    fill(255, 0, 0);
    ellipse(nose._x, nose._y, 20, 20);

    let zone = getZone(nose._x);
    if (zone === selectedZone) {
      if (millis() - zoneEnterTime > 2000) {
        checkAnswer(zone);
        selectedZone = -1;
      }
    } else {
      selectedZone = zone;
      zoneEnterTime = millis();
    }
  }
}

function drawQuestion() {
  if (currentQuestion >= questions.length) {
    fill(0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("🎉 恭喜你完成課程問答！", width / 2, height / 2);
    return;
  }

  let q = questions[currentQuestion];

  fill(0);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("課程：" + q.course, width / 2, 50);

  for (let i = 0; i < 3; i++) {
    fill(200);
    rect(i * (width / 3), 400, width / 3, 100);
    fill(0);
    text(q.options[i], i * (width / 3) + width / 6, 450);
  }

  fill(feedback === "正確！" ? "green" : "red");
  text(feedback, width / 2, 550);
}

function getZone(x) {
  if (x < width / 3) return 0;
  else if (x < 2 * width / 3) return 1;
  else return 2;
}

function checkAnswer(zone) {
  if (zone === questions[currentQuestion].answer) {
    feedback = "正確！";
    setTimeout(() => {
      currentQuestion++;
      feedback = "";
    }, 1000);
  } else {
    feedback = "錯誤，再試一次！";
  }
}
