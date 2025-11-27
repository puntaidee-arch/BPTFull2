// โหลดข้อมูลจาก localStorage
let data = JSON.parse(localStorage.getItem('photoVault')) || { categories:{} };
let isAdmin = false;

// อ่านรหัสแอดมินจากไฟล์ admin_password.txt
// ในเว็บจริงต้องใช้ backend อ่านไฟล์ สำหรับตัวอย่างนี้กำหนดค่าใน JS
let ADMIN_PASSWORD = "1234"; // แทนการอ่านไฟล์ admin_password.txt

// DOM
const gallery = document.getElementById('gallery');
const catSelect = document.getElementById('categorySelect');
const newCat = document.getElementById('newCategory');

// แสดง gallery
function renderGallery() {
    gallery.innerHTML = '';
    const cat = catSelect.value;
    if(!cat || !data.categories[cat]) return;
    data.categories[cat].forEach((photo,i)=>{
        const div = document.createElement('div');
        div.className = 'photo';
        div.innerHTML = `<img src="${photo.src}" alt="${photo.name}">
                         ${isAdmin?`<button class="delete-btn" onclick="deletePhoto('${cat}',${i})">×</button>`:''}`;
        gallery.appendChild(div);
    });
}

// เพิ่มหมวดหมู่
function addCategory(){
    if(!isAdmin) return alert('เฉพาะแอดมิน');
    const name = newCat.value.trim();
    if(!name) return alert('กรอกชื่อหมวดหมู่');
    if(!data.categories) data.categories = {};
    if(data.categories[name]) return alert('หมวดมีแล้ว');
    data.categories[name] = [];
    saveData();
    loadCategories();
    newCat.value='';
}

// ลบหมวดหมู่
function deleteCategory(){
    if(!isAdmin) return alert('เฉพาะแอดมิน');
    const name = catSelect.value;
    if(!name) return alert('เลือกหมวดหมู่');
    if(confirm(`ลบหมวด ${name} และรูปภาพทั้งหมด?`)){
        delete data.categories[name];
        saveData();
        loadCategories();
    }
}

// ลบรูปภาพ
function deletePhoto(cat,index){
    if(!isAdmin) return;
    if(confirm('ลบรูปภาพ?')){
        data.categories[cat].splice(index,1);
        saveData();
        renderGallery();
    }
}

// โหลดหมวดหมู่
function loadCategories(){
    catSelect.innerHTML='';
    const keys = Object.keys(data.categories);
    keys.forEach(k=>{
        const opt = document.createElement('option');
        opt.value=k; opt.textContent=k;
        catSelect.appendChild(opt);
    });
    renderGallery();
}

// อัปโหลดรูป
document.getElementById('fileInput')?.addEventListener('change',function(e){
    if(!isAdmin) return;
    const cat = catSelect.value;
    if(!cat) return alert('เลือกหมวดก่อนอัปโหลด');
    const files = Array.from(e.target.files);
    files.forEach(file=>{
        const reader = new FileReader();
        reader.onload = function(ev){
            data.categories[cat].push({name:file.name, src:ev.target.result});
            saveData();
            renderGallery();
        }
        reader.readAsDataURL(file);
    });
});

// บันทึก localStorage
function saveData(){ localStorage.setItem('photoVault',JSON.stringify(data)); }

// เริ่มต้น
function adminLogin(){
    const pass = prompt('รหัสแอดมิน:');
    if(pass===ADMIN_PASSWORD){
        isAdmin=true;
        document.getElementById('adminBadge')?.style.display='inline-block';
        loadCategories();
        alert('เข้าสู่ระบบแอดมินสำเร็จ');
    } else alert('รหัสไม่ถูกต้อง');
}

// ถ้าเป็น admin.html ให้ล็อกอิน
if(location.pathname.includes('admin.html')) adminLogin();

catSelect?.addEventListener('change', renderGallery);
