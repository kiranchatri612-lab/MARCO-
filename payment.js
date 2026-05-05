const bookingData = JSON.parse(sessionStorage.getItem('bookingData') || '{}');

// If no booking data, redirect
if (!bookingData.movieTitle) {
  window.location.href = 'index.html';
}

const CONVENIENCE_FEE = 49;
let discount = 0;
let currentTab = 'card';

// Populate order summary
document.getElementById('payPoster').innerHTML = `<img src="${bookingData.moviePoster}" alt="${bookingData.movieTitle}"/>`;
document.getElementById('payTitle').textContent = bookingData.movieTitle;
document.getElementById('payMeta').textContent = bookingData.movieGenre + ' | ' + bookingData.movieDuration;
document.getElementById('payShow').textContent = bookingData.time + ' | ' + bookingData.date;
document.getElementById('paySeats').textContent = bookingData.seats;
document.getElementById('payCinema').textContent = bookingData.cinema;

updatePriceSummary();

function updatePriceSummary() {
  const base = bookingData.baseTotal || 0;
  const total = base + CONVENIENCE_FEE - discount;
  document.getElementById('payBase').textContent = 'Rs. ' + base.toLocaleString('en-IN');
  document.getElementById('payFee').textContent = 'Rs. ' + CONVENIENCE_FEE;
  document.getElementById('payTotal').textContent = 'Rs. ' + total.toLocaleString('en-IN');
  document.getElementById('btnPayLabel').textContent = 'Pay Rs. ' + total.toLocaleString('en-IN') + ' Securely';
}

// TAB SWITCHING
document.querySelectorAll('.pay-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.pay-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.pay-panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    currentTab = tab.dataset.tab;
    document.getElementById('tab-' + currentTab).classList.add('active');
  });
});

// UPI app selection
document.querySelectorAll('.upi-app').forEach(app => {
  app.addEventListener('click', () => {
    document.querySelectorAll('.upi-app').forEach(a => a.classList.remove('active-upi'));
    app.classList.add('active-upi');
  });
});

// Wallet selection
document.querySelectorAll('.wallet-option').forEach(w => {
  w.addEventListener('click', () => {
    document.querySelectorAll('.wallet-option').forEach(x => x.classList.remove('active-wallet'));
    w.classList.add('active-wallet');
  });
});

// Card number formatting
document.getElementById('cardNum').addEventListener('input', function() {
  let val = this.value.replace(/\D/g, '').substring(0, 16);
  val = val.match(/.{1,4}/g)?.join(' ') || val;
  this.value = val;
  const display = val.padEnd(19, ' ').replace(/ /g, '*');
  const parts = val.split(' ');
  const masked = parts.map((p, i) => i < 2 ? p.replace(/./g, '*') : p).join(' ');
  document.getElementById('cardNumDisplay').textContent = val.length > 0 ? (val + ' **** ****').substring(0, 19) : '**** **** **** ****';

  const first = this.value.replace(/\s/g, '')[0];
  const brand = first === '4' ? 'VISA' : first === '5' ? 'MASTERCARD' : first === '3' ? 'AMEX' : 'CARD';
  document.getElementById('cardBrand').textContent = brand;
});

document.getElementById('cardHolder').addEventListener('input', function() {
  document.getElementById('cardHolderDisplay').textContent = this.value.toUpperCase() || 'YOUR NAME';
});

document.getElementById('cardExp').addEventListener('input', function() {
  let val = this.value.replace(/\D/g, '');
  if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
  this.value = val;
  document.getElementById('cardExpDisplay').textContent = val || 'MM/YY';
});

// COUPON
const VALID_COUPONS = { 'KIRAN30': 30, 'FIRST20': 20, 'SUPER50': 50 };
document.getElementById('btnApplyCoupon').addEventListener('click', () => {
  const code = document.getElementById('couponInput').value.trim().toUpperCase();
  const msg = document.getElementById('couponMsg');
  if (VALID_COUPONS[code]) {
    discount = VALID_COUPONS[code];
    msg.textContent = 'Coupon applied! You saved Rs. ' + discount;
    msg.className = 'coupon-msg success';
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('payDiscount').textContent = '- Rs. ' + discount;
    updatePriceSummary();
  } else {
    msg.textContent = 'Invalid coupon code. Try KIRAN30 or FIRST20.';
    msg.className = 'coupon-msg error';
  }
});

// PAYMENT
document.getElementById('btnPay').addEventListener('click', processPayment);

function processPayment() {
  const btn = document.getElementById('btnPay');

  if (currentTab === 'card') {
    const num = document.getElementById('cardNum').value.replace(/\s/g, '');
    const holder = document.getElementById('cardHolder').value.trim();
    const exp = document.getElementById('cardExp').value;
    const cvv = document.getElementById('cardCvv').value;
    if (num.length < 16 || !holder || exp.length < 5 || cvv.length < 3) {
      alert('Please fill in all card details correctly.');
      return;
    }
  }

  btn.textContent = 'Processing...';
  btn.disabled = true;
  btn.style.background = '#555';

  // Simulate payment processing
  let dots = 0;
  const interval = setInterval(() => {
    dots = (dots + 1) % 4;
    btn.textContent = 'Processing' + '.'.repeat(dots);
  }, 400);

  setTimeout(() => {
    clearInterval(interval);
    showSuccess();
  }, 3000);
}

function showSuccess() {
  const modal = document.getElementById('successModal');
  const bookingId = 'CK' + Date.now().toString().substring(5);
  document.getElementById('bookingId').textContent = bookingId;
  document.getElementById('modalMsg').textContent =
    bookingData.seats + ' at ' + bookingData.cinema + ' on ' + bookingData.date + ', ' + bookingData.time;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  // Clear booking data
  sessionStorage.removeItem('bookingData');
}
