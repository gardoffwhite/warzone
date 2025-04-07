const API_BASE = "https://warzonebackend-3il3.onrender.com"; // ← เปลี่ยนเป็นของคุณ
let currentUser = null;

function toggleRegister() {
  document.getElementById("loginBox").classList.toggle("hidden");
  document.getElementById("registerBox").classList.toggle("hidden");
}

async function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("registerConfirmPassword").value;

  if (!username || !password || !confirmPassword)
    return alert("กรุณากรอกข้อมูลให้ครบถ้วน");
  if (password !== confirmPassword)
    return alert("รหัสผ่านไม่ตรงกัน");

  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "สมัครไม่สำเร็จ");

  alert("สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
  toggleRegister();
}

async function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) return alert("กรุณากรอกชื่อผู้ใช้และรหัสผ่าน");

  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "เข้าสู่ระบบไม่สำเร็จ");

  alert(`ยินดีต้อนรับ ${username}!`);
  currentUser = data.user;

  document.getElementById("loginBox").classList.add("hidden");
  document.getElementById("mainApp").classList.remove("hidden");

  updateTokenDisplay();
}

async function gacha() {
  if (!currentUser) return alert("กรุณาเข้าสู่ระบบ");

  const res = await fetch(`${API_BASE}/gacha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: currentUser.username }),
  });

  const data = await res.json();
  if (!res.ok) return alert(data.error || "สุ่มล้มเหลว");

  alert(`🎉 คุณได้รับ: ${data.item}`);
  currentUser.token = data.tokenLeft;
  updateTokenDisplay();
}

function updateTokenDisplay() {
  document.getElementById("tokenCount").textContent = currentUser.token;
}

document.getElementById("gachaButton").onclick = gacha;
