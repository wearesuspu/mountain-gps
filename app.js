const routes = {
  bike: {
    beginner: [{name:'Cedar Loop', meta:'4.8 mi · Beginner · 380 ft climb', icon:'↻'}, {name:'Pine Creek Out-and-Back', meta:'3.2 mi · Easy · Creek views', icon:'↗'}, {name:'Ridge Connector', meta:'6.1 mi · Easy · Wide trail', icon:'⌁'}],
    intermediate: [{name:'Raven Ridge', meta:'7.4 mi · Intermediate · 820 ft climb', icon:'↗'}, {name:'Aspen Switchbacks', meta:'5.6 mi · Intermediate · 640 ft climb', icon:'⛰'}, {name:'Creekside Traverse', meta:'8.2 mi · Intermediate · 2 crossings', icon:'⌁'}],
    advanced: [{name:'Black Bear Descent', meta:'9.2 mi · Advanced · Technical', icon:'↘'}, {name:'Granite Peak Loop', meta:'12.5 mi · Advanced · 1,900 ft climb', icon:'⛰'}, {name:'North Face Line', meta:'6.8 mi · Expert · Steep sections', icon:'⚡'}]
  },
  moto: {
    beginner: [{name:'Juniper Moto Loop', meta:'8.4 mi · Beginner · Open dirt', icon:'↻'}, {name:'Dry Creek OHV Route', meta:'10.2 mi · Easy · 2 gates', icon:'↗'}, {name:'Ranger Road', meta:'6.5 mi · Easy · Wide trail', icon:'⌁'}],
    intermediate: [{name:'Dusty Saddle', meta:'14.6 mi · Intermediate · Rocky', icon:'↗'}, {name:'Canyon Moto Link', meta:'11.1 mi · Intermediate · 3 climbs', icon:'⛰'}, {name:'Red Mesa Traverse', meta:'16.3 mi · Intermediate · Check closures', icon:'⌁'}],
    advanced: [{name:'Iron Ridge Enduro', meta:'18.7 mi · Advanced · Technical', icon:'↘'}, {name:'Black Rock Challenge', meta:'21.4 mi · Advanced · Expert only', icon:'⛰'}, {name:'Storm Pass Route', meta:'19.2 mi · Expert · Seasonal', icon:'⚡'}]
  }
};

const rideType = document.querySelector('#rideType');
const skill = document.querySelector('#skill');
const routeList = document.querySelector('#routeList');
const mapTitle = document.querySelector('#mapTitle');
const mapMeta = document.querySelector('#mapMeta');
const routeHeading = document.querySelector('#routeHeading');
const mapCard = document.querySelector('.map-card');
const saveOffline = document.querySelector('#saveOffline');
const offlineStatus = document.querySelector('#offlineStatus');

function updateSnapshots(mode, level) {
  const moto = mode === 'moto';
  const levelName = level[0].toUpperCase() + level.slice(1);
  document.querySelector('#snapshotOneTitle').textContent = moto ? 'Dirt turn' : 'Forest flow';
  document.querySelector('#snapshotOneMeta').textContent = moto ? 'Loose corners · Moto' : 'Smooth turns · Bike';
  document.querySelector('#snapshotTwoTitle').textContent = level === 'advanced' ? 'Steep ridge' : level === 'intermediate' ? 'Rocky climb' : 'Mountain climb';
  document.querySelector('#snapshotTwoMeta').textContent = `${levelName} · Scenic views`;
  document.querySelector('#snapshotThreeTitle').textContent = moto ? (level === 'advanced' ? 'Enduro line' : 'Open track') : (level === 'advanced' ? 'Technical line' : 'Creek crossing');
  document.querySelector('#snapshotThreeMeta').textContent = moto ? `${levelName} · Dirt route` : `${levelName} · Trail feature`;
}

function renderRoutes() {
  const mode = rideType.value;
  const level = skill.value;
  const selected = routes[mode][level];
  mapCard.className = `map-card card mode-${mode} level-${level}`;
  document.querySelector('#startLabel').textContent = mode === 'moto' ? 'PADDOCK' : 'START';
  document.querySelector('#endLabel').textContent = level === 'advanced' ? 'RIDGE LINE' : mode === 'moto' ? 'TRACK END' : 'LOOKOUT';
  updateSnapshots(mode, level);
  routeHeading.textContent = level === 'beginner' ? 'Good for a first ride' : level === 'intermediate' ? 'Build your skills' : 'For experienced riders';
  routeList.innerHTML = selected.map((route, index) => `<article class="route${index === 0 ? ' selected' : ''}"><div class="route-main"><div class="route-symbol">${route.icon}</div><div><h3>${route.name}</h3><p>${route.meta}</p></div></div><button data-index="${index}">Preview</button></article>`).join('');
  mapTitle.textContent = selected[0].name;
  mapMeta.textContent = selected[0].meta;
  const saved = JSON.parse(localStorage.getItem('mountainGpsOfflineMaps') || '[]');
  const isSaved = saved.some(item => item.name === selected[0].name);
  saveOffline.classList.toggle('saved', isSaved);
  saveOffline.textContent = isSaved ? '✓ Saved for offline use' : '⇩ Save map offline';
  routeList.querySelectorAll('button').forEach(button => button.addEventListener('click', () => { const route = selected[button.dataset.index]; mapTitle.textContent = route.name; mapMeta.textContent = route.meta; document.querySelectorAll('.route').forEach(card => card.classList.remove('selected')); button.closest('.route').classList.add('selected'); document.querySelectorAll('.trail').forEach(trail => trail.classList.remove('active')); document.querySelector(`.trail-${['a', 'b', 'c'][Number(button.dataset.index)]}`).classList.add('active'); mapCard.classList.add('preview-active'); document.querySelector('#previewBadge').textContent = `Previewing ${route.name}`; mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
}

saveOffline.addEventListener('click', () => {
  const map = { name: mapTitle.textContent, details: mapMeta.textContent, savedAt: new Date().toISOString(), note: 'Demo offline map. Verify trail status before riding.' };
  const saved = JSON.parse(localStorage.getItem('mountainGpsOfflineMaps') || '[]').filter(item => item.name !== map.name);
  saved.push(map);
  localStorage.setItem('mountainGpsOfflineMaps', JSON.stringify(saved));
  const file = new Blob([JSON.stringify(map, null, 2)], { type: 'application/json' });
  const link = document.createElement('a'); link.href = URL.createObjectURL(file); link.download = `${map.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-offline-map.json`; link.click(); URL.revokeObjectURL(link.href);
  saveOffline.classList.add('saved'); saveOffline.textContent = '✓ Saved for offline use'; offlineStatus.textContent = 'Saved on this device · no signal needed to view it';
});

rideType.addEventListener('change', renderRoutes); skill.addEventListener('change', renderRoutes); document.querySelector('#findRoute').addEventListener('click', renderRoutes); renderRoutes();
