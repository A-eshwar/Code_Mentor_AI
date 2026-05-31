// Navigation
const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const target = item.dataset.section;

    navItems.forEach(n => n.classList.remove('active'));
    sections.forEach(s => s.classList.add('hidden'));

    item.classList.add('active');
    document.getElementById(target).classList.remove('hidden');
  });
});

// History store
let chatHistory = JSON.parse(localStorage.getItem('dsaHistory') || '[]');

function saveHistory(q, a) {
  chatHistory.unshift({ q, a, time: new Date().toLocaleString() });
  if (chatHistory.length > 50) chatHistory.pop();
  localStorage.setItem('dsaHistory', JSON.stringify(chatHistory));
  renderHistory();
}

function renderHistory() {
  const list = document.getElementById('sidebarHistoryList');
  const clearBtn = document.getElementById('clearHistory');
  
  if (chatHistory.length === 0) {
    list.innerHTML = '<p class="sidebar-empty">No history yet.</p>';
    if (clearBtn) clearBtn.classList.add('hidden');
    return;
  }
  
  if (clearBtn) clearBtn.classList.remove('hidden');
  
  list.innerHTML = chatHistory.map((item, i) => `
    <div class="sidebar-history-item" onclick="loadFromHistory(${i})">
      <span class="sidebar-history-icon">💬</span>
      <span class="sidebar-history-text">${escapeHtml(item.q)}</span>
    </div>
  `).join('');
}

function loadFromHistory(i) {
  const item = chatHistory[i];
  // Switch to dashboard
  navItems.forEach(n => n.classList.remove('active'));
  sections.forEach(s => s.classList.add('hidden'));
  document.querySelector('[data-section="dashboard"]').classList.add('active');
  document.getElementById('dashboard').classList.remove('hidden');

  document.getElementById('questionInput').value = item.q;
  showResponse(item.a);
}

window.loadFromHistory = loadFromHistory;

function escapeHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// Ask question
async function askQuestion(query, responseBoxId, responseTextId, btnId, btnTextId, btnLoaderId) {
  const btn = document.getElementById(btnId);
  const btnText = document.getElementById(btnTextId);
  const btnLoader = document.getElementById(btnLoaderId);

  btn.disabled = true;
  btnText.classList.add('hidden');
  btnLoader.classList.remove('hidden');

  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    const answer = data.answer || data.error || 'No response received.';

    document.getElementById(responseTextId).innerHTML = marked.parse(answer);
    document.getElementById(responseBoxId).classList.remove('hidden');

    return answer;
  } catch (err) {
    document.getElementById(responseTextId).textContent = 'Error: Could not connect to server.';
    document.getElementById(responseBoxId).classList.remove('hidden');
    return null;
  } finally {
    btn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoader.classList.add('hidden');
  }
}

function showResponse(text) {
  document.getElementById('responseText').innerHTML = marked.parse(text);
  document.getElementById('responseBox').classList.remove('hidden');
}

// Dashboard ask button
document.getElementById('askBtn').addEventListener('click', async () => {
  const query = document.getElementById('questionInput').value.trim();
  if (!query) return;
  const answer = await askQuestion(query, 'responseBox', 'responseText', 'askBtn', 'btnText', 'btnLoader');
  if (answer) saveHistory(query, answer);
});

// Enter key support
document.getElementById('questionInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    document.getElementById('askBtn').click();
  }
});

// Copy buttons
document.getElementById('copyBtn').addEventListener('click', () => {
  const text = document.getElementById('responseText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('copyBtn').textContent = 'Copied!';
    setTimeout(() => document.getElementById('copyBtn').textContent = 'Copy', 2000);
  });
});

document.getElementById('copyPlayground').addEventListener('click', () => {
  const text = document.getElementById('playgroundText').innerText;
  navigator.clipboard.writeText(text).then(() => {
    document.getElementById('copyPlayground').textContent = 'Copied!';
    setTimeout(() => document.getElementById('copyPlayground').textContent = 'Copy', 2000);
  });
});

// Clear history
document.getElementById('clearHistory').addEventListener('click', () => {
  chatHistory = [];
  localStorage.removeItem('dsaHistory');
  renderHistory();
});

// Tutorial cards
document.querySelectorAll('.tutorial-card').forEach(card => {
  card.addEventListener('click', async () => {
    const query = card.dataset.query;

    document.getElementById('tutorialsGrid').classList.add('hidden');
    document.getElementById('tutorialReader').classList.remove('hidden');
    
    const loader = document.getElementById('tutorialLoader');
    const content = document.getElementById('tutorialContent');
    loader.classList.remove('hidden');
    content.classList.add('hidden');
    
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      const answer = data.answer || data.error || 'No response received.';
      content.innerHTML = marked.parse(answer);
    } catch (err) {
      content.innerHTML = '<p style="color:red">Error loading tutorial.</p>';
    } finally {
      loader.classList.add('hidden');
      content.classList.remove('hidden');
    }
  });
});

document.getElementById('backToTutorials').addEventListener('click', () => {
  document.getElementById('tutorialsGrid').classList.remove('hidden');
  document.getElementById('tutorialReader').classList.add('hidden');
  document.getElementById('tutorialContent').innerHTML = '';
});

// Playground
document.getElementById('playgroundBtn').addEventListener('click', async () => {
  const problem = document.getElementById('playgroundInput').value.trim();
  const lang = document.getElementById('langSelect').value;
  if (!problem) return;

  const query = `Solve this DSA problem in ${lang}: ${problem}`;
  await askQuestion(query, 'playgroundResponse', 'playgroundText', 'playgroundBtn', 'pgBtnText', 'pgBtnLoader');
});

document.getElementById('playgroundInput').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && e.ctrlKey) {
    document.getElementById('playgroundBtn').click();
  }
});



// Init history render
renderHistory();
