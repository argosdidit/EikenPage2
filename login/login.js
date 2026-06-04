const Thisproject = (() => {
  'use strict';
  let area_contents, html_contents, func, flag, active;

  const conf = {
    area_contents: `area-contents`,
  };

  func = {
    init: function () {
      flag = true;
      return this;
    },

    makeAreaContents: function () {
      if (flag) {

        html_contents =
        `
        <div class="container">
        <div class="login-box">
        <img class="imgTitle" src="PageIcon/EikenTitle.png" height="40%" width="40%">
        <input type="number" placeholder="ログインID" class="login-input">
        <input type="password" placeholder="ログインPW" class="login-input">
        <button class="BtnLogin">ログイン</button>
        <br>
        <button class="BtnReset">パスワードリセット</button>
        </div>
        </div>
        `;

        area_contents = document.querySelector(`[${conf.area_contents}]`);
        area_contents.insertAdjacentHTML('beforeend', html_contents);

        const BtnLogin = area_contents.querySelector('.BtnLogin');
        const BtnReset = area_contents.querySelector('.BtnReset');
        
        BtnLogin.addEventListener('click', () => {
          func.clickLogin();
        });
        BtnReset.addEventListener('click', () => {
          func.clickReset();
        });

        //初期値代入
        document.querySelector('.login-input[type="number"]').value = "0000000000";
        document.querySelector('.login-input[type="password"]').value = "0000000000";
        
        // 画像追加
        const container = area_contents.querySelector('.container');
        const icons = [
          "PageIcon/Level1_Vocabulary.png",
          "PageIcon/LevelPre1_Vocabulary.png",
          "PageIcon/Level2_Vocabulary.png",
          "PageIcon/LevelPre2_Vocabulary.png",
          "PageIcon/Level1_Reading.png",
          "PageIcon/LevelPre1_Reading.png",
          "PageIcon/Level2_Reading.png",
          "PageIcon/LevelPre2_Reading.png",
          "PageIcon/Level1_Writing.png",
          "PageIcon/LevelPre1_Writing.png",
          "PageIcon/Level2_Writing.png",
          "PageIcon/LevelPre2_Writing.png",
          "PageIcon/Level1_Listening.png",
          "PageIcon/LevelPre1_Listening.png",
          "PageIcon/Level2_Listening.png",
          "PageIcon/LevelPre2_Listening.png"
        ];

        icons.forEach(src => {
          const img = document.createElement('img');
          img.src = src;
          img.classList.add('item');
          container.appendChild(img);
        });

        // 回転アニメーション（ロジックのみ）
        const items = container.querySelectorAll('.item');
        const radius = 400;
        const centerX = 200;
        const centerY = 200;
        let angle = 0;

        function animate() {
          angle += 0.005;

          items.forEach((item, index) => {
            const theta = angle + index * (2 * Math.PI / items.length);
            const x = centerX + radius * Math.cos(theta);
            const y = centerY + radius * Math.sin(theta);
            item.style.left = `${x - 40}px`;
            item.style.top = `${y - 40}px`;
          });

          requestAnimationFrame(animate);
        }
        animate();
      }
      return this;
    },
    clickLogin: function () {
      if(flag){
        let getAccountID = document.querySelector('.login-input[type="number"]').value;
        let getAccountPW = document.querySelector('.login-input[type="password"]').value;
        let getAccountName;

        if(getAccountID === "")
        {
          alert("ログインIDを入力してください");
          return;
        }

        if(getAccountPW === "")
        {
          alert("ログインPWを入力してください");
          return;
        }
        // API 送信
        fetch("/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: getAccountID, pw: getAccountPW })
        })
        .then(res => res.json())
        .then(data => {
          console.log("ACCOUNT NAME:", data.accountName);  // ★ 追加
          if (data.result === "OK") {
            getAccountName = data.accountName;
            window.location.href = `level/level.html?id=${getAccountID}&name=${getAccountName}`;
            // ここで画面遷移など可能
          } else {
            alert("IDまたはパスワードが間違っています")
          }
        })
        .catch(err => {
          console.error(err);
          alert("サーバーエラー");
        });
      }
      return this;
    },
    clickReset: function () {
      if(flag){
        const getAccountID = document.querySelector('.login-input[type="text"]').value;

        if(getAccountID === "")
        {
          alert("ログインIDを入力してください");
          return;
        }
      }
    },
    settingIcon() {
      const favicon = document.querySelector('#dynamic-favicon');
      favicon.href = "PageIcon/EikenLogin.png";
    }
  };

  active = () => {
    func
      .init()
      .makeAreaContents()
      .settingIcon();
  };

  return { active };
})();

window.addEventListener('load', () => {
  Thisproject.active();
});
