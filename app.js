// LOST & FOUND ID - FINAL PUBLIC + WA FIX
let reports = [];
let activeFilter = 'all';
let currentImageData = null;

const C = window._FB;
const db = window._DB;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  const q = C.query(C.collection(db, "reports"), C.orderBy("createdAt", "desc"));
  
  C.onSnapshot(q, (snapshot) => {
    reports = [];
    snapshot.forEach((doc) => {
      reports.push({ id: doc.id, ...doc.data() });
    });
    renderReports();
    updateStats();
    const loading = document.getElementById('loading');
    const grid = document.getElementById('reportsGrid');
    if(loading) loading.style.display = 'none';
    if(grid) grid.style.display = 'grid';
  });

  setupEvents();
}

function setupEvents() {
  const form = document.getElementById('reportForm');
  if(form) form.addEventListener('submit', handleSubmit);
  
  const imgInput = document.getElementById('image');
  if(imgInput) imgInput.addEventListener('change', handleImage);

  const search = document.getElementById('search');
  if(search) search.addEventListener('input', () => renderReports());

  const filterType = document.getElementById('filterType');
  if(filterType) filterType.addEventListener('change', () => renderReports());

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeFilter = e.target.dataset.filter;
      renderReports();
    });
  });

  const desc = document.getElementById('description');
  const charCount = document.getElementById('charCount');
  if(desc && charCount) {
    desc.addEventListener('input', () => { charCount.textContent = desc.value.length; });
  }
}

async function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.textContent = 'Mengirim...';
  
  try {
    const fd = new FormData(e.target);
    let wa = fd.get('contactInfo').trim().replace(/[^0-9]/g, '');
    if(wa.startsWith('0')) wa = '62' + wa.slice(1);
    if(wa.startsWith('62') === false && wa.length > 5) wa = '62' + wa;

    const data = {
      type: fd.get('type'),
      category: fd.get('category'),
      title: fd.get('title').trim(),
      description: fd.get('description').trim(),
      location: fd.get('location').trim(),
      contactName: fd.get('contactName').trim(),
      contactInfo: wa,
      image: currentImageData || null,
      status: 'active',
      createdAt: Date.now()
    };

    await C.addDoc(C.collection(db, "reports"), data);
    e.target.reset();
    currentImageData = null;
    const preview = document.getElementById('imagePreview');
    if(preview) preview.innerHTML = '';
    const cc = document.getElementById('charCount');
    if(cc) cc.textContent = '0';
    alert('BERHASIL! Laporan lu udah PUBLIK! Semua orang bisa lihat!');
  } catch(err) {
    alert('Gagal: ' + err.message);
  } finally {
    btn.disabled = false;
    btn.textContent = 'Kirim Laporan';
  }
}

function handleImage(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      const maxW = 800;
      if(w > maxW) { h = h * maxW / w; w = maxW; }
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      currentImageData = canvas.toDataURL('image/jpeg', 0.7);
      const preview = document.getElementById('imagePreview');
      if(preview) preview.innerHTML = `<img src="${currentImageData}" style="max-width:200px;border-radius:12px;margin-top:10px">`;
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

function renderReports() {
  const grid = document.getElementById('reportsGrid');
  if(!grid) return;
  const search = (document.getElementById('search')?.value || '').toLowerCase();
  const typeF = document.getElementById('filterType')?.value || 'all';
  
  let filtered = reports.filter(r => {
    if(r.status === 'resolved') return false;
    const matchType = typeF === 'all' || r.type === typeF;
    const matchBtn = activeFilter === 'all' || r.type === activeFilter;
    const matchSearch = !search || (r.title + r.description + r.location).toLowerCase().includes(search);
    return matchType && matchBtn && matchSearch;
  });

  if(filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px">Belum ada laporan aktif</div>`;
    return;
  }

  grid.innerHTML = filtered.map(r => {
    const waText = encodeURIComponent(`Halo ${r.contactName}, saya lihat laporan "${r.title}" di Lost&Found ID. Lokasi: ${r.location}. Apakah masih tersedia?`);
    const waLink = `https://wa.me/${r.contactInfo}?text=${waText}`;
    return `
    <div class="card ${r.type}">
      ${r.image ? `<img src="${r.image}" class="card-img">` : ''}
      <div class="card-body">
        <span class="badge ${r.type}">${r.type === 'lost' ? 'HILANG' : 'DITEMUKAN'}</span>
        <h3>${r.title}</h3>
        <p>${r.description.substring(0, 100)}...</p>
        <div class="meta">📍 ${r.location} - ${new Date(r.createdAt).toLocaleDateString('id-ID')}</div>
        <a href="${waLink}" target="_blank" class="wa-btn">💬 Hubungi ${r.contactName} via WA</a>
        <button onclick="markResolved('${r.id}')" class="resolve-btn">Tandai Selesai</button>
      </div>
    </div>`;
  }).join('');
}

window.markResolved = async(id) => {
  if(!confirm('Tandai laporan ini selesai?')) return;
  await C.updateDoc(C.doc(db, "reports", id), { status: 'resolved' });
};

function updateStats() {
  const active = reports.filter(r => r.status !== 'resolved');
  const t = document.getElementById('statTotal');
  const l = document.getElementById('statLost');
  const f = document.getElementById('statFound');
  if(t) t.textContent = active.length;
  if(l) l.textContent = active.filter(r => r.type === 'lost').length;
  if(f) f.textContent = active.filter(r => r.type === 'found').length;
                                     }
