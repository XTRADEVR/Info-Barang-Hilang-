/**
 * Papan Informasi Barang & Hewan Hilang (Lost & Found PWA)
 * Complete Mobile-First Application Logic
 */

// Global Application State
window.__LOST_AND_FOUND_APP_LOADED__ = true;

const STORAGE_KEY = 'lost_and_found_items_v1';
const THEME_KEY = 'lost_and_found_theme';

const state = {
  items: [],
  statusFilter: 'all', // 'all' | 'dicari' | 'ketemu'
  typeFilter: 'all',   // 'all' | 'hewan' | 'barang'
  searchQuery: '',
  deferredPrompt: null,
  activeDetailItem: null,
  uploadedPhotoBase64: null
};

// Initial Fallback Data
const DEFAULT_ITEMS = [
  {
    id: 'item-persia-miko',
    type: 'hewan',
    category: 'Kucing',
    status: 'dicari',
    reportType: 'kehilangan',
    title: 'Kucing Persia Putih (Miko)',
    description: 'Kucing persia berbulu putih lebat, hidung pesek, mata kuning kecokelatan. Hilang saat pintu pagar terbuka pada pagi hari. Terakhir terlihat mengenakan kalung pita biru dengan lonceng kecil.',
    traits: ['Bulu putih panjang', 'Mata kuning amber', 'Kalung pita biru', 'Sangat jinak'],
    location: 'Komplek Bintaro Jaya Sektor 7, Tangerang Selatan',
    date: '2026-10-19',
    reward: 'Rp 500.000',
    contactName: 'Sarah Wijaya',
    contactPhone: '081287654321',
    photoUrl: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 2
  },
  {
    id: 'item-dompet-braun',
    type: 'barang',
    category: 'Dompet & Dokumen',
    status: 'dicari',
    reportType: 'kehilangan',
    title: 'Dompet Kulit Cokelat Braun Buffel',
    description: 'Dompet kulit pria warna cokelat tua berisi KTP atas nama Dimas Arya, SIM A, kartu Flazz BCA, dan beberapa kartu ATM. Tertinggal di kursi tunggu gerbong 4 commuter line.',
    traits: ['Warna cokelat tua bermotif banteng', 'Goresan halus di sudut', 'Ada foto keluarga'],
    location: 'Stasiun KRL Manggarai / Jalur Bogor',
    date: '2026-10-20',
    reward: 'Uang tunai + Ucapan Terima Kasih',
    contactName: 'Dimas Arya',
    contactPhone: '081312345678',
    photoUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'item-corgi-oreo',
    type: 'hewan',
    category: 'Anjing',
    status: 'ketemu',
    reportType: 'kehilangan',
    title: 'Anjing Corgi Tricolor (Oreo)',
    description: 'Alhamdulillah Oreo sudah berhasil kembali berkat laporan warga sekitar taman! Terima kasih atas bantuan semua teman-teman di komunitas.',
    traits: ['Telinga tegak besar', 'Ekor pendek alami', 'Bulu belang hitam putih cokelat'],
    location: 'Taman Suropati, Menteng, Jakarta Pusat',
    date: '2026-10-18',
    reward: 'Selesai (Sudah Ketemu)',
    contactName: 'Budi Santoso',
    contactPhone: '08119876543',
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 3
  },
  {
    id: 'item-iphone-purple',
    type: 'barang',
    category: 'Gadget',
    status: 'dicari',
    reportType: 'kehilangan',
    title: 'iPhone 14 Pro Max Deep Purple',
    description: 'iPhone 14 Pro Max 256GB dengan casing bening MagSafe. Hilang di area outdoor cafe Kopi Nako Tebet. Nomor IMEI sudah dilaporkan.',
    traits: ['Warna Deep Purple', 'Case MagSafe transparan', 'Tempered glass retak helai di pojok'],
    location: 'Kopi Nako Tebet, Jakarta Selatan',
    date: '2026-10-20',
    reward: 'Rp 1.500.000',
    contactName: 'Kevin Pratama',
    contactPhone: '085712349876',
    photoUrl: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 43200000
  },
  {
    id: 'item-kunci-pcx',
    type: 'barang',
    category: 'Kunci Kendaraan',
    status: 'dicari',
    reportType: 'kehilangan',
    title: 'Kunci Smartkey Motor Honda PCX 160',
    description: 'Kunci remote keyless Honda warna hitam dengan gantungan rajut kulit merah dan barcode darurat. Terjatuh di parkiran barat mall.',
    traits: ['Smartkey Honda 3 tombol', 'Gantungan anyaman merah', 'Plat nomor darurat'],
    location: 'Parkiran Motor Gandaria City, Kebayoran Lama',
    date: '2026-10-21',
    reward: 'Rp 250.000',
    contactName: 'Rian Ardiansyah',
    contactPhone: '087812984567',
    photoUrl: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 21600000
  },
  {
    id: 'item-lovebird-lutino',
    type: 'hewan',
    category: 'Burung',
    status: 'ketemu',
    reportType: 'kehilangan',
    title: 'Burung Lovebird Biola Lutino (Kuning)',
    description: 'Sudah ditemukan hinggap di dahan pohon mangga tetangga dan telah diamankan dengan selamat oleh pemilik. Terima kasih atas doa dan infonya.',
    traits: ['Bulu kuning cerah kepala oranye', 'Ring perak bertuliskan JKT-09', 'Lincah bersiul'],
    location: 'Jl. Kaliurang KM 5, Sleman, Yogyakarta',
    date: '2026-10-17',
    reward: 'Selesai (Sudah Ketemu)',
    contactName: 'Eko Prasetyo',
    contactPhone: '081512340000',
    photoUrl: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
    createdAt: Date.now() - 86400000 * 4
  }
];

