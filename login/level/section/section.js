const Thisproject = (() => {
  'use strict';

  let
    getAccountId,
    getAccountName,
    levelParam,
    area_header,
    html_header,
    container,
    func,
    flag,
    active;

  const conf = {
    area_header: `areaHeader`,
  };

  const levelMap = {
    grade1: { label: "1級", color: "#ffcccc" },
    pre1:   { label: "準1級", color: "#e6ccff" },
    grade2: { label: "2級", color: "#cce6ff" },
    pre2:   { label: "準2級", color: "#fff7cc" }
  };

  const fields = [
    { label: "ワード", value: "vocabulary" },
    { label: "リーディング", value: "reading" },
    { label: "ライティング", value: "writing" },
    { label: "リスニング", value: "listening" }
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

      return this;
    },

    // -----------------------------
    // ヘッダー生成
    // -----------------------------
    makeTitleField: function () {
      if (!flag) return this;
      const { label, color } = levelMap[levelParam] || levelMap["pre2"];
      const header = document.getElementById("header");
      header.innerHTML =
      `
      <header class="header">
      <h1>${label} 分野選択</h1>
      <div class="header-row">
      <!-- 左カラム -->
      <div class="left-group">
      <a href="../level.html?id=${getAccountId}&name=${getAccountName}" class="BtnBack">← 戻る</a>
      <a href="../../login.html?id=${getAccountId}&name=${getAccountName}" class="BtnLogout">ログアウト</a>
      </div>
      <!-- 中央カラム（★アイコン） -->
      <div class="center-group">
      <img id="page-icon" class="page-icon" src="" alt="page icon">
      </div>
      <!-- 右カラム -->
      <div class="right-group">
      <p>ID: ${getAccountId}</p>
      <p>${getAccountName}さん</p>
      </div>
      </div>
      </header>
      `;
      header.className = "header";
      header.style.backgroundColor = color;

      return this;
    },


    // -----------------------------
    // 分野ボタンの親要素取得
    // -----------------------------
    makeFieldArea: function () {
      if (!flag) return this;

      container = document.getElementById("section-container");
      if (!container) {
        console.error("section-container が見つかりません");
      }

      return this;
    },

    // -----------------------------
    // 分野ボタン生成
    // -----------------------------
    makeFieldButtons: function () {
      if (!flag || !container) return this;

      fields.forEach(field => {
        const btn = document.createElement("div");
        btn.className = "section-button";
        btn.textContent = field.label;

        btn.addEventListener("click", () => {
          window.location.href =
            `year_times/year_times.html?id=${getAccountId}&name=${getAccountName}&level=${levelParam}&field=${field.value}`;
        });

        container.appendChild(btn);
      });

      return this;
    },

    // -----------------------------
    // アイコン設定
    // -----------------------------
    settingIcon: function () {
      if (!flag) return this;
      const favicon = document.querySelector('#dynamic-favicon');
      const pageIcon = document.querySelector('#page-icon');
      const iconPath = "../../PageIcon/EikenTitle.png";
      // favicon に設定
      favicon.href = iconPath;
      // 中央アイコンに設定
      if (pageIcon) {
        pageIcon.src = iconPath;
      }
      return this;
    }
  };

  active = () => {
    func
      .init()
      .getParams()
      .makeTitleField()
      .makeFieldArea()
      .makeFieldButtons()
      .settingIcon();

    return;
  };

  return { active };
})();

window.addEventListener('load', function () {
  Thisproject.active();
});
