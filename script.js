// Preloader
window.addEventListener('load', () => {
  document.getElementById('preloader').style.display = 'none';
});

// Live clock
setInterval(() => {
  const now = new Date();
  document.getElementById('clock').textContent = now.toLocaleTimeString();
}, 1000);

// Back to top
const backToTop = document.getElementById('backToTop');
window.onscroll = function () {
  backToTop.style.display = document.documentElement.scrollTop > 100 ? 'block' : 'none';
};
backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// Theme toggle
const themeToggle = document.getElementById('toggleTheme');
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
  themeToggle.textContent = '☀️';
}
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-mode');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// Autocomplete
const suggestions = ["john@example.com", "doe@example.com", "abc123", "vault@codes.com"];
const input = document.getElementById('identifier');
input.addEventListener('input', function () {
  const val = this.value.toLowerCase();
  const list = document.getElementById('suggestionList');
  list.innerHTML = '';
  if (!val) return;
  suggestions.filter(s => s.includes(val)).forEach(s => {
    const li = document.createElement('li');
    li.textContent = s;
    li.onclick = () => {
      input.value = s;
      list.innerHTML = '';
    };
    list.appendChild(li);
  });
});

function verifyStudent() {
  const id = input.value.trim();
  const phone = document.getElementById('phone').value.trim();
  const batch = document.getElementById('batch').value.trim();
  const resultBox = document.getElementById('result');
  if (!id) return alert('Please enter a valid Email or ID');

  showSpinner(true);
  setTimeout(() => {
    const student = {
      name: "John Doe",
      email: id,
      mobile: phone || "9876543210",
      domain: "Web Development",
      college: "Dummy University",
      start: "01 June 2024",
      duration: "1 Month",
      photo: "https://via.placeholder.com/130",
      assignments: [true, false, true, true],
      certificate: "#"
    };

    const completed = student.assignments.filter(a => a).length;
    const pending = student.assignments.length - completed;

    const html = `
      <div class="card">
        <img src="${student.photo}" alt="Photo" />
        <h3>${student.name}</h3>
        <p>Email: ${student.email} <button onclick="copyText('${student.email}')">📋</button></p>
        <p>Mobile: ${student.mobile}</p>
        <p>Batch: ${batch || "Not Provided"}</p>
        <p>Domain: ${student.domain}</p>
        <p>College: ${student.college}</p>
        <p>Start Date: ${student.start}</p>
        <p>Duration: ${student.duration}</p>
        <h4>Assignment Status</h4>
        <div class="assignment-status">
          ${student.assignments.map((a, i) => `<span>A${i + 1}: ${a ? '✅' : '❌'}</span>`).join('')}
        </div>
        <p>Status: Completed</p>
        <a href="${student.certificate}" target="_blank">View Certificate</a>
      </div>

      <div class="card">
        <h4>Assignment Analytics</h4>
        <canvas id="assignmentChart"></canvas>
      </div>
    `;

    resultBox.innerHTML = html;
    document.getElementById('historyBox').classList.remove('hidden');
    showSpinner(false);
    showToast('✅ Dummy student data loaded.');
    launchConfetti();
    addToHistory(id);

    setTimeout(() => {
      new Chart(document.getElementById("assignmentChart"), {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [completed, pending],
            backgroundColor: ['#28a745', '#dc3545']
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }, 300);
  }, 1200);
}

function resetForm() {
  document.getElementById('identifier').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('batch').value = '';
  document.getElementById('suggestionList').innerHTML = '';
  document.getElementById('result').innerHTML = '';
  showToast('Form reset.');
}

function downloadDetails() {
  showToast("🔧 Download feature coming soon.");
}

function showSpinner(show) {
  document.querySelector('.spinner').style.display = show ? 'block' : 'none';
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.innerText = msg;
  toast.className = 'toast show';
  setTimeout(() => toast.className = 'toast', 3000);
}

function copyText(text) {
  navigator.clipboard.writeText(text);
  showToast('Copied to clipboard!');
}

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let particles = [];
  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * -canvas.height,
      emoji: ['🎉', '✨', '🎊'][Math.floor(Math.random() * 3)],
      size: 24 + Math.random() * 10,
      speed: 2 + Math.random() * 4
    });
  }
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.font = `${p.size}px sans-serif`;
      ctx.fillText(p.emoji, p.x, p.y);
      p.y += p.speed;
      if (p.y > canvas.height) p.y = -20;
    });
    requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 3000);
}

function addToHistory(id) {
  const list = document.getElementById('historyList');
  let history = JSON.parse(localStorage.getItem('verifyHistory')) || [];
  history.unshift(id);
  history = history.slice(0, 5);
  localStorage.setItem('verifyHistory', JSON.stringify(history));
  renderHistory(history);
}

function renderHistory(history) {
  const list = document.getElementById('historyList');
  list.innerHTML = history.map(h => `<li>${h}</li>`).join('');
}

renderHistory(JSON.parse(localStorage.getItem('verifyHistory')) || []);