// Utility: Clean & Format Indonesian WhatsApp Phone Number
function formatWhatsAppPhone(phone) {
  if (!phone) return '';
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '62' + clean.slice(1);
  } else if (clean.startsWith('8')) {
    clean = '62' + clean;
  }
  return clean;
}

// Generate direct WhatsApp click-to-chat URL
function getWhatsAppUrl(phone, title, contactName) {
  const cleanPhone = formatWhatsAppPhone(phone);
  const text = encodeURIComponent(
    `Halo ${contactName || 'Kak'}, saya melihat laporan Anda di Papan Informasi Lost & Found mengenai: "${title}". Saya ingin berkoordinasi terkait informasi ini.`
  );
  return `https://wa.me/${cleanPhone}?text=${text}`;
}

// Show Toast Notification
function showToast(message) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.querySelector('.toast-text').textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Load Data from LocalStorage or Default
function loadItems() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      state.items = JSON.parse(stored);
    } else {
      state.items = [...DEFAULT_ITEMS];
      saveItems();
    }
  } catch (err) {
    console.warn('Error loading items from localStorage:', err);
    state.items = [...DEFAULT_ITEMS];
  }
}

// Save Data to LocalStorage
function saveItems() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
}

// Update Top Statistics Numbers
function updateStats() {
  const total = state.items.length;
  const dicari = state.items.filter(i => i.status === 'dicari').length;
  const ketemu = state.items.filter(i => i.status === 'ketemu').length;

  const elTotal = document.getElementById('statTotal');
  const elDicari = document.getElementById('statDicari');
  const elKetemu = document.getElementById('statKetemu');

  if (elTotal) elTotal.textContent = total;
  if (elDicari) elDicari.textContent = dicari;
  if (elKetemu) elKetemu.textContent = ketemu;
}

