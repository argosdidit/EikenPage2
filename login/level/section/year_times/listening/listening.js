const ListeningApp = (() => {
  'use strict';

  let audioList = [];
  let choiceList = [];
  let levelParam, fieldParam;
  let container;

  let
  year,
  times,
  getAccountId,
  getAccountName;

  const conf = {
    container: "reading-container",
    header: "header",
    backLink: "back-link",
    resultBox: "result-box",
    checkButton: "check-all"
  };

  const func = {
    init() {
      const urlParams = new URLSearchParams(window.location.search);
      getAccountId = urlParams.get("id");
      getAccountName = urlParams.get("name");

      if(getAccountId === null)
        getAccountId = "0000000000";

      if(getAccountName === null)
        getAccountName = "Guest";
      
      levelParam = urlParams.get("level") || "pre2";
      fieldParam = urlParams.get("field") || "listening";
      return this;
    },
    async loadListeningData() {
      const urlParams = new URLSearchParams(window.location.search);
      const level = urlParams.get("level");
      year = urlParams.get("year");
      times = urlParams.get("times");

      const res = await fetch(`/api/listening?level=${level}&year=${year}&times=${times}`);
      const data = await res.json();

      audioList = data.audio;
      choiceList = data.choice;

      return this;
    },
    makeTitleField() {
      const header = document.getElementById(conf.header);
      const levelMap = {
        grade1: { label: "1級", color: "#ffcccc" },
        pre1:   { label: "準1級", color: "#e6ccff" },
        grade2: { label: "2級", color: "#cce6ff" },
        pre2:   { label: "準2級", color: "#fff7cc" }
      };
      const { label, color } = levelMap[levelParam] || levelMap["pre2"];
      header.innerHTML =
      `
      <a href="../year_times.html?level=${levelParam}&field=${fieldParam}" class="BtnBack">← 戻る</a>
      <a href="../../../../login.html?id=${getAccountId}&name=${getAccountName}" class="BtnLogout">ログアウト</a>
      <h1>リスニング ${label} ${year}年 ${times}回</h1>
      <div class="accont-info">
      <p>ID: ${getAccountId}</p>
      <br>
      <p>${getAccountName}さん</p>
      </div>
      </div>
      `;
      header.className = "header";
      header.style.backgroundColor = color;
      return this;
    },
    renderListening() {
      container = document.getElementById(conf.container);

      audioList.forEach(audio => {
        const areaBox = document.createElement("div");
        areaBox.className = "main-question";

        areaBox.innerHTML = `
          <div class="area-label">[${audio.area}]</div>
          <div class="main-header">
            <audio controls src="${audio.path_audio}">
          </div>
        `;

        const questions = choiceList.filter(q => q.area === audio.area);

        questions.forEach(q => {
          const quizBox = document.createElement("div");
          quizBox.className = "quiz-box";
          quizBox.dataset.no = q.no;

          quizBox.innerHTML = `
            <div class="quiz-header-row">
            <div class="no-label">Q${q.no}</div>
            <div class="quiz-header-buttons">
            <button class="play-btn" data-start="${q.time_sec_start}" data-end="${q.time_sec_end}">再生</button>
            <button class="subtitle-btn" data-sub="${q.path_subtitle}">字幕</button>
            </div>
            </div>

            <div class="quiz-body">
              ${[1,2,3,4].map(n => `
                <div class="choice-row">
                  <span class="choice-number">${n}.</span>
                  <img src="${q[`path_choice${n}`]}" class="choice" data-value="${n}">
                </div>
              `).join("")}
            </div>
            <div class="quiz-footer-row">
            <img src="${q.path_subtitle}">
            </div>
          `;

          areaBox.appendChild(quizBox);
        });

        container.appendChild(areaBox);
      });
      return this;
    },
    enablePlayButton() {
      document.addEventListener("click", e => {
        if (!e.target.classList.contains("play-btn")) return;
        const start = Number(e.target.dataset.start);
        const end = Number(e.target.dataset.end);
        const areaBox = e.target.closest(".main-question");
        const audio = areaBox.querySelector("audio");
        audio.currentTime = start;
        audio.play();
        const stopCheck = setInterval(() => {
          if (audio.currentTime >= end) {
            audio.pause();
            clearInterval(stopCheck);
          }
        }, 100);
      });
      return this;
    },
    enableSubtitleButton() {
      document.addEventListener("click", e => {
        if (!e.target.classList.contains("subtitle-btn")) return;
        const quizBox = e.target.closest(".quiz-box");
        const img = quizBox.querySelector(".quiz-footer-row img");
        img.classList.toggle("show");
      });
      return this;
    },
    enableSelect() {
      document.addEventListener("click", e => {
        const row = e.target.closest(".choice-row");
        if (!row) return;
        const parent = row.closest(".quiz-body");
        parent.querySelectorAll(".choice-row").forEach(r => r.classList.remove("selected"));
        row.classList.add("selected");
      });
      return this;
    },
    enableCheck() {
      const button = document.getElementById(conf.checkButton);
      const resultBox = document.getElementById(conf.resultBox);
      
      button.addEventListener("click", () => {
        resultBox.innerHTML = "";
        let score = 0;
        
        document.querySelectorAll(".quiz-box").forEach(box => {
          const no = Number(box.dataset.no);
          const q = choiceList.find(item => item.no === no);
          const correct = q.answer;
          
          const selectedRow = box.querySelector(".choice-row.selected");
          const correctRow = box.querySelector(`.choice-row:nth-child(${correct})`);
          
          const result = document.createElement("div");
          result.textContent = `Q${no} `;
          
          if (selectedRow)
          {
            const userAnswer = Number(selectedRow.querySelector(".choice").dataset.value);
            
            if (userAnswer === correct)
            {
              selectedRow.classList.add("correct");
              result.textContent += "正解";
              result.style.color = "green";
              score++;
            }
            else
            {
              selectedRow.classList.add("incorrect");
              correctRow.classList.add("correct");
              result.textContent += "不正解";
              result.style.color = "red";
            }
          }
          else
          {
            correctRow.classList.add("correct");
            result.textContent += "未回答";
            result.style.color = "blue";
          }
          resultBox.appendChild(result);
        });
        const finalScore = document.createElement("div");
        finalScore.innerHTML = `<strong>あなたの得点: ${score} / ${choiceList.length}</strong>`;
        finalScore.style.marginTop = "20px";
        resultBox.appendChild(finalScore);
      });
      return this;
    },
    settingIcon() {
      const favicon = document.querySelector('#dynamic-favicon');
      switch(levelParam){
        case "grade1":
          favicon.href = "../../../../PageIcon/Level1_Listening.png";
          break;
        case "pre1":
          favicon.href = "../../../../PageIcon/LevelPre1_Listening.png";
          break;
        case "grade2":
          favicon.href = "../../../../PageIcon/Level2_Listening.png";
          break;
        case "pre2":
          favicon.href = "../../../../PageIcon/LevelPre2_Listening.png";
          break;
        default:
          break;
      }
    }
  };

  const active = () => {
    func
      .init()
      .loadListeningData()
      .then(() => {
        func
          .makeTitleField()
          .renderListening()
          .enablePlayButton()
          .enableSubtitleButton()
          .enableSelect()
          .enableCheck()
          .settingIcon();
      });
  };

  return { active };
})();

window.addEventListener("load", () => {
  ListeningApp.active();
});