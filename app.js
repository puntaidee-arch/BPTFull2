let isAdmin = false;
let data = JSON.parse(localStorage.getItem('photoVault')) || { categories:{} };

// --- ฟังก์ชันทั่วไป ---
function renderGallery(admin=true) {
  const gallery = document.getElementById('gallery');
  if(!gallery) return;
  gallery.innerHTML = '';
  const cat = Object.keys(data.categories)[0];
  if(!cat || data.categories[cat].length===0){
    gallery.innerHTML = '<p style="text-align:center;">ยังไม่มีรูปภาพ</p>';
    return;
  }
  data.categories[cat].forEach((p,i)=>{
    const div = document.createElement('div');
    div.className='photo';
    div.innerHTML = `<img src="${p.src}" alt="${p.name}"><div class="photo-name">${p.name}</div>`;
    gallery.appendChild(div);
  });
}

// --- ระบบ Admin ---
function initAdmin(){
  // load category
  const catSelect = document.getElementById('categorySelect');
  if(catSelect) {
    catSelect.innerHTML = '';
    Object.keys(data.categories).forEach(c=>{
      const opt = document.createElement('option');
      opt.value = c; opt.textContent = c;
      catSelect.appendChild(opt);
    });
  }
}

// login
function loginAdmin(){
  const pass = document.getElementById('adminPass').value;
  fetch('admin_password.txt').then(r=>r.text()).then(adminPass=>{
    if(pass.trim()===adminPass.trim()){
      isAdmin=true;
      document.getElementById('loginSection').style.display='none';
      document.getElementById('adminPanel').style.display='block';
      renderGallery();
      initAdmin();
      alert('เข้าสู่ระบบสำเร็จ');
    } else alert('รหัสไม่ถูกต้อง');
  });
}

// เพิ่มหมวดหมู่
function addCategory(){
  const name = document.getElementById('newCategory').value.trim();
  if(!name) return alert('กรุณากรอกชื่อหมวด');
  if(data.categories[name]) return alert('มีหมวดนี้แล้ว');
  data.categories[name]=[];
  localStorage.setItem('photoVault', JSON.stringify(data));
  initAdmin();
  renderGallery();
}

// ลบหมวดหมู่
function deleteCategory(){
  const cat = document.getElementById('categorySelect').value;
  if(!cat) return;
  delete data.categories[cat];
  localStorage.setItem('photoVault', JSON.stringify(data));
  initAdmin();
  renderGallery();
}

// อัปโหลดรูป
function uploadImages(){
  const files = document.getElementById('fileInput').files;
  const cat = document.getElementById('categorySelect').value;
  if(!cat) return alert('เลือกหมวดก่อน');
  Array.from(files).forEach(f=>{
    const reader = new FileReader();
    reader.onload = e=>{
      data.categories[cat].push({name:f.name, src:e.target.result});
      localStorage.setItem('photoVault', JSON.stringify(data));
      renderGallery();
    };
    reader.readAsDataURL(f);
  });
}