// Render Feed Grid
function renderFeed() {
  const container = document.getElementById('feedGrid');
  const emptyState = document.getElementById('emptyState');
  if (!container) return;

  // Filter items
  const query = state.searchQuery.toLowerCase().trim();
  const filtered = state.items.filter(item => {
    // Status filter
    if (state.statusFilter !== 'all' && item.status !== state.statusFilter) {
      return false;
    }
    // Type filter
    if (state.typeFilter !== 'all' && item.type !== state.typeFilter) {
      return false;
    }
    // Search query
    if (query) {
      const titleMatch = item.title.toLowerCase().includes(query);
      const descMatch = item.description.toLowerCase().includes(query);
      const locMatch = item.location.toLowerCase().includes(query);
      const catMatch = item.category.toLowerCase().includes(query);
      const traitMatch = (item.traits || []).some(t => t.toLowerCase().includes(query));
      return titleMatch || descMatch || locMatch || catMatch || traitMatch;
    }
    return true;
  });

  // Sort: 'dicari' first, then newer date
  filtered.sort((a, b) => {
    if (a.status === 'dicari' && b.status !== 'dicari') return -1;
    if (a.status !== 'dicari' && b.status === 'dicari') return 1;
    return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (filtered.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.style.display = 'block';
    return;
  }

  if (emptyState) emptyState.style.display = 'none';

  container.innerHTML = filtered.map(item => {
    const isDicari = item.status === 'dicari';
    const statusLabel = isDicari ? '🔍 Dicari' : '✅ Sudah Ketemu';
    const statusClass = isDicari ? 'status-dicari' : 'status-ketemu';
    const typeLabel = item.type === 'hewan' ? '🐾 Hewan' : '🎒 Barang';
    const waUrl = getWhatsAppUrl(item.contactPhone, item.title, item.contactName);
    const photo = item.photoUrl || (item.type === 'hewan' 
      ? 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80' 
      : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80');

    const traitsHtml = (item.traits || []).slice(0, 3).map(trait => 
      `<span class="trait-tag">${escapeHtml(trait)}</span>`
    ).join('');

    const rewardHtml = item.reward && item.reward.trim() !== '' && !item.reward.includes('Selesai')
      ? `<div class="card-reward-box">🎁 Imbalan: ${escapeHtml(item.reward)}</div>`
      : '';

    return `
      <article class="card-item" data-id="${item.id}">
        <div class="card-image-box" onclick="window.openDetailModal('${item.id}')">
          <img src="${escapeHtml(photo)}" alt="${escapeHtml(item.title)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80'">
          <span class="card-badge-status ${statusClass}">${statusLabel}</span>
          <span class="card-badge-type">${typeLabel} • ${escapeHtml(item.category || '')}</span>
        </div>
        <div class="card-body">
          <div class="card-date-cat">
            <span>📅 ${escapeHtml(item.date || 'Baru ini')}</span>
            <span>Oleh: <strong>${escapeHtml(item.contactName || 'Anonim')}</strong></span>
          </div>
          <h3 class="card-title" onclick="window.openDetailModal('${item.id}')">${escapeHtml(item.title)}</h3>
          <p class="card-desc">${escapeHtml(item.description)}</p>
          
          <div class="traits-container">
            ${traitsHtml}
          </div>

          <div class="card-meta-row">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span>${escapeHtml(item.location || 'Lokasi tidak disebutkan')}</span>
          </div>

          ${rewardHtml}

          <div class="card-footer">
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa" title="Hubungi via WhatsApp">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/>
              </svg>
              <span>Hubungi WA</span>
            </a>
            <button class="btn-details" onclick="window.openDetailModal('${item.id}')">
              Detail
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// Escape HTML for XSS prevention
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Open Detail Modal
window.openDetailModal = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  state.activeDetailItem = item;
  const modal = document.getElementById('detailModal');
  const body = document.getElementById('detailModalContent');
  if (!modal || !body) return;

  const isDicari = item.status === 'dicari';
  const statusLabel = isDicari ? '🔍 Sedang Dicari' : '✅ Sudah Ditemukan / Selesai';
  const statusClass = isDicari ? 'status-dicari' : 'status-ketemu';
  const typeLabel = item.type === 'hewan' ? '🐾 Hewan Peliharaan' : '🎒 Barang / Benda';
  const waUrl = getWhatsAppUrl(item.contactPhone, item.title, item.contactName);
  const photo = item.photoUrl || (item.type === 'hewan' 
    ? 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80' 
    : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80');

  const traitsHtml = (item.traits || []).map(t => `<span class="trait-tag">${escapeHtml(t)}</span>`).join('');
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item.location)}`;

  body.innerHTML = `
    <div>
      <img src="${escapeHtml(photo)}" alt="${escapeHtml(item.title)}" class="detail-hero-img">
    </div>

    <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px;">
      <span class="detail-status-pill ${statusClass}">${statusLabel}</span>
      <span style="font-size: 12px; color: var(--text-muted);">${typeLabel} • ${escapeHtml(item.category || '')}</span>
    </div>

    <div>
      <h2 style="font-size: 20px; font-weight: 800; line-height: 1.3; margin-bottom: 4px;">${escapeHtml(item.title)}</h2>
      <p style="font-size: 12px; color: var(--text-muted);">Dilaporkan tanggal: ${escapeHtml(item.date || '-')}</p>
    </div>

    ${item.reward ? `<div class="card-reward-box" style="margin: 0;">🎁 Info Imbalan: ${escapeHtml(item.reward)}</div>` : ''}

    <div>
      <div class="detail-section-title">Deskripsi Lengkap & Kejadian</div>
      <p style="font-size: 14px; color: var(--text-secondary); line-height: 1.6;">${escapeHtml(item.description)}</p>
    </div>

    <div>
      <div class="detail-section-title">Ciri-Ciri Khusus / Tanda Pengenal</div>
      <div class="traits-container" style="margin-top: 6px;">
        ${traitsHtml || '<span style="font-size: 12px; color: var(--text-muted);">Tidak ada tanda khusus spesifik.</span>'}
      </div>
    </div>

    <div>
      <div class="detail-section-title">Lokasi Terakhir Dilihat</div>
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-top: 4px;">
        <span style="font-size: 13.5px; color: var(--text-primary); font-weight: 500;">📍 ${escapeHtml(item.location)}</span>
        <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 12px; color: var(--primary); font-weight: 600; text-decoration: underline; white-space: nowrap;">Buka Peta</a>
      </div>
    </div>

    <div class="detail-owner-card">
      <div class="owner-info">
        <h4>${escapeHtml(item.contactName || 'Pemilik / Pelapor')}</h4>
        <p>Kontak WhatsApp: <strong>${escapeHtml(item.contactPhone || '-')}</strong></p>
      </div>
      <button class="btn-input-addon" onclick="window.shareItem('${item.id}')" title="Bagikan Laporan">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        Bagikan
      </button>
    </div>

    <div style="display: flex; gap: 10px; margin-top: 6px;">
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-wa" style="padding: 12px;">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z"/></svg>
        <span>Hubungi via WhatsApp</span>
      </a>
      <button class="btn-details" onclick="window.toggleItemStatus('${item.id}')" style="white-space: nowrap;">
        ${isDicari ? 'Tandai Selesai / Ketemu' : 'Tandai Masih Dicari'}
      </button>
    </div>
  `;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Close Modals
window.closeAllModals = function() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
};

// Toggle Item Status (Dicari <-> Ketemu)
window.toggleItemStatus = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const newStatus = item.status === 'dicari' ? 'ketemu' : 'dicari';
  item.status = newStatus;
  saveItems();
  updateStats();
  renderFeed();
  window.closeAllModals();
  showToast(`Status berhasil diubah menjadi: ${newStatus === 'ketemu' ? 'Sudah Ketemu' : 'Dicari'}`);
};

// Web Share API
window.shareItem = function(id) {
  const item = state.items.find(i => i.id === id);
  if (!item) return;

  const shareData = {
    title: `[LOST & FOUND] ${item.title}`,
    text: `Tolong bantu pantau: ${item.title} (${item.status === 'dicari' ? 'Dicari' : 'Ketemu'}). Lokasi: ${item.location}. Ciri: ${item.description}`,
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${shareData.text} - ${shareData.url}`).then(() => {
      showToast('Informasi disalin ke clipboard!');
    });
  }
};

// Open Post Modal
window.openPostModal = function() {
  const modal = document.getElementById('postModal');
  const form = document.getElementById('postForm');
  if (!modal || !form) return;

  form.reset();
  state.uploadedPhotoBase64 = null;
  const preview = document.getElementById('uploadPreview');
  const placeholder = document.getElementById('uploadPlaceholder');
  if (preview) preview.style.display = 'none';
  if (placeholder) placeholder.style.display = 'flex';

  // Set today's date
  const dateInput = document.getElementById('formDate');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

// Handle Image Upload & Compression
function handleImageSelect(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const img = new Image();
    img.onload = function() {
      // Scale down image to preserve local storage limits (max 800px)
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800;
      const MAX_HEIGHT = 800;
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height;
          height = MAX_HEIGHT;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);

      state.uploadedPhotoBase64 = dataUrl;
      const preview = document.getElementById('uploadPreview');
      const placeholder = document.getElementById('uploadPlaceholder');
      if (preview) {
        preview.src = dataUrl;
        preview.style.display = 'block';
      }
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// Get GPS Geolocation
window.getCurrentLocation = function() {
  if (!navigator.geolocation) {
    showToast('GPS tidak didukung oleh browser Anda.');
    return;
  }

  showToast('Mengambil koordinat lokasi GPS...');
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const locInput = document.getElementById('formLocation');
      if (locInput) {
        locInput.value = `Koordinat: ${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
        showToast('Lokasi GPS berhasil diterapkan!');
      }
    },
    (error) => {
      console.warn('Geolocation error:', error);
      showToast('Gagal mengakses GPS. Pastikan izin lokasi aktif.');
    },
    { timeout: 8000 }
  );
};

// Handle Form Submission
function handlePostSubmit(e) {
  e.preventDefault();

  const title = document.getElementById('formTitle')?.value.trim();
  const type = document.getElementById('formType')?.value || 'barang';
  const category = document.getElementById('formCategory')?.value || 'Umum';
  const description = document.getElementById('formDesc')?.value.trim();
  const traitsRaw = document.getElementById('formTraits')?.value.trim();
  const location = document.getElementById('formLocation')?.value.trim();
  const date = document.getElementById('formDate')?.value;
  const reward = document.getElementById('formReward')?.value.trim();
  const contactName = document.getElementById('formName')?.value.trim();
  const contactPhone = document.getElementById('formPhone')?.value.trim();

  if (!title || !description || !location || !contactPhone) {
    showToast('Mohon lengkapi data wajib (*)');
    return;
  }

  // Parse traits
  const traits = traitsRaw 
    ? traitsRaw.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  // Fallback default picture based on type
  let photoUrl = state.uploadedPhotoBase64;
  if (!photoUrl) {
    photoUrl = type === 'hewan'
      ? 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80'
      : 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80';
  }

  const newItem = {
    id: 'item-' + Date.now(),
    type,
    category,
    status: 'dicari',
    reportType: 'kehilangan',
    title,
    description,
    traits,
    location,
    date: date || new Date().toISOString().split('T')[0],
    reward: reward || '',
    contactName: contactName || 'Pemilik',
    contactPhone,
    photoUrl,
    createdAt: Date.now()
  };

  state.items.unshift(newItem);
  saveItems();
  updateStats();
  renderFeed();
  window.closeAllModals();
  showToast('Laporan berhasil dipublikasikan!');
}

// Setup Theme
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
      showToast(`Mode tema: ${next === 'dark' ? 'Gelap' : 'Terang'}`);
    });
  }
}

