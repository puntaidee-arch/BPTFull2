/* ---------------------------
   LOGIN SYSTEM
---------------------------- */

async function readPasswordFile(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = e => resolve(e.target.result.trim());
        r.onerror = reject;
        r.readAsText(file);
    });
}

async function loginAdmin() {
    const pass = document.getElementById("adminPass").value;
    const fileInput = document.getElementById("pwdFile");

    if (!fileInput.files.length) {
        document.getElementById("loginStatus").innerText = "กรุณาเลือกไฟล์รหัส";
        return;
    }

    const raw = await readPasswordFile(fileInput.files[0]);
    let correct = null;

    if (raw.startsWith("ADMIN_PASSWORD=")) {
        correct = raw.split("=")[1];
    } else if (raw.startsWith("ADMIN_PASSWORD_BASE64=")) {
        correct = atob(raw.split("=")[1]);
    }

    if (pass === correct) {
        localStorage.setItem("isAdmin", "1");
        location.href = "admin.html";
    } else {
        document.getElementById("loginStatus").innerText = "รหัสผ่านไม่ถูกต้อง";
    }
}

if (location.pathname.includes("admin.html")) {
    if (localStorage.getItem("isAdmin") !== "1") {
        alert("ต้องล็อกอินก่อน");
        location.href = "index.html";
    }
}

function logoutAdmin() {
    localStorage.removeItem("isAdmin");
    location.href = "index.html";
}

/* ---------------------------
   CATEGORY CRUD
---------------------------- */

function getCategories() {
    return JSON.parse(localStorage.getItem("categories") || "[]");
}

function saveCategories(list) {
    localStorage.setItem("categories", JSON.stringify(list));
}

function addCategory() {
    const name = document.getElementById("newCategory").value.trim();
    if (!name) return;

    const cats = getCategories();
    if (cats.includes(name)) {
        alert("มีหมวดนี้แล้ว");
        return;
    }

    cats.push(name);
    saveCategories(cats);
    loadCategoryList();
    loadCategorySelect();
}

function deleteCategory(name) {
    if (!confirm("ลบหมวดนี้?")) return;

    const cats = getCategories().filter(c => c !== name);
    saveCategories(cats);

    localStorage.removeItem("photos_" + name);

    loadCategoryList();
    loadCategorySelect();
}

function loadCategoryList() {
    if (!document.getElementById("categoryList")) return;

    const cats = getCategories();
    const ul = document.getElementById("categoryList");
    ul.innerHTML = "";

    cats.forEach(cat => {
        ul.innerHTML += `
            <li>
                ${cat}
                <button onclick="deleteCategory('${cat}')">ลบ</button>
            </li>
        `;
    });
}

/* ---------------------------
   PHOTO CRUD
---------------------------- */

function getPhotos(cat) {
    return JSON.parse(localStorage.getItem("photos_" + cat) || "[]");
}

function savePhotos(cat, arr) {
    localStorage.setItem("photos_" + cat, JSON.stringify(arr));
}

function uploadPhotos() {
    const cat = document.getElementById("categorySelect").value;
    const files = document.getElementById("uploadImages").files;

    if (!files.length) {
        alert("เลือกรูปก่อน");
        return;
    }

    const tasks = [];

    for (let file of files) {
        const r = new FileReader();
        const p = new Promise(resolve => {
            r.onload = e => resolve(e.target.result);
        });
        r.readAsDataURL(file);
        tasks.push(p);
    }

    Promise.all(tasks).then(results => {
        const arr = getPhotos(cat);
        results.forEach(img => arr.push(img));
        savePhotos(cat, arr);
        loadPhotos();
    });
}

function deletePhoto(cat, index) {
    const arr = getPhotos(cat);
    arr.splice(index, 1);
    savePhotos(cat, arr);
    loadPhotos();
}

function loadPhotos() {
    if (!document.getElementById("photoContainer")) return;

    const cat = document.getElementById("categorySelect").value;
    const arr = getPhotos(cat);

    const box = document.getElementById("photoContainer");
    box.innerHTML = "";

    arr.forEach((img, i) => {
        box.innerHTML += `
            <div class="photo-card">
                <img src="${img}">
                <button onclick="deletePhoto('${cat}', ${i})">ลบรูป</button>
            </div>
        `;
    });
}

/* ---------------------------
   USER VIEW (INDEX.HTML)
---------------------------- */

function loadUserCategories() {
    const box = document.getElementById("categoryListUser");
    if (!box) return;

    const cats = getCategories();
    box.innerHTML = "";

    cats.forEach(cat => {
        box.innerHTML += `
            <div class="category-card">${cat}</div>
        `;
    });
}

/* ---------------------------
   INITIALIZER
---------------------------- */

window.onload = () => {
    loadCategoryList();
    loadCategorySelect();
    loadUserCategories();
};
