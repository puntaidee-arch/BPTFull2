let adminPassword = "";
let loggedIn = false;
let currentView = "grid";
let currentCategory = "";

// โหลดรหัสจากไฟล์ในเครื่อง (ไม่ขึ้น GitHub)
async function loadLocalPassword() {
    try {
        const res = await fetch("admin_password.txt");
        adminPassword = (await res.text()).trim();
    } catch (e) {
        console.warn("⚠ admin_password.txt ไม่ถูกโหลด (ไฟล์นี้เก็บใน PC เท่านั้น)");
    }
}

loadLocalPassword();

// ---------------------------
// 🔐 LOGIN
// ---------------------------
function login() {
    const input = document.getElementById("passwordInput").value;

    if (input === adminPassword) {
        loggedIn = true;
        document.getElementById("loginBox").classList.add("hidden");
        document.getElementById("mainApp").classList.remove("hidden");
    } else {
        document.getElementById("loginStatus").innerText = "❌ รหัสไม่ถูกต้อง";
    }
}

// ---------------------------
// 🚪 LOGOUT
// ---------------------------
function logout() {
    loggedIn = false;
    document.getElementById("mainApp").classList.add("hidden");
    document.getElementById("loginBox").classList.remove("hidden");
}


// ---------------------------
// 🗂 หมวดหมู่จำลอง (แก้ตามของจริงได้)
// ---------------------------
const categories = {
    "พระสมเด็จ": [
        "https://placehold.co/300x300",
        "https://placehold.co/300x301"
    ],
    "พระผง": [
        "https://placehold.co/300x302",
        "https://placehold.co/300x303"
    ],
    "พระเนื้อชิน": [
        "https://placehold.co/300x304"
    ]
};

// ---------------------------
// 📌 render หมวดหมู่
// ---------------------------
function renderCategories() {
    const ul = document.getElementById("categoryList");
    ul.innerHTML = "";

    Object.keys(categories).forEach(cat => {
        const li = document.createElement("li");
        li.innerHTML = `<button onclick="openCategory('${cat}')">${cat}</button>`;
        ul.appendChild(li);
    });
}

// ---------------------------
// 📸 เปิดหมวดหมู่
// ---------------------------
function openCategory(cat) {
    currentCategory = cat;
    document.getElementById("sectionTitle").innerText = cat;

    const container = document.getElementById("photoContainer");
    container.innerHTML = "";

    categories[cat].forEach(url => {
        const div = document.createElement("div");
        div.classList.add("photo-item");

        div.innerHTML = `<img src="${url}">`;

        container.appendChild(div);
    });

    setView(currentView);
}

// ---------------------------
// 🖼 สลับมุมมอง กริด / ลิสต์
// ---------------------------
function setView(view) {
    currentView = view;

    const box = document.getElementById("photoContainer");

    if (view === "grid") {
        box.classList.remove("list");
        box.classList.add("grid");
    } else {
        box.classList.remove("grid");
        box.classList.add("list");
    }
}

// โหลดตอนเริ่ม
renderCategories();
