let questions = [
  {
    course: "教育科技概論",
    options: [
      "介紹科技在教學中的應用與未來趨勢",
      "學習如何處理照片與影像合成",
      "設計程式遊戲與動畫"
    ],
    answer: 0
  },
  {
    course: "攝影與視覺傳達",
    options: [
      "學習教學設計流程與需求分析",
      "學習拍照、取景、與視覺傳達原則",
      "寫出網頁前端互動功能"
    ],
    answer: 1
  },
  {
    course: "互動教材設計與實習",
    options: [
      "使用動畫設計製作教具或教材",
      "介紹圖書館資源與檢索技巧",
      "統計教學成效的實驗資料"
    ],
    answer: 0
  }
];

let currentQuestion = 0;
let feedback = "";

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  textSize(24);
}

function draw() {
  background(240);

  if (currentQuestion < questions.length) {
    let q = questions[currentQuestion];
    fill(0);
    text("課程名稱：" + q.course, width / 2, 100);

    for (let i = 0; i < q.options.length; i++) {
      fill(200);
      rect(200, 200 + i * 100, 400, 60, 10);
      fill(0);
      text(q.options[i], 400, 230 + i * 100);
    }

    fill(feedback === "正確！" ? "green" : "red");
    text(feedback, width / 2, 500);
  } else {
    fill(0);
    text("恭喜你完成所有課程冒險！", width / 2, height / 2);
  }
}

function mousePressed() {
  if (currentQuestion >= questions.length) return;

  let yOffset = 200;
  for (let i = 0; i < 3; i++) {
    if (
      mouseX > 200 &&
      mouseX < 600 &&
      mouseY > yOffset + i * 100 &&
      mouseY < yOffset + i * 100 + 60
    ) {
      if (i === questions[currentQuestion].answer) {
        feedback = "正確！";
        setTimeout(() => {
          currentQuestion++;
          feedback = "";
        }, 800);
      } else {
        feedback = "錯誤，再試一次！";
      }
    }
  }
}
