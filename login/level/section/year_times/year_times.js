const Thisproject = (() => {
  'use strict';

  let
    getAccountId,
    getAccountName,
    levelParam,
    fieldParam,
    container,
    header,
    func,
    flag,
    active;

  const levelMap = {
    grade1: { label: "1級", color: "#ffcccc" },
    pre1:   { label: "準1級", color: "#e6ccff" },
    grade2: { label: "2級", color: "#cce6ff" },
    pre2:   { label: "準2級", color: "#fff7cc" }
  };

  const yearTimes = [
    { year: 2025, times: [1, 2, 3] },
    { year: 2024, times: [1, 2, 3] },
    { year: 2023, times: [1, 2, 3] },
    { year: 2022, times: [1, 2, 3] },
    { year: 2021, times: [1, 2, 3] },
    { year: 2020, times: [1, 2, 3] },
    { year: 2019, times: [1, 2, 3] },
    { year: 2018, times: [1, 2, 3] },
    { year: 2017, times: [1, 2, 3] },
    { year: 2016, times: [1, 2, 3] },
    { year: 2015, times: [1, 2, 3] },
    { year: 2014, times: [1, 2, 3] }
  ];

  func = {
    init: function () {
      flag = true;
      return this;
    },

    // -----------------------------
    // URL パラメータ取得
    // -----------------------------
    getParams: function () {
      if (!flag) return this;

      const urlParams = new URLSearchParams(window.location.search);
      getAccountId = urlParams.get("id");
      getAccountName = urlParams.get("name");

      if(getAccountId === null)
        getAccountId = "0000000000";

      if(getAccountName === null)
        getAccountName = "Guest";
      
      levelParam = urlParams.get("level") || "pre2";
      fieldParam = urlParams.get("field") || "word";

      return this;
    },

    // -----------------------------
    // タイトル生成
    // -----------------------------
    makeTitleField: function () {
      if (!flag) return this;

      const { label, color } = levelMap[levelParam] || levelMap["pre2"];
      const fieldLabel = this.getFieldLabel(fieldParam);

      header = document.getElementById("header");
      header.innerHTML =
      `
      <a href="../section.html?level=${levelParam}&id=${getAccountId}&name=${getAccountName}" class="BtnBack">← 戻る</a>
      <a href="../../../login.html?id=${getAccountId}&name=${getAccountName}" class="BtnLogout">ログアウト</a>
      <h1>${label} ${fieldLabel} 過去問</h1>
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

    // -----------------------------
    // 分野ラベル変換
    // -----------------------------
    getFieldLabel: function (field) {
      const fieldMap = {
        word: "ワード",
        vocabulary: "ワード",
        reading: "リーディング",
        writing: "ライティング",
        listening: "リスニング"
      };
      return fieldMap[field] || "ワード";
    },

    // -----------------------------
    // 年度・回数ボタン生成
    // -----------------------------
    makeSectionField: function () {
      if (!flag) return this;

      container = document.getElementById("section-container");

      yearTimes.forEach(({ year, times }) => {
        times.forEach(num => {
          const div = document.createElement("div");
          div.className = "section-button";
          div.textContent = `${year}年度${num}回`;

          let targetFolder = fieldParam;
          if (fieldParam === "word") targetFolder = "vocabulary";

          div.addEventListener("click", () => {
            window.location.href =
              `./${targetFolder}/${targetFolder}.html?id=${getAccountId}&name=${getAccountName}&level=${levelParam}&field=${fieldParam}&year=${year}&times=${num}`;
          });

          container.appendChild(div);
        });
      });

      return this;
    },

    // -----------------------------
    // アイコン設定
    // -----------------------------
    settingIcon: function () {
      if (!flag) return this;

      const favicon = document.querySelector('#dynamic-favicon');
      favicon.href = "PageIcon/EikenTitle.png";

      const iconBase = "../../../PageIcon/";

      const iconMap = {
        grade1: {
          vocabulary: "Level1_Vocabulary.png",
          reading: "Level1_Reading.png",
          writing: "Level1_Writing.png",
          listening: "Level1_Listening.png"
        },
        pre1: {
          vocabulary: "LevelPre1_Vocabulary.png",
          reading: "LevelPre1_Reading.png",
          writing: "LevelPre1_Writing.png",
          listening: "LevelPre1_Listening.png"
        },
        grade2: {
          vocabulary: "Level2_Vocabulary.png",
          reading: "Level2_Reading.png",
          writing: "Level2_Writing.png",
          listening: "Level2_Listening.png"
        },
        pre2: {
          vocabulary: "LevelPre2_Vocabulary.png",
          reading: "LevelPre2_Reading.png",
          writing: "LevelPre2_Writing.png",
          listening: "LevelPre2_Listening.png"
        }
      };

      if (iconMap[levelParam] && iconMap[levelParam][fieldParam]) {
        favicon.href = iconBase + iconMap[levelParam][fieldParam];
      }

      return this;
    }
  };

  active = () => {
    func
      .init()
      .getParams()
      .makeTitleField()
      .makeSectionField()
      .settingIcon();

    return;
  };

  return { active };
})();

window.addEventListener('load', function () {
  Thisproject.active();
});
