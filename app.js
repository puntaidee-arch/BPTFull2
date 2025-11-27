// ----------------- Settings -----------------
const ADMIN_PASSWORD_FILE = 'admin_password.txt';
let isAdmin = false;
let data = {categories:{}}; // {categoryName:[{name,url}]}

// ----------------- DOM -----------------
const catSelect = document.getElementById('categorySelect');
const gallery = document.getElementById('gallery');
const adminGallery = document.getElementById('adminGallery');

// ----------------- Helpers -----------------
function showToast(msg,isError=false){
    const t = document.createElement('div');
    t.style.position='fixed'; t.style.bottom='20px'; t.style.left='50%';
    t.style.transform='translateX(-50%)'; t.style.padding='10px 20px';
    t.style.background=isError?'#ff5555':'#22ff77'; t.style.color='#000';
    t.style.borderRadius='10px'; t.style.zIndex='9999'; t.textContent=msg;
    document.body.appendChild(t);
    setTimeout(()=>t.remove(),3000);
}

// ----------------- Load Gallery -----------------
function loadGallery(){
    catSelect.innerHTML='';
    Object.keys(data.categories).forEach(cat=>{
        const opt = document.createElement('option'); opt.value=cat; opt.textContent=cat; catSelect.appendChild(opt);
    });
    renderGallery();
}

// ----------------- Render Gallery -----------------
function renderGallery(){
    const category = catSelect.value;
    if(!gallery) return;
    gallery.innerHTML='';
    if(!data.categories[category]) { gallery.innerHTML='<p>ยังไม่มีรูปภาพ</p>'; return; }
    data.categories[category].forEach(p=>{
        const div = document.createElement('div'); div.className='photo';
        div.innerHTML=`<img src="${p.url}" alt="${p.name}"><div class="photo-name">${p.name}</div>`;
        gallery.appendChild(div);
    });
}

// ----------------- Admin Render -----------------
function renderAdminGallery(){
    if(!adminGallery) return;
    adminGallery.innerHTML='';
    const category = catSelect.value;
    if(!data.categories[category]) return;
    data.categories[category].forEach((p,index)=>{
        const div = document.createElement('div'); div.className='adminPhoto';
        div.innerHTML=`<img src="${p.url}" alt="${p.name}"><div class="adminPhoto-name">${p.name}</div>
        <button onclick="deletePhoto('${category}',${index})">ลบ</button>`;
        adminGallery.appendChild(div);
    });
}

// ----------------- Admin CRUD -----------------
function addCategory(){
    const name = prompt('ชื่อหมวดหมู่ใหม่:');
    if(!name) return;
    if(data.categories[name]) { showToast('หมวดนี้มีแล้ว',true); return; }
    data.categories[name]=[];
    loadGallery();
    renderAdminGallery();
}

function deleteCategory(){
    const name = catSelect.value;
    if(!confirm(`ลบหมวด ${name}?`)) return;
    delete data.categories[name];
    loadGallery();
    renderAdminGallery();
}

function upload(){
    const file = document.getElementById('fileInput').files[0];
    if(!file) { showToast('ยังไม่ได้เลือกไฟล์',true); return; }
    const reader = new FileReader();
    reader.onload = e=>{
        const category = catSelect.value;
        data.categories[category].push({name:file.name,url:e.target.result});
        renderGallery();
        renderAdminGallery();
        showToast('อัปโหลดเรียบร้อย');
    };
    reader.readAsDataURL(file);
}

function deletePhoto(category,index){
    if(!confirm('ลบรูปภาพนี้?')) return;
    data.categories[category].splice(index,1);
    renderGallery();
    renderAdminGallery();
}

// ----------------- Login -----------------
function login(pass){
    fetch(ADMIN_PASSWORD_FILE).then(r=>r.text()).then(correct=>{
        if(pass.trim()===correct.trim()){
            isAdmin=true;
            document.querySelectorAll('.admin-only').forEach(el=>el.style.display='inline-block');
            showToast('เข้าสู่ระบบสำเร็จ');
            renderAdminGallery();
        } else showToast('รหัสไม่ถูกต้อง',true);
    });
}

// ----------------- Events -----------------
if(catSelect) catSelect.addEventListener('change',()=>{
    renderGallery();
    renderAdminGallery();
});
