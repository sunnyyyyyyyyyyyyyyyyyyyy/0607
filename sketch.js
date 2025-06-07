let video;
let handpose;
let predictions = [];
let isStarted = false;

let currentCourses = [];
let courseIndex = 0;
let showMessage = '';
let messageTimer = 0;

// 所有課程
let allCourses = [
  // 大一課程
  { name: "教育科技概論", desc: "介紹教育科技的基礎概念與發展" },
  { name: "AI與程式語言", desc: "學習基礎AI與程式語言應用" },
  { name: "數位音訊編輯", desc: "學習音訊編輯技術與實務" },
  { name: "平面設計", desc: "學習設計原理與應用軟體操作" },
  { name: "教學原理與策略", desc: "理解教學設計理論與實務" },
  // 大二課程
  { name: "需求分析", desc: "學習分析使用者需求與設計流程" },
  { name: "介面設計", desc: "設計人因導向的教育介面" },
  { name: "2D動畫製作", desc: "學習動畫基礎與製作技巧" },
  { name: "教育統計概論", desc: "理解統計基本概念與應用" },
  // 大三課程
  { name: "互動教材設計", desc: "開發與測試互動型教材" },
  { name: "人力資源發展", desc: "探索組織內部的人才培育方法" },
  { name: "數位學習導入", desc: "導入數位學習系統與經營方式" },
  // 大四課程
  { name: "課程發展與評鑑", desc: "設計並評估有效課程" },
  { name: "畢業專題", desc: "完成個人或團隊的專題製作" }
];

function setup() {
  createCanvas(640, 480);
  let btn = document.getElementById('startBtn');
  btn.addEventListener('click', startGame);
  textFont('sans-serif');
  textSize(20);
  textAlign(CENTER, CENTER);
}

function startGame() {
  if (isStarted) return;

  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  handpose = ml5.handpose(video, () => {
    console.log("✔ Handpose模型載入完成");
  });

  handpose.on("predict", results => {
    predictions = results;
  });

  isStarted = true;
  nextCourses();

  let btn = document.getElementById('startBtn');
  btn.disabled = true;
  btn.innerText = '偵測中...';
}

function draw() {
  background(30);

  if (isStarted && video) {
    // 畫鏡像攝影畫面
    push();
    translate(width, 0);
    scale(-1, 1);
    image(video, 0, 0, width, height);
    pop();

    drawCourses();
    drawHands();

    if (messageTimer > 0) {
      fill(255, 255, 0);
      textSize(24);
      text(showMessage, width / 2, height - 30);
      messageTimer--;
    }
  } else {
    fill(255);
    text("請點「開始」以啟動遊戲", width / 2, height / 2);
  }
}

// 隨機選出 3 個課程
function nextCourses() {
  currentCourses = [];
  let pool = [...allCourses];
  for (let i = 0; i < 3; i++) {
    let idx = floor(random(pool.length));
    currentCourses.push(pool.splice(idx, 1)[0]);
  }
}

// 畫課程卡片
function drawCourses() {
  let w = 180;
  let h = 100;
  let margin = 40;

  for (let i = 0; i < currentCourses.length; i++) {
    let x = margin + i * (w + margin);
    let y = 100;

    fill(255, 100);
    stroke(255);
    rect(x, y, w, h, 12);

    fill(255);
    noStroke();
    textSize(16);
    text(currentCourses[i].name, x + w / 2, y + h / 2);
  }
}

// 偵測食指觸碰卡片
function drawHands() {
  if (predictions.length > 0) {
    let hand = predictions[0];
    let index = hand.landmarks[8]; // 食指指尖

    // 鏡像
    let x = width - index[0];
    let y = index[1];

    fill(0, 255, 0);
    noStroke();
    ellipse(x, y, 15, 15);

    // 檢查是否點中課程卡
    let w = 180;
    let h = 100;
    let margin = 40;

    for (let i = 0; i < currentCourses.length; i++) {
      let cx = margin + i * (w + margin);
      let cy = 100;
      if (x > cx && x < cx + w && y > cy && y < cy + h) {
        showMessage = currentCourses[i].desc;
        messageTimer = 100;
        nextCourses();
        break;
      }
    }
  }
}
