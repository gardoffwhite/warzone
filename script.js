const backend = "https://warzonebackend-3il3.onrender.com";
let currentUser = "";
let currentRole = "";

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch(backend + "/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.user) {
        currentUser = username;
        currentRole = data.user.role;
        document.getElementById("auth-container").style.display = "none";
        document.getElementById("gacha-container").style.display = "block";
        if (currentRole === "admin") {
          document.getElementById("admin-container").style.display = "block";
        }
        document.getElementById("display-username").innerText = username;
        document.getElementById("token-count").innerText = data.user.token;
      } else {
        document.getElementById("auth-message").innerText = data.error;
      }
    });
}

function register() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  fetch(backend + "/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById("auth-message").innerText = data.success ? "สมัครสมาชิกสำเร็จ" : data.error;
    });
}

function logout() {
  location.reload();
}

function rollGacha() {
  const character = document.getElementById("character-name").value;
  fetch(backend + "/gacha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser, character })
  })
    .then(res => res.json())
    .then(data => {
      if (data.item) {
        document.getElementById("gacha-result").innerHTML = \`
          <h3>คุณได้รับ: \${data.item.name}</h3>
          <img src="\${backend}/images/\${data.item.image}" />
        \`;
        document.getElementById("token-count").innerText = data.tokenLeft;
      } else {
        alert(data.error);
      }
    });
}

function updateToken() {
  const targetUser = document.getElementById("target-user").value;
  const amount = parseInt(document.getElementById("token-amount").value);
  fetch(backend + "/admin/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminUser: currentUser, targetUser, amount })
  }).then(() => alert("อัปเดต Token แล้ว"));
}

function uploadImage() {
  const itemId = document.getElementById("item-id").value;
  const file = document.getElementById("item-image").files[0];
  const form = new FormData();
  form.append("image", file);
  form.append("itemId", itemId);
  fetch(backend + "/admin/upload", {
    method: "POST",
    body: form
  }).then(() => alert("อัปโหลดรูปเรียบร้อย"));
}

function updateRates() {
  const rates = {
    sword: parseInt(document.getElementById("rate-sword").value),
    armor: parseInt(document.getElementById("rate-armor").value),
    helmet: parseInt(document.getElementById("rate-helmet").value),
    boots: parseInt(document.getElementById("rate-boots").value)
  };
  fetch(backend + "/admin/rates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ adminUser: currentUser, rates })
  }).then(() => alert("อัปเดตอัตราสุ่มเรียบร้อย"));
}

function loadLogs() {
  fetch(backend + "/admin/logs?adminUser=" + currentUser)
    .then(res => res.json())
    .then(data => {
      const div = document.getElementById("logs");
      div.innerHTML = "<h4>Log ล่าสุด</h4>";
      data.logs.slice(-10).reverse().forEach(log => {
        div.innerHTML += \`
          <p><strong>\${log.username}</strong> (\${log.character}) ได้รับ <em>\${log.item}</em> เวลา \${new Date(log.timestamp).toLocaleString()}</p>
        \`;
      });
    });
}
