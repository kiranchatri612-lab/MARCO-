function renderMovieGrid(containerId, movieList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = movieList.map(m => `
    <div class="movie-card" onclick="location.href='movie.html?id=${m.id}'">
      <div class="movie-poster-wrap">
        <img src="${m.poster}" alt="${m.title}" loading="lazy"/>
        <div class="movie-overlay">
          <a href="movie.html?id=${m.id}" class="btn-sm-outline">Details</a>
          <a href="booking.html?id=${m.id}" class="btn-sm-primary">Book Now</a>
        </div>
        <span class="cert-badge">${m.certification}</span>
      </div>
      <div class="movie-info">
        <h3>${m.title}</h3>
        <div class="movie-tags">
          ${m.genre.map(g => `<span class="tag">${g}</span>`).join('')}
          <span class="tag lang">${m.language}</span>
        </div>
        <div class="movie-meta-row">
          <span class="duration">${m.duration}</span>
          <span class="rating-star">${m.rating}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function renderUpcomingGrid(containerId, movieList) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = movieList.map(m => `
    <div class="upcoming-card">
      <img src="${m.poster}" alt="${m.title}"/>
      <div class="upcoming-info">
        <span class="upcoming-date">${m.releaseDate}</span>
        <h3>${m.title}</h3>
        <p>${m.genre.join(' / ')} &bull; ${m.language}</p>
        <p class="director-line">Dir. ${m.director}</p>
        <button class="btn-remind" onclick="alert('You will be notified when ${m.title} releases!')">Notify Me</button>
      </div>
    </div>
  `).join('');
}

function renderMovieDetail(containerId, movie) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div class="movie-backdrop" style="background-image:url('${movie.backdrop}')">
      <div class="backdrop-overlay"></div>
    </div>
    <div class="detail-hero container">
      <div class="detail-poster-wrap">
        <img src="${movie.poster}" alt="${movie.title}" class="detail-poster"/>
        <div class="price-table">
          <div class="price-row"><span>Standard</span><span>Rs. ${movie.price.standard}</span></div>
          <div class="price-row"><span>Premium</span><span>Rs. ${movie.price.premium}</span></div>
          <div class="price-row"><span>Recliner</span><span>Rs. ${movie.price.recliner}</span></div>
        </div>
        <a href="booking.html?id=${movie.id}" class="btn-primary btn-full book-cta">Book Tickets</a>
      </div>
      <div class="detail-info">
        <div class="cert-badge-lg">${movie.certification}</div>
        <h1 class="detail-title">${movie.title}</h1>
        <div class="detail-tags">
          ${movie.genre.map(g => `<span class="tag">${g}</span>`).join('')}
          <span class="tag lang">${movie.language}</span>
        </div>
        <div class="detail-meta-row">
          <span><strong>Duration:</strong> ${movie.duration}</span>
          <span><strong>Release:</strong> ${movie.releaseDate}</span>
          <span class="rating-star-lg">${movie.rating} / 10</span>
        </div>
        <div class="detail-crew-line">
          <span><strong>Director:</strong> ${movie.director}</span>
          <span><strong>Studio:</strong> ${movie.studio}</span>
        </div>
        <div class="detail-crew-line">
          <span><strong>Producers:</strong> ${movie.producers.join(', ')}</span>
        </div>
        <p class="detail-synopsis">${movie.synopsis}</p>
        ${movie.awards.length ? `
          <div class="awards-row">
            ${movie.awards.map(a => `<span class="award-badge">${a}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    </div>

    <div class="detail-tabs container">
      <div class="tab-nav">
        <button class="tab-btn active-tab" onclick="switchTab('story')">Story</button>
        <button class="tab-btn" onclick="switchTab('cast')">Cast & Crew</button>
        <button class="tab-btn" onclick="switchTab('awards')">Awards & Recognition</button>
      </div>

      <div class="tab-content active-content" id="tab-story">
        <div class="story-text">
          <h3>Full Story</h3>
          <p>${movie.story || 'Story details will be revealed closer to release.'}</p>
        </div>
      </div>

      <div class="tab-content" id="tab-cast">
        <div class="cast-grid">
          ${movie.cast.map(c => `
            <div class="cast-card">
              <div class="cast-avatar">${c.name.charAt(0)}</div>
              <div class="cast-info">
                <h4>${c.name}</h4>
                <span class="cast-role">${c.role}</span>
                <p>${c.bio}</p>
              </div>
            </div>
          `).join('')}
        </div>
        ${movie.crew.length ? `
          <h3 class="crew-heading">Crew</h3>
          <div class="crew-table">
            ${movie.crew.map(c => `
              <div class="crew-row">
                <span class="crew-role">${c.role}</span>
                <span class="crew-name">${c.name}</span>
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div class="tab-content" id="tab-awards">
        ${movie.awards.length ? `
          <div class="awards-list">
            ${movie.awards.map(a => `
              <div class="award-item">
                <div class="award-trophy">T</div>
                <span>${a}</span>
              </div>
            `).join('')}
          </div>
        ` : '<p style="color:#888;padding:40px 0">Award information not yet available.</p>'}
      </div>
    </div>

    <div class="book-cta-bar">
      <div class="container">
        <div class="book-cta-inner">
          <div>
            <h3>${movie.title}</h3>
            <p>${movie.genre.join(' / ')} &bull; ${movie.duration} &bull; ${movie.language}</p>
          </div>
          <a href="booking.html?id=${movie.id}" class="btn-primary">Book Tickets Now</a>
        </div>
      </div>
    </div>
  `;
}

function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active-content'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active-tab'));
  document.getElementById('tab-' + tab).classList.add('active-content');
  event.target.classList.add('active-tab');
}