// Setup PWA Installation
function initPWA() {
  const installBtn = document.getElementById('installAppBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    state.deferredPrompt = e;
    if (installBtn) {
      installBtn.classList.add('visible');
    }
  });

  window.addEventListener('appinstalled', () => {
    state.deferredPrompt = null;
    if (installBtn) {
      installBtn.classList.remove('visible');
    }
    showToast('Aplikasi berhasil dipasang di perangkat!');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!state.deferredPrompt) {
        // Show iOS instructions or information
        const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
        if (isIOS) {
          const iosModal = document.getElementById('iosInstallModal');
          if (iosModal) iosModal.classList.add('active');
        } else {
          showToast('Aplikasi sudah terpasang atau gunakan menu browser untuk install.');
        }
        return;
      }
      state.deferredPrompt.prompt();
      const { outcome } = await state.deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        state.deferredPrompt = null;
        installBtn.classList.remove('visible');
      }
    });
  }

  // Monitor Online/Offline Status
  const offlineBar = document.getElementById('offlineBar');
  function updateOnlineState() {
    if (offlineBar) {
      if (!navigator.onLine) {
        offlineBar.classList.add('visible');
      } else {
        offlineBar.classList.remove('visible');
      }
    }
  }
  window.addEventListener('online', updateOnlineState);
  window.addEventListener('offline', updateOnlineState);
  updateOnlineState();

  // Register Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then((reg) => {
        console.log('ServiceWorker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.warn('ServiceWorker registration error:', err);
      });
  }
}

