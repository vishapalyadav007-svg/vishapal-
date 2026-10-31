/**
 * ReviewInsight - Standalone Client Application Logic
 * Author: Vishapal Yadav
 */

(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const keys = {
    auth: "ri_standalone_auth",
    reviews: "ri_standalone_review_history"
  };

  const loginScreen = $("login-screen");
  const siteContent = $("site-content");
  const loginMessage = $("login-message");
  const passwordInput = $("owner-password");
  const passwordToggle = $("password-toggle");

  const setLoginMessage = (text, type = "info") => {
    loginMessage.textContent = text;
    loginMessage.className = "login-message " + type;
  };

  $$("[data-coming-soon]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLoginMessage("Online social login is coming soon. Please use Owner Login with demo password below.", "info");
    });
  });

  passwordToggle.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    passwordToggle.textContent = isHidden ? "🙈" : "👁";
    passwordToggle.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
    passwordToggle.setAttribute("aria-pressed", String(isHidden));
    passwordInput.focus();
  });

  function unlockSite() {
    sessionStorage.setItem(keys.auth, "true");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    siteContent.hidden = false;
    loginScreen.hidden = true;
    const mainEl = $("main");
    if (mainEl) {
      mainEl.setAttribute("tabindex", "-1");
      mainEl.focus({ preventScroll: true });
    }
  }

  function lockSite() {
    sessionStorage.removeItem(keys.auth);
    siteContent.hidden = true;
    loginScreen.hidden = false;
    passwordInput.value = "";
    setLoginMessage("");
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }

  if (sessionStorage.getItem(keys.auth) === "true") {
    unlockSite();
  }

  $("owner-login").addEventListener("submit", async (e) => {
    e.preventDefault();
    const candidate = passwordInput.value.trim();
    if (!candidate) {
      setLoginMessage("Please enter the demo password.", "error");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: candidate })
      });
      if (res.ok) {
        unlockSite();
        return;
      }
      if (res.status === 401) {
        setLoginMessage("Incorrect demo password. Please try again.", "error");
        return;
      }
    } catch {}

    if (candidate === "21062006") {
      unlockSite();
    } else {
      setLoginMessage("Incorrect demo password. Please try again.", "error");
    }
  });

  const logoutBtn = $("nav-logout");
  if (logoutBtn) logoutBtn.addEventListener("click", lockSite);

  // ---------------- Review Analysis & Sentiment Engine ----------------
  const POSITIVE_WORDS = ['delicious', 'tasty', 'amazing', 'excellent', 'fantastic', 'superb', 'great', 'love', 'loved', 'best', 'fresh', 'friendly', 'attentive', 'clean', 'cozy', 'quick', 'prompt', 'worth', 'affordable', 'wonderful', 'polite'];
  const NEGATIVE_WORDS = ['terrible', 'awful', 'horrible', 'worst', 'bad', 'disgusting', 'stale', 'cold', 'raw', 'salty', 'slow', 'rude', 'unfriendly', 'dirty', 'greasy', 'overpriced', 'expensive', 'waste', 'noisy', 'bland', 'wait', 'late'];
  const KNOWN_DISHES = ['pizza', 'pasta', 'burger', 'soup', 'steak', 'salad', 'curry', 'dessert', 'chicken', 'fish', 'bread', 'fries', 'sushi', 'tacos'];

  function analyze(text, timestamp = Date.now()) {
    const lower = text.toLowerCase();
    const words = lower.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
    let pos = 0, neg = 0;
    const posHits = [], negHits = [];
    words.forEach(w => {
      if (POSITIVE_WORDS.includes(w)) { pos++; if (!posHits.includes(w)) posHits.push(w); }
      if (NEGATIVE_WORDS.includes(w)) { neg++; if (!negHits.includes(w)) negHits.push(w); }
    });

    let score = 65;
    if (pos + neg > 0) {
      score = Math.round((pos / (pos + neg * 1.3)) * 100);
      score = Math.max(5, Math.min(98, score));
    }

    let stars = 3;
    if (score >= 80) stars = 5;
    else if (score >= 65) stars = 4;
    else if (score >= 45) stars = 3;
    else if (score >= 25) stars = 2;
    else stars = 1;

    const sentiment = stars >= 4 ? "Positive" : stars === 3 ? "Neutral" : "Negative";
    const reply = stars >= 4
      ? `"Thank you for the ${stars}-star review! We are delighted you loved your meal at ReviewInsight and look forward to welcoming you back!"`
      : stars === 3
      ? `"Thank you for your feedback. We always strive for 5 stars and have shared your comments with our kitchen and service team."`
      : `"Dear Guest, we sincerely apologize that your visit did not meet our high standards. Please contact our manager at management@restaurant.com so we can make this right."`;

    return { id: 'rev_' + timestamp, text, score, stars, sentiment, posHits, negHits, reply, timestamp };
  }

  // Load reviews history
  let reviews = [];
  try {
    const saved = localStorage.getItem(keys.reviews);
    reviews = saved ? JSON.parse(saved) : [
      analyze('The pasta was absolutely delicious, fresh and amazing! Quick friendly service and cozy ambiance.', Date.now() - 86400000 * 2),
      analyze('Terrible experience. The soup was cold, salty and awful. Waiter was extremely rude.', Date.now() - 86400000 * 1),
      analyze('The burger was tasty and flavorful, but we had to wait 45 minutes for our order. Service was slow.', Date.now() - 3600000 * 4),
      analyze('Great pizza, but the dining room was extremely noisy and dirty tables.', Date.now() - 3600000 * 1)
    ];
  } catch {
    reviews = [];
  }

  function saveReviews() {
    try {
      localStorage.setItem(keys.reviews, JSON.stringify(reviews));
    } catch {}
  }

  let currentDateFilter = 'all';

  // ---------------- Render Analytics Dashboard ----------------
  function renderDashboard() {
    const container = $("dashboard-content");
    const emptyState = $("dashboard-empty");
    if (!container || !emptyState) return;

    const now = Date.now();
    const filtered = reviews.filter((r) => {
      if (currentDateFilter === '7days') return now - r.timestamp <= 7 * 86400000;
      if (currentDateFilter === '30days') return now - r.timestamp <= 30 * 86400000;
      return true;
    });

    if (filtered.length === 0) {
      emptyState.style.display = "block";
      container.style.display = "none";
      return;
    }

    emptyState.style.display = "none";
    container.style.display = "block";

    const total = filtered.length;
    let pos = 0, neu = 0, neg = 0, starSum = 0;
    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const posKwMap = {}, negKwMap = {};
    const dishMap = {};
    const issues = {
      'Slow Service': { count: 0, action: 'Streamline kitchen ticket passing and server coordination.' },
      'Food Temperature': { count: 0, action: 'Check plate warmers and enforce speedy food runner dispatch.' },
      'Salty / Food Quality': { count: 0, action: 'Audit kitchen prep seasoning and conduct daily sauce taste-tests.' },
      'High Pricing': { count: 0, action: 'Review meal portions and garnish presentation to improve perceived value.' }
    };

    filtered.forEach(r => {
      starSum += r.stars;
      if (r.stars >= 4) pos++;
      else if (r.stars === 3) neu++;
      else neg++;

      ratingCounts[r.stars]++;

      r.posHits.forEach(w => { posKwMap[w] = (posKwMap[w] || 0) + 1; });
      r.negHits.forEach(w => { negKwMap[w] = (negKwMap[w] || 0) + 1; });

      const lower = r.text.toLowerCase();
      KNOWN_DISHES.forEach(d => {
        if (lower.includes(d)) {
          if (!dishMap[d]) dishMap[d] = { pos: 0, neg: 0 };
          if (r.stars >= 4) dishMap[d].pos++;
          else if (r.stars <= 2) dishMap[d].neg++;
        }
      });

      if (lower.includes('slow') || lower.includes('wait')) issues['Slow Service'].count++;
      if (lower.includes('cold') || lower.includes('temperature')) issues['Food Temperature'].count++;
      if (lower.includes('salty') || lower.includes('awful') || lower.includes('stale')) issues['Salty / Food Quality'].count++;
      if (lower.includes('expensive') || lower.includes('overpriced') || lower.includes('waste')) issues['High Pricing'].count++;
    });

    const posPct = Math.round((pos / total) * 100);
    const neuPct = Math.round((neu / total) * 100);
    const negPct = Math.max(0, 100 - posPct - neuPct);
    const avgRating = (starSum / total).toFixed(1);

    // Row 1: KPI Summary cards
    $("card-total").textContent = total;
    $("card-pos").textContent = pos;
    $("card-pos-pct").textContent = `${posPct}% of reviews`;
    $("card-neu").textContent = neu;
    $("card-neu-pct").textContent = `${neuPct}% of reviews`;
    $("card-neg").textContent = neg;
    $("card-neg-pct").textContent = `${negPct}% of reviews`;
    $("card-avg").textContent = `★ ${avgRating}`;

    // Row 2: Sentiment Doughnut
    $("donut-pos-pct").textContent = `${posPct}%`;
    $("donut-circle-pos").setAttribute("stroke-dasharray", `${posPct * 0.88} 100`);
    $("donut-circle-neu").setAttribute("stroke-dasharray", `${neuPct * 0.88} 100`);
    $("donut-circle-neu").setAttribute("stroke-dashoffset", `-${posPct * 0.88}`);
    $("donut-circle-neg").setAttribute("stroke-dasharray", `${negPct * 0.88} 100`);
    $("donut-circle-neg").setAttribute("stroke-dashoffset", `-${(posPct + neuPct) * 0.88}`);
    $("legend-pos").textContent = `${pos} (${posPct}%)`;
    $("legend-neu").textContent = `${neu} (${neuPct}%)`;
    $("legend-neg").textContent = `${neg} (${negPct}%)`;

    // Row 2: Trends chart
    const trendBuckets = {};
    filtered.forEach(r => {
      const d = new Date(r.timestamp);
      const k = `${d.getMonth() + 1}/${d.getDate()}`;
      if (!trendBuckets[k]) trendBuckets[k] = { count: 0, stars: 0 };
      trendBuckets[k].count++;
      trendBuckets[k].stars += r.stars;
    });
    const trendKeys = Object.keys(trendBuckets);
    const maxCount = Math.max(...trendKeys.map(k => trendBuckets[k].count), 1);
    $("trend-chart").innerHTML = trendKeys.map(k => {
      const b = trendBuckets[k];
      const h = Math.max(25, Math.round((b.count / maxCount) * 85));
      const avg = (b.stars / b.count).toFixed(1);
      return `
        <div style="flex:1;min-width:40px;display:flex;flex-direction:column;align-items:center;height:100%;justify-content:flex-end;">
          <span style="font-size:0.72rem;color:#f59e0b;font-weight:800;margin-bottom:3px;">★${avg}</span>
          <div style="width:26px;height:${h}%;background:linear-gradient(180deg,#2563eb,#0ea5e9);border-radius:6px 6px 2px 2px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:0.7rem;font-weight:800;">
            ${b.count}
          </div>
          <span style="font-size:0.68rem;color:var(--muted);margin-top:5px;">${k}</span>
        </div>
      `;
    }).join("");

    // Row 3: Rating Distribution
    const maxR = Math.max(...Object.values(ratingCounts), 1);
    [5, 4, 3, 2, 1].forEach(s => {
      const c = ratingCounts[s];
      const p = Math.round((c / total) * 100);
      $(`bar-stars-${s}`).style.width = `${Math.round((c / maxR) * 100)}%`;
      $(`label-stars-${s}`).textContent = `${c} (${p}%)`;
    });

    // Row 3: Common Keywords
    const sortedPos = Object.entries(posKwMap).sort((a,b)=>b[1]-a[1]).slice(0, 5);
    const sortedNeg = Object.entries(negKwMap).sort((a,b)=>b[1]-a[1]).slice(0, 5);
    $("kw-pos").innerHTML = sortedPos.length ? sortedPos.map(([w, c]) => `<span class="badge-tag badge-positive">✓ ${w} <b>(${c})</b></span>`).join("") : `<span style="font-size:0.8rem;color:var(--muted)">None yet</span>`;
    $("kw-neg").innerHTML = sortedNeg.length ? sortedNeg.map(([w, c]) => `<span class="badge-tag badge-negative">⚠ ${w} <b>(${c})</b></span>`).join("") : `<span style="font-size:0.8rem;color:var(--muted)">None yet</span>`;

    // Row 4: Top Positive & Negative feedback
    const posReviews = filtered.filter(r => r.stars >= 4);
    const negReviews = filtered.filter(r => r.stars <= 2);
    $("card-top-pos").innerHTML = posReviews.length
      ? `<b>Top praise:</b> Customers appreciate ${sortedPos.map(x=>x[0]).join(', ') || 'overall quality'}.<div style="margin-top:8px;padding:10px;background:#fff;border-radius:8px;font-style:italic;font-size:0.84rem;">"${posReviews[0].text}"</div>`
      : `<p style="color:var(--muted);margin:0">No positive reviews in this range.</p>`;
    $("card-top-neg").innerHTML = negReviews.length
      ? `<b>Key complaint:</b> Issues reported regarding ${sortedNeg.map(x=>x[0]).join(', ') || 'service / food'}.<div style="margin-top:8px;padding:10px;background:#fff;border-radius:8px;font-style:italic;font-size:0.84rem;">"${negReviews[0].text}"</div>`
      : `<p style="color:#10b981;margin:0">✓ No negative complaints in this range!</p>`;

    // Row 5: Dish Performance & Improvement
    const dishesPraised = Object.entries(dishMap).filter(([_,v])=>v.pos > 0).map(([k,v])=>`<span class="badge-tag badge-positive">${k} · ${v.pos} praise</span>`).join("");
    const dishesComplained = Object.entries(dishMap).filter(([_,v])=>v.neg > 0).map(([k,v])=>`<span class="badge-tag badge-negative">${k} · ${v.neg} complaints</span>`).join("");
    $("dish-praised").innerHTML = dishesPraised || `<span style="font-size:0.8rem;color:var(--muted)">None detected</span>`;
    $("dish-complained").innerHTML = dishesComplained || `<span style="font-size:0.8rem;color:#10b981">✓ Zero dish complaints</span>`;

    const activeIssues = Object.entries(issues).filter(([_,v])=>v.count > 0).sort((a,b)=>b[1].count - a[1].count).slice(0, 3);
    $("improve-list").innerHTML = activeIssues.length
      ? activeIssues.map(([p, v], i) => `
        <div style="padding:10px 12px;background:#fff8f6;border-radius:10px;border:1px solid #fbdcd6;margin-bottom:8px;">
          <div style="display:flex;justify-content:space-between;margin-bottom:3px;">
            <b style="color:#c93a54;font-size:0.85rem;">#${i+1} ${p}</b>
            <span class="pill badge-negative" style="font-size:0.7rem">Found in ${v.count} reviews</span>
          </div>
          <p style="margin:0;font-size:0.8rem;color:#4a5568"><b>Suggestion:</b> ${v.action}</p>
        </div>
      `).join("")
      : `<div style="padding:12px;background:#f0fdf4;border-radius:10px;color:#166534;font-size:0.85rem">✓ No recurring complaints detected!</div>`;

    // History Table
    const tbody = $("history-tbody");
    if (tbody) {
      tbody.innerHTML = reviews.map((r, i) => `
        <tr>
          <td style="max-width:340px;"><span style="font-size:0.84rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden">"${r.text}"</span></td>
          <td><b style="color:#f59e0b">★ ${r.stars}</b></td>
          <td><span class="pill ${r.stars >= 4 ? 'badge-positive' : r.stars === 3 ? '' : 'badge-negative'}">${r.sentiment}</span></td>
          <td><b>${r.score}%</b></td>
          <td><button type="button" data-del="${i}" style="border:none;background:none;color:#c93a54;cursor:pointer;font-weight:700">Delete</button></td>
        </tr>
      `).join("");
      $$("[data-del]").forEach(b => {
        b.addEventListener("click", () => {
          const idx = parseInt(b.dataset.del, 10);
          reviews.splice(idx, 1);
          saveReviews();
          renderDashboard();
        });
      });
    }
  }

  // Filter click handlers
  $$("[data-filter]").forEach(b => {
    b.addEventListener("click", () => {
      $$("[data-filter]").forEach(x => {
        x.style.background = "transparent";
        x.style.color = "#4a6288";
        x.style.fontWeight = "650";
      });
      b.style.background = "#fff";
      b.style.color = "var(--blue)";
      b.style.fontWeight = "800";
      currentDateFilter = b.dataset.filter;
      renderDashboard();
    });
  });

  // Empty state button scroll
  const firstRevBtn = $("analyze-first-review-btn");
  if (firstRevBtn) {
    firstRevBtn.addEventListener("click", () => {
      $("analyzer").scrollIntoView({ behavior: "smooth" });
      $("review-input").focus();
    });
  }

  // Analyze Review submission
  const reviewInput = $("review-input");
  const reviewScore = $("review-score");
  const reviewStars = $("review-stars");
  const reviewSentiment = $("review-sentiment");
  const reviewReply = $("review-reply");
  const copyReplyBtn = $("copy-reply");

  function runAnalysis(txt) {
    const res = analyze(txt);
    reviewScore.textContent = res.score + "%";
    reviewStars.textContent = "★".repeat(res.stars) + "☆".repeat(5 - res.stars) + ` (${res.stars}.0 / 5)`;
    reviewSentiment.textContent = res.sentiment;
    reviewSentiment.className = "pill " + (res.stars >= 4 ? "badge-positive" : res.stars === 3 ? "" : "badge-negative");
    reviewReply.textContent = res.reply;
    reviews.unshift(res);
    saveReviews();
    renderDashboard();
  }

  $("analyze-btn").addEventListener("click", () => {
    const val = reviewInput.value.trim();
    if (val) runAnalysis(val);
  });

  $$("[data-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      reviewInput.value = btn.dataset.preset;
      runAnalysis(btn.dataset.preset);
    });
  });

  if (copyReplyBtn) {
    copyReplyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(reviewReply.textContent);
      copyReplyBtn.textContent = "✓ Copied!";
      setTimeout(() => { copyReplyBtn.textContent = "Copy Reply"; }, 2000);
    });
  }

  // ---------------- Floating Customer Support Chatbot ----------------
  const supportFab = $("support-fab");
  const supportWindow = $("support-window");
  const closeSupportBtn = $("close-support-btn");
  const supportMessages = $("support-messages");
  const supportInput = $("support-input");
  const sendSupportBtn = $("send-support-btn");

  if (supportFab && supportWindow) {
    supportFab.addEventListener("click", () => {
      supportWindow.style.display = "flex";
      supportFab.style.display = "none";
      supportInput.focus();
    });

    closeSupportBtn.addEventListener("click", () => {
      supportWindow.style.display = "none";
      supportFab.style.display = "flex";
    });

    const addMessage = (text, isUser = false) => {
      const msg = document.createElement("div");
      msg.style.padding = "10px 12px";
      msg.style.borderRadius = isUser ? "12px 12px 2px 12px" : "12px 12px 12px 2px";
      msg.style.maxWidth = "85%";
      msg.style.lineHeight = "1.45";
      msg.style.alignSelf = isUser ? "flex-end" : "flex-start";
      msg.style.background = isUser ? "#1546b3" : "#ffffff";
      msg.style.color = isUser ? "#ffffff" : "#1e293b";
      msg.style.border = isUser ? "none" : "1px solid #e2ebfa";
      msg.style.whiteSpace = "pre-line";
      msg.textContent = text;
      supportMessages.appendChild(msg);
      supportMessages.scrollTop = supportMessages.scrollHeight;
    };

    const handleSendSupport = async (queryText) => {
      const q = queryText.trim();
      if (!q) return;
      addMessage(q, true);
      supportInput.value = "";

      try {
        const res = await fetch("/api/assistant-chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: q })
        });
        if (res.ok) {
          const data = await res.json();
          addMessage(data.reply);
          return;
        }
      } catch {}

      // Fallback
      setTimeout(() => {
        let rep = "ReviewInsight Support: For login troubleshooting, use demo password 21062006. For reviews, paste any text to see sentiment polarity.";
        const low = q.toLowerCase();
        if (low.includes("1-star") || low.includes("negative")) {
          rep = "To handle 1-star reviews: Acknowledge the issue, apologize with sincerity, move the issue offline to a manager email, and invite the guest back.";
        }
        addMessage(rep);
      }, 350);
    };

    sendSupportBtn.addEventListener("click", () => handleSendSupport(supportInput.value));
    supportInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") handleSendSupport(supportInput.value);
    });

    $$(".sup-chip").forEach(chip => {
      chip.addEventListener("click", () => handleSendSupport(chip.textContent));
    });
  }

  // ---------------- Presentation & PDF ----------------
  $("presentation-toggle").addEventListener("click", () => {
    const on = document.body.classList.toggle("presentation");
    $("presentation-toggle").textContent = on ? "Exit Presentation Mode" : "Enter Presentation Mode";
    if (on) window.scrollTo({ top: 0, behavior: "smooth" });
  });

  $("presentation-exit").addEventListener("click", () => {
    document.body.classList.remove("presentation");
    $("presentation-toggle").textContent = "Enter Presentation Mode";
  });

  $("print-bottom").addEventListener("click", () => window.print());

  $("year").textContent = new Date().getFullYear();
  renderDashboard();
})();
