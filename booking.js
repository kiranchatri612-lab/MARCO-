const params = new URLSearchParams(window.location.search);
const movieId = parseInt(params.get('id'));
const movie = movies.find(m => m.id === movieId);

let selectedDate = null;
let selectedCinema = null;
let selectedShow = null;
let selectedSeats = [];

if (!movie) {
  document.querySelector('.booking-wrapper').innerHTML = '<div class="container" style="padding:100px 20px;text-align:center;color:#ccc"><h2>Movie not found</h2><a href="index.html" class="btn-primary" style="margin-top:20px;display:inline-block">Go Home</a></div>';
} else {
  initBooking();
}

function initBooking() {
  // Populate summary
  document.getElementById('summaryPoster').innerHTML = `<img src="${movie.poster}" alt="${movie.title}"/>`;
  document.getElementById('summaryTitle').textContent = movie.title;
  document.getElementById('summaryMeta').textContent = movie.genre.join(' / ') + ' | ' + movie.duration;

  buildDateStrip();
  buildCinemaList();
}

function buildDateStrip() {
  const strip = document.getElementById('dateStrip');
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  let html = '';
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : days[d.getDay()];
    html += `<div class="date-pill ${i === 0 ? 'active' : ''}" data-date="${d.toDateString()}" onclick="selectDate(this, '${d.toDateString()}')">
      <span class="date-day">${label}</span>
      <span class="date-num">${d.getDate()}</span>
      <span class="date-mon">${months[d.getMonth()]}</span>
    </div>`;
  }
  strip.innerHTML = html;
  selectedDate = today.toDateString();
}

function selectDate(el, date) {
  document.querySelectorAll('.date-pill').forEach(d => d.classList.remove('active'));
  el.classList.add('active');
  selectedDate = date;
  buildCinemaList();
}

function buildCinemaList() {
  const list = document.getElementById('cinemaList');
  list.innerHTML = cinemas.map((cinema, ci) => `
    <div class="cinema-item">
      <div class="cinema-header">
        <div>
          <h4>${cinema.name}</h4>
          <p class="cinema-loc">${cinema.location}</p>
        </div>
        <span class="cinema-formats">2D | 3D | IMAX</span>
      </div>
      <div class="show-times">
        ${showTimes.map((time, ti) => `
          <button class="show-time-btn" data-cinema="${ci}" data-time="${time}" onclick="selectShow(this, ${ci}, '${time}', '${cinema.name}')">
            ${time}
            <span class="seats-left">Fast Filling</span>
          </button>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function selectShow(el, cinemaIdx, time, cinemaName) {
  document.querySelectorAll('.show-time-btn').forEach(b => b.classList.remove('selected-show'));
  el.classList.add('selected-show');
  selectedCinema = cinemaName;
  selectedShow = time;

  document.getElementById('summaryShow').style.display = 'flex';
  document.getElementById('summaryShowVal').textContent = cinemaName + ' | ' + time + ' | ' + selectedDate;

  // Transition to seat selection
  setTimeout(() => {
    document.getElementById('panelShow').classList.add('hidden');
    document.getElementById('panelSeats').classList.remove('hidden');
    document.getElementById('step1').classList.remove('active');
    document.getElementById('step1').classList.add('done');
    document.getElementById('step2').classList.add('active');
    buildSeatMap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 400);
}

function buildSeatMap() {
  const map = document.getElementById('seatMap');
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const occupied = generateOccupied(rows, seatsPerRow);
  const premiumRows = ['A', 'B'];

  let html = '';
  rows.forEach(row => {
    html += `<div class="seat-row"><span class="row-label">${row}</span>`;
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatId = row + i;
      const isOccupied = occupied.includes(seatId);
      const isPremium = premiumRows.includes(row);
      const cls = isOccupied ? 'seat occupied' : isPremium ? 'seat premium' : 'seat available';
      const price = isPremium ? movie.price.premium : movie.price.standard;
      if (!isOccupied) {
        html += `<div class="${cls}" data-seat="${seatId}" data-price="${price}" onclick="toggleSeat(this, '${seatId}', ${price})">${i}</div>`;
      } else {
        html += `<div class="${cls}">${i}</div>`;
      }
    }
    html += '</div>';
  });
  map.innerHTML = html;
}

function generateOccupied(rows, seatsPerRow) {
  const occupied = [];
  rows.forEach(row => {
    for (let i = 1; i <= seatsPerRow; i++) {
      if (Math.random() < 0.3) occupied.push(row + i);
    }
  });
  return occupied;
}

function toggleSeat(el, seatId, price) {
  const idx = selectedSeats.findIndex(s => s.id === seatId);
  if (idx === -1) {
    if (selectedSeats.length >= 8) { alert('You can select a maximum of 8 seats.'); return; }
    selectedSeats.push({ id: seatId, price });
    el.classList.add('selected');
  } else {
    selectedSeats.splice(idx, 1);
    el.classList.remove('selected');
  }
  updateSeatSummary();
}

function updateSeatSummary() {
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const btn = document.getElementById('btnProceedPayment');
  const seatsRow = document.getElementById('summarySeatsRow');
  const amtRow = document.getElementById('summaryAmtRow');

  if (selectedSeats.length > 0) {
    seatsRow.style.display = 'flex';
    amtRow.style.display = 'flex';
    document.getElementById('summarySeatsVal').textContent = selectedSeats.map(s => s.id).join(', ');
    document.getElementById('summaryAmtVal').textContent = 'Rs. ' + total.toLocaleString('en-IN');
    btn.disabled = false;
    btn.textContent = 'Proceed to Payment - Rs. ' + total.toLocaleString('en-IN');
  } else {
    seatsRow.style.display = 'none';
    amtRow.style.display = 'none';
    btn.disabled = true;
    btn.textContent = 'Proceed to Payment';
  }
}

document.getElementById('btnProceedPayment').addEventListener('click', () => {
  const total = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const bookingData = {
    movieId: movie.id,
    movieTitle: movie.title,
    moviePoster: movie.poster,
    movieGenre: movie.genre.join(' / '),
    movieDuration: movie.duration,
    cinema: selectedCinema,
    date: selectedDate,
    time: selectedShow,
    seats: selectedSeats.map(s => s.id).join(', '),
    baseTotal: total
  };
  sessionStorage.setItem('bookingData', JSON.stringify(bookingData));

  document.getElementById('step2').classList.remove('active');
  document.getElementById('step2').classList.add('done');
  document.getElementById('step3').classList.add('active');

  setTimeout(() => {
    window.location.href = 'payment.html';
  }, 300);
});