// Event Listeners Initialization
function initEvents() {
  // Status filter chips
  document.querySelectorAll('.chip-btn[data-status]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.chip-btn[data-status]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.statusFilter = e.currentTarget.getAttribute('data-status');
      renderFeed();
    });
  });

  // Type segmented buttons
  document.querySelectorAll('.segmented-btn[data-type]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.segmented-btn[data-type]').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      state.typeFilter = e.currentTarget.getAttribute('data-type');
      renderFeed();
    });
  });

  // Instant Search with debounce
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderFeed();
    });
  }

  // Image file input listener
  const fileInput = document.getElementById('imageFileInput');
  if (fileInput) {
    fileInput.addEventListener('change', handleImageSelect);
  }

  // Post form submit
  const postForm = document.getElementById('postForm');
  if (postForm) {
    postForm.addEventListener('submit', handlePostSubmit);
  }

  // Dynamic category options based on type selection in form
  const formType = document.getElementById('formType');
  const formCategory = document.getElementById('formCategory');
  if (formType && formCategory) {
    formType.addEventListener('change', () => {
      if (formType.value === 'hewan') {
        formCategory.innerHTML = `
          <option value="Kucing">Kucing</option>
          <option value="Anjing">Anjing</option>
          <option value="Burung">Burung</option>
          <option value="Reptil">Reptil</option>
          <option value="Hewan Lainnya">Hewan Lainnya</option>
        `;
      } else {
        formCategory.innerHTML = `
          <option value="Gadget">Smartphone & Gadget</option>
          <option value="Dompet & Dokumen">Dompet & Dokumen (KTP/SIM/ATM)</option>
          <option value="Kunci Kendaraan">Kunci Motor / Mobil</option>
          <option value="Tas & Koper">Tas & Koper</option>
          <option value="Perhiasan & Aksesoris">Perhiasan & Jam Tangan</option>
          <option value="Elektronik Lainnya">Elektronik Lainnya</option>
          <option value="Barang Umum">Barang Umum</option>
        `;
      }
    });
  }
}

// App Bootstrap on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  loadItems();
  updateStats();
  renderFeed();
  initEvents();
  initPWA();
});
