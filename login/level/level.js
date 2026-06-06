const Thisproject = (() => {
  'use strict';

  let
  getAccountId,
  getAccountName,
  area_header,
  html_header,
  container,
  func,
  flag,
  active;

  const conf = {
    area_header: `areaHeader`,
  };

  const levelData = [
    { label: "1級", value: "grade1", color: "#ffcccc" },
    { label: "準1級", value: "pre1", color: "#e6ccff" },
    { label: "2級", value: "grade2", color: "#cce6ff" },
    { label: "準2級", value: "pre2", color: "#fff7cc" },
  ];

  func = {
    init: function () {
      flag = true;
      return this;
    },

    // -----------------------------
    // ヘッダー生成
    // -----------------------------
    makeHeaderField: function () {
      if (!flag) return this;

      const urlParams = new URLSearchParams(window.location.search);
      getAccountId = urlParams.get("id");
      getAccountName = urlParams.get("name");

      if(getAccountId === null)
        getAccountId = "0000000000";

      if(getAccountName === null)
        getAccountName = "Guest";

      html_header =
      `
      <h1>${getAccountName}さん</h1>
      <br>
      <h1>英検レベルを選択してください</h1>
      `;

      area_header = document.querySelector(`[${conf.area_header}]`);
      area_header.insertAdjacentHTML('beforeend', html_header);

      return this;
    },

    // -----------------------------
    // レベルボタンの親要素取得
    // -----------------------------
    makeLevelField: function () {
      if (!flag) return this;

      container = document.getElementById("level-container");
      return this;
    },

    // -----------------------------
    // レベルボタン生成
    // -----------------------------
    makeButtonField: function () {
      if (!flag) return this;

      levelData.forEach(level => {
        const btn = document.createElement("div");
        btn.className = "level-button";
        btn.textContent = level.label;
        btn.style.backgroundColor = level.color;

        btn.addEventListener("click", () => {
          window.location.href = `section/section.html?id=${getAccountId}&name=${getAccountName}&level=${level.value}`;
        });

        container.appendChild(btn);
      });

      const BtnLogout = document.createElement("a");
      BtnLogout.className = "level-button";
      BtnLogout.textContent = "ログアウト";
      BtnLogout.style.backgroundColor = "#ccc";
      BtnLogout.addEventListener("click", () => {
        window.location.href = `../login.html?id=${getAccountId}&name=${getAccountName}`;
      });
      container.appendChild(BtnLogout);

      return this;
    },

    // -----------------------------
    // アイコン設定
    // -----------------------------
    settingIcon: function () {
      if (!flag) return this;

      const favicon = document.querySelector('#dynamic-favicon');
      favicon.href = "../PageIcon/EikenTitle.png";

      return this;
    }
  };

  active = () => {
    func
      .init()
      .makeHeaderField()
      .makeLevelField()
      .makeButtonField()
      .settingIcon();
    return;
  };

  return { active };
})();

window.addEventListener('load', function () {
  Thisproject.active();
});
