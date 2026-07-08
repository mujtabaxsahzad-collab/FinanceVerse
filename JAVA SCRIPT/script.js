/* =====================================================
   FinanceVerse JavaScript
   Beginner-friendly functions for menus, forms, search,
   calculators, localStorage, news, FAQ, and dashboard.
===================================================== */

/* LocalStorage Helper Functions */
function getStoredData(key, fallback) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
}

function saveStoredData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

/* Mobile Menu Toggle */
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const currentPageName = window.location.pathname.split("/").pop() || "index.html";

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });
}

/* Keep User Logged In Across Pages */
function updateNavbarForLogin() {
    const loggedInUser = getStoredData("loggedInUser", null);
    const navigation = document.querySelector(".nav-links");
    if (!navigation) return;

    const authLinks = Array.from(navigation.querySelectorAll("a")).filter(function (link) {
        const page = link.getAttribute("href");
        return page === "login.html" || page === "signup.html" || page === "dashboard.html" || page === "#";
    });

    authLinks.forEach(function (link) {
        const item = link.closest("li");
        if (item) item.remove();
    });

    if (loggedInUser) {
        const dashboardItem = document.createElement("li");
        dashboardItem.innerHTML = '<a href="dashboard.html" class="nav-button" id="dashboardLink">Dashboard</a>';
        navigation.appendChild(dashboardItem);

        const logoutItem = document.createElement("li");
        logoutItem.innerHTML = '<a href="#" class="nav-button logout-button" id="logoutLink">Logout</a>';
        navigation.appendChild(logoutItem);
    } else {
        const loginItem = document.createElement("li");
        loginItem.innerHTML = '<a href="login.html" class="nav-button" id="loginLink">Login</a>';
        navigation.appendChild(loginItem);
    }
}

updateNavbarForLogin();

/* Hide Signup and Get Started Buttons After Login */
function updatePageButtonsForLogin() {
    const loggedInUser = getStoredData("loggedInUser", null);
    const pageLinks = document.querySelectorAll("main a");

    pageLinks.forEach(function (link) {
        const href = link.getAttribute("href");
        const text = link.textContent.toLowerCase();
        const isAuthButton = href === "signup.html" || href === "login.html";
        const isGetStartedButton = text.includes("get started") || text.includes("start learning") || text.includes("create free account");

        if (loggedInUser && (isAuthButton || isGetStartedButton)) {
            link.classList.add("hidden-when-login");
        } else {
            link.classList.remove("hidden-when-login");
        }
    });

    const heroButtonRows = document.querySelectorAll(".button-row");
    heroButtonRows.forEach(function (row) {
        const visibleButtons = Array.from(row.querySelectorAll("a")).filter(function (link) {
            return !link.classList.contains("hidden-when-login");
        });

        if (loggedInUser && visibleButtons.length === 0 && !row.querySelector(".dashboard-cta")) {
            row.innerHTML = '<a href="dashboard.html" class="primary-button dashboard-cta">Go to Dashboard</a>';
        }
    });
}

updatePageButtonsForLogin();

/* Enhanced Footer Content */
function updateFooterContent() {
    const footer = document.querySelector(".site-footer");
    if (!footer) return;

    footer.innerHTML = `
        <div class="footer-grid">
            <div class="footer-brand">
                <p class="footer-logo">FinanceVerse</p>
                <p>Learn Money Before Money Teaches You.</p>
                <p>Beginner-friendly finance education for investing, trading, banking safety, calculators, and scam awareness.</p>
            </div>

            <div class="footer-column">
                <h3>Explore</h3>
                <a href="investments.html">Investment Guide</a>
                <a href="trading.html">Trading Guide</a>
                <a href="banking.html">Banking Guide</a>
                <a href="risks.html">Scam Awareness</a>
            </div>

            <div class="footer-column">
                <h3>Tools</h3>
                <a href="calculators.html">Calculator Center</a>
                <a href="news.html">Finance News</a>
                <a href="support.html">Expert Support</a>
                <a href="dashboard.html">User Dashboard</a>
            </div>

            <div class="footer-column">
                <h3>Connect</h3>
                <div class="footer-socials">
                    <a href="https://t.me/yourchannel" target="_blank"><i class="fa-brands fa-telegram"></i>Telegram</a>
                    <a href="https://instagram.com/yourprofile" target="_blank"><i class="fa-brands fa-instagram"></i>Instagram</a>
                    <a href="https://youtube.com/@yourchannel" target="_blank"><i class="fa-brands fa-youtube"></i>YouTube</a>
                </div>
            </div>
        </div>

        <div class="footer-bottom">
            <p>Education only. Not financial advice. Always research before investing or trading.</p>
            <p class="copyright">Copyright 2026 FinanceVerse. All rights reserved.</p>
        </div>
    `;
}

updateFooterContent();

/* Logout User */
document.addEventListener("click", function (event) {
    if (event.target.id === "logoutLink") {
        event.preventDefault();
        localStorage.removeItem("loggedInUser");
        window.location.href = "login.html";
    }
});

/* Active Navbar Link */
document.querySelectorAll(".nav-links a").forEach(function (link) {
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPageName) {
        link.classList.add("active-page");
    }
});

/* Redirect Users Based On Login State */
if ((currentPageName === "login.html" || currentPageName === "signup.html") && getStoredData("loggedInUser", null)) {
    window.location.href = "dashboard.html";
}

if (currentPageName === "dashboard.html" && !getStoredData("loggedInUser", null)) {
    window.location.href = "login.html";
}

/* Global Search and Theme Tools */
const searchTopics = [
    { title: "IPO", page: "investments.html", text: "Initial Public Offering and company listing" },
    { title: "SIP", page: "investments.html", text: "Systematic Investment Plan mutual funds" },
    { title: "Stocks", page: "investments.html", text: "Shares and equity investing" },
    { title: "Stop Loss", page: "trading.html", text: "Trading risk management" },
    { title: "Credit Card Traps", page: "banking.html", text: "Smart credit card usage" },
    { title: "UPI Safety", page: "banking.html", text: "Digital banking safety" },
    { title: "Fake Trading Gurus", page: "risks.html", text: "Scam awareness and quick rich schemes" },
    { title: "EMI Calculator", page: "calculators.html", text: "Loan monthly payment calculator" },
    { title: "SIP Calculator", page: "calculators.html", text: "Investment growth calculator" },
    { title: "Finance News", page: "news.html", text: "Forex stock market crypto economy gold" }
];

function addGlobalTools() {
    const header = document.querySelector(".site-header");
    if (!header || document.querySelector(".top-tools")) return;

    const savedTheme = getStoredData("financeVerseTheme", "cream");
    document.body.classList.add(`theme-${savedTheme}`);

    const tools = document.createElement("div");
    tools.className = "top-tools";
    tools.innerHTML = `
        <button type="button" class="tool-button" id="openSearchButton"><i class="fa-solid fa-magnifying-glass"></i> Search</button>
        <select class="theme-select" id="themeSelect" aria-label="Theme">
            <option value="cream" ${savedTheme === "cream" ? "selected" : ""}>Light Mode</option>
            <option value="blue" ${savedTheme === "blue" ? "selected" : ""}>Blue Theme</option>
            <option value="clean" ${savedTheme === "clean" ? "selected" : ""}>White Clean</option>
            <option value="dark" ${savedTheme === "dark" ? "selected" : ""}>Dark Mode</option>
        </select>
    `;
    header.insertAdjacentElement("afterend", tools);

    const modal = document.createElement("div");
    modal.className = "search-modal";
    modal.id = "globalSearchModal";
    modal.innerHTML = `
        <div class="search-panel">
            <div class="search-panel-header">
                <h2>Search FinanceVerse</h2>
                <button type="button" class="tool-button" id="closeSearchButton">Close</button>
            </div>
            <input type="search" id="globalSearchInput" placeholder="Search SIP, IPO, credit card trap...">
            <div class="search-results" id="globalSearchResults"></div>
        </div>
    `;
    document.body.appendChild(modal);
}

addGlobalTools();

function renderGlobalSearchResults(searchText) {
    const resultsBox = document.getElementById("globalSearchResults");
    if (!resultsBox) return;

    const filteredTopics = searchTopics.filter(function (item) {
        return (item.title + " " + item.text).toLowerCase().includes(searchText.toLowerCase());
    });

    resultsBox.innerHTML = filteredTopics.length ? filteredTopics.map(function (item) {
        return `<a class="search-result-item" href="${item.page}"><strong>${item.title}</strong><br>${item.text}</a>`;
    }).join("") : "<p>No topic found. Try SIP, IPO, scam, EMI, or credit card.</p>";
}

document.addEventListener("click", function (event) {
    if (event.target.closest("#openSearchButton")) {
        document.getElementById("globalSearchModal").classList.add("open");
        document.getElementById("globalSearchInput").focus();
        renderGlobalSearchResults("");
    }
    if (event.target.closest("#closeSearchButton") || event.target.id === "globalSearchModal") {
        document.getElementById("globalSearchModal").classList.remove("open");
    }
});

const themeSelect = document.getElementById("themeSelect");
if (themeSelect) {
    themeSelect.addEventListener("change", function () {
        document.body.className = document.body.className
            .split(" ").filter(function (c) { return !c.startsWith("theme-"); }).join(" ");
        document.body.classList.add(`theme-${themeSelect.value}`);
        saveStoredData("financeVerseTheme", themeSelect.value);
    });
}

const globalSearchInput = document.getElementById("globalSearchInput");
if (globalSearchInput) {
    globalSearchInput.addEventListener("input", function () {
        renderGlobalSearchResults(globalSearchInput.value);
    });
}

/* Learning Progress Tracker */
const guidePages = {
    "investments.html": "Investing",
    "trading.html": "Trading",
    "banking.html": "Banking",
    "risks.html": "Scam Awareness",
    "calculators.html": "Calculators"
};

function addMarkCompleteButton() {
    if (!guidePages[currentPageName]) return;

    const heroSection = document.querySelector(".page-hero") || document.querySelector(".section");
    const progress = getStoredData("learningProgress", {});
    const isCompleted = progress[currentPageName];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "primary-button mark-complete-button";
    button.textContent = isCompleted ? "Completed" : "Mark as Completed";
    button.disabled = Boolean(isCompleted);

    button.addEventListener("click", function () {
        const updatedProgress = getStoredData("learningProgress", {});
        updatedProgress[currentPageName] = true;
        saveStoredData("learningProgress", updatedProgress);
        button.textContent = "Completed";
        button.disabled = true;
    });

    if (heroSection && !document.querySelector(".mark-complete-button")) {
        heroSection.appendChild(button);
    }
}

addMarkCompleteButton();

/* Animated Counter Numbers */
document.querySelectorAll(".stat-number").forEach(function (counter) {
    const target = Number(counter.dataset.count);
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(function () {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        counter.textContent = `${current}+`;
    }, 35);
});

/* FAQ Accordion */
document.querySelectorAll(".faq-question").forEach(function (button) {
    button.addEventListener("click", function () {
        const answer = button.nextElementSibling;
        answer.classList.toggle("open");
    });
});

/* Password Show and Hide */
document.querySelectorAll(".toggle-password").forEach(function (button) {
    button.addEventListener("click", function () {
        const input = document.getElementById(button.dataset.target);
        if (input.type === "password") {
            input.type = "text";
            button.textContent = "Hide";
        } else {
            input.type = "password";
            button.textContent = "Show";
        }
    });
});

/* General Topic Search */
const topicSearch = document.getElementById("topicSearch");
if (topicSearch) {
    topicSearch.addEventListener("input", function () {
        const searchText = topicSearch.value.toLowerCase();
        document.querySelectorAll(".topic-card").forEach(function (card) {
            const text = (card.textContent + " " + card.dataset.topic).toLowerCase();
            card.style.display = text.includes(searchText) ? "block" : "none";
        });
    });
}

/* Scam Topic Search */
const scamSearch = document.getElementById("scamSearch");
if (scamSearch) {
    scamSearch.addEventListener("input", function () {
        const searchText = scamSearch.value.toLowerCase();
        document.querySelectorAll(".scam-card").forEach(function (card) {
            const text = (card.textContent + " " + card.dataset.scam).toLowerCase();
            card.style.display = text.includes(searchText) ? "block" : "none";
        });
    });
}

/* Sample Finance News Data */
const financeNews = [
    { id: 1, category: "Forex", title: "Currency markets watch interest rate signals", summary: "Demo update about how rate expectations can affect currency pairs." },
    { id: 2, category: "Stock Market", title: "Broad market indices trade with cautious optimism", summary: "Sample market note explaining index movement and investor sentiment." },
    { id: 3, category: "IPO", title: "New age company prepares sample public issue", summary: "Demo IPO story about valuation, demand, and listing expectations." },
    { id: 4, category: "Mutual Funds", title: "SIP flows remain steady among young investors", summary: "Educational sample news about disciplined monthly investing." },
    { id: 5, category: "Crypto", title: "Digital asset market focuses on security practices", summary: "Demo crypto update about custody, volatility, and project research." },
    { id: 6, category: "Economy", title: "Inflation data becomes key focus for households", summary: "Sample economy note about prices, savings, and purchasing power." },
    { id: 7, category: "Gold", title: "Gold stays relevant during uncertain conditions", summary: "Demo gold story about hedging and portfolio balance." },
    { id: 8, category: "Commodities", title: "Commodity prices react to supply expectations", summary: "Sample commodities update about demand, supply, and price swings." }
];

/* News Dashboard Search, Filter, and Favorites */
function renderNews() {
    const newsList = document.getElementById("newsList");
    if (!newsList) return;

    const searchText = document.getElementById("newsSearch").value.toLowerCase();
    const selectedCategory = document.getElementById("newsCategory").value;
    const favorites = getStoredData("favoriteNews", []);

    const filteredNews = financeNews.filter(function (item) {
        const matchesSearch = (item.title + item.summary + item.category).toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    newsList.innerHTML = filteredNews.map(function (item) {
        const isFavorite = favorites.some(function (favorite) { return favorite.id === item.id; });
        return `
            <article class="card news-card">
                <p class="category">${item.category}</p>
                <h2>${item.title}</h2>
                <p>${item.summary}</p>
                <button class="favorite-button" onclick="toggleFavoriteNews(${item.id})">${isFavorite ? "Saved" : "Save Favorite"}</button>
            </article>
        `;
    }).join("");
}

function toggleFavoriteNews(id) {
    const favorites = getStoredData("favoriteNews", []);
    const newsItem = financeNews.find(function (item) { return item.id === id; });
    const alreadySaved = favorites.some(function (item) { return item.id === id; });
    const updatedFavorites = alreadySaved ? favorites.filter(function (item) { return item.id !== id; }) : favorites.concat(newsItem);
    saveStoredData("favoriteNews", updatedFavorites);
    renderNews();
}

if (document.getElementById("newsList")) {
    document.getElementById("newsSearch").addEventListener("input", renderNews);
    document.getElementById("newsCategory").addEventListener("change", renderNews);
    renderNews();
}

/* Calculator Helper */
function saveCalculation(name, result) {
    const calculations = getStoredData("savedCalculations", []);
    calculations.push({ name: name, result: result, date: new Date().toLocaleString() });
    saveStoredData("savedCalculations", calculations);
}

function flashResult(element) {
    if (!element) return;
    element.classList.remove("flash");
    setTimeout(function () {
        element.classList.add("flash");
    }, 10);
}

function money(value, currency) {
    return `${currency || "INR"} ${Number(value).toFixed(2)}`;
}

function hasInvalidNumber(numbers) {
    return numbers.some(function (number) {
        return !Number.isFinite(number) || number <= 0;
    });
}

/* EMI Calculator */
const emiForm = document.getElementById("emiForm");
if (emiForm) {
    emiForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const principal = Number(document.getElementById("emiPrincipal").value);
        const annualRate = Number(document.getElementById("emiRate").value);
        const months = Number(document.getElementById("emiMonths").value);
        if (hasInvalidNumber([principal, annualRate, months])) {
            document.getElementById("emiResult").textContent = "Please enter valid positive numbers.";
            return;
        }
        const monthlyRate = annualRate / 12 / 100;
        const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, months) / (Math.pow(1 + monthlyRate, months) - 1);
        const result = `Monthly EMI: ${money(emi, "INR")}`;
        document.getElementById("emiResult").textContent = result;
        saveCalculation("EMI Calculator", result);
    });
}

/* SIP Calculator */
const sipForm = document.getElementById("sipForm");
if (sipForm) {
    sipForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const amount = Number(document.getElementById("sipAmount").value);
        const annualRate = Number(document.getElementById("sipRate").value);
        const years = Number(document.getElementById("sipYears").value);
        if (hasInvalidNumber([amount, annualRate, years])) {
            document.getElementById("sipResult").textContent = "Please enter valid positive numbers.";
            return;
        }
        const months = years * 12;
        const monthlyRate = annualRate / 12 / 100;
        const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
        const result = `Estimated value: ${money(futureValue, "INR")}`;
        document.getElementById("sipResult").textContent = result;
        saveCalculation("SIP Calculator", result);
    });
}

/* Compound Interest Calculator */
const compoundForm = document.getElementById("compoundForm");
if (compoundForm) {
    compoundForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const currency = document.getElementById("compoundCurrency").value;
        const principal = Number(document.getElementById("compoundPrincipal").value);
        const rate = Number(document.getElementById("compoundRate").value) / 100;
        const years = Number(document.getElementById("compoundYears").value);
        if (hasInvalidNumber([principal, rate, years])) {
            document.getElementById("compoundResult").textContent = "Please enter valid positive numbers.";
            return;
        }
        const total = principal * Math.pow(1 + rate, years);
        const result = `Future value: ${money(total, currency)}`;
        document.getElementById("compoundResult").textContent = result;
        saveCalculation("Compound Interest", result);
    });
}

/* Risk Reward Calculator */
const riskRewardForm = document.getElementById("riskRewardForm");
if (riskRewardForm) {
    riskRewardForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const entry = Number(document.getElementById("entryPrice").value);
        const stop = Number(document.getElementById("stopLoss").value);
        const target = Number(document.getElementById("targetPrice").value);
        const risk = Math.abs(entry - stop);
        const reward = Math.abs(target - entry);
        if (hasInvalidNumber([entry, stop, target, risk, reward])) {
            document.getElementById("riskRewardResult").textContent = "Please enter valid prices with risk and reward.";
            return;
        }
        const result = `Risk Reward Ratio: 1:${(reward / risk).toFixed(2)}`;
        document.getElementById("riskRewardResult").textContent = result;
        saveCalculation("Risk Reward", result);
    });
}

/* Budget Calculator */
const budgetForm = document.getElementById("budgetForm");
if (budgetForm) {
    budgetForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const income = Number(document.getElementById("budgetIncome").value);
        const needs = Number(document.getElementById("budgetNeeds").value);
        const wants = Number(document.getElementById("budgetWants").value);
        if (hasInvalidNumber([income]) || needs < 0 || wants < 0) {
            document.getElementById("budgetResult").textContent = "Please enter valid budget numbers.";
            return;
        }
        const savings = income - needs - wants;
        const result = `Estimated monthly savings: ${money(savings, "INR")}`;
        document.getElementById("budgetResult").textContent = result;
        saveCalculation("Budget Calculator", result);
    });
}

/* Savings Goal Calculator */
const savingsForm = document.getElementById("savingsForm");
if (savingsForm) {
    savingsForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const goal = Number(document.getElementById("goalAmount").value);
        const saved = Number(document.getElementById("savedAmount").value);
        const monthly = Number(document.getElementById("monthlySaving").value);
        if (hasInvalidNumber([goal, monthly]) || saved < 0 || saved >= goal) {
            document.getElementById("savingsResult").textContent = "Please enter a goal higher than saved amount.";
            return;
        }
        const months = Math.ceil((goal - saved) / monthly);
        const result = `Time needed: ${months} months`;
        document.getElementById("savingsResult").textContent = result;
        saveCalculation("Savings Goal", result);
    });
}

/* Signup Validation and Save User Data */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const phone = document.getElementById("signupPhone").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;
        const terms = document.getElementById("termsCheck").checked;
        const result = document.getElementById("signupResult");

        if (!name || !email || !phone || !password || !confirmPassword) {
            result.textContent = "Please fill all fields.";
            return;
        }
        if (password.length < 6) {
            result.textContent = "Password must be at least 6 characters.";
            return;
        }
        if (password !== confirmPassword) {
            result.textContent = "Passwords do not match.";
            return;
        }
        if (!terms) {
            result.textContent = "Please accept the terms.";
            return;
        }

        saveStoredData("financeVerseUser", { name: name, email: email, phone: phone, password: password });
        result.textContent = "Signup successful. You can login now.";
    });
}

/* Login Validation */
const loginForm = document.getElementById("loginForm");
if (loginForm && document.getElementById("loginEmail")) {
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;
        const user = getStoredData("financeVerseUser", null);
        const result = document.getElementById("loginResult");

        if (!user || user.email !== email || user.password !== password) {
            result.textContent = "Invalid email or password.";
            return;
        }

        saveStoredData("loggedInUser", user);
        window.location.href = "dashboard.html";
    });
}

/* Forgot Password Demo Logic */
let demoOtp = "";
const sendOtpButton = document.getElementById("sendOtpButton");
if (sendOtpButton) {
    sendOtpButton.addEventListener("click", function () {
        demoOtp = String(Math.floor(100000 + Math.random() * 900000));
        document.getElementById("otpDemo").textContent = `Demo OTP: ${demoOtp}`;
    });
}

const forgotForm = document.getElementById("forgotForm");
if (forgotForm) {
    forgotForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("forgotEmail").value.trim();
        const enteredOtp = document.getElementById("forgotOtp").value.trim();
        const newPassword = document.getElementById("newPassword").value;
        const confirmPassword = document.getElementById("confirmNewPassword").value;
        const user = getStoredData("financeVerseUser", null);
        const result = document.getElementById("forgotResult");

        if (!user || user.email !== email) {
            result.textContent = "Email not found.";
            return;
        }
        if (enteredOtp !== demoOtp) {
            result.textContent = "Incorrect OTP.";
            return;
        }
        if (newPassword.length < 6 || newPassword !== confirmPassword) {
            result.textContent = "Check password length and confirmation.";
            return;
        }

        user.password = newPassword;
        saveStoredData("financeVerseUser", user);
        result.textContent = "Password updated. Please login.";
    });
}

/* Support Ticket Generator */
const supportForm = document.getElementById("supportForm");
if (supportForm) {
    supportForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("supportName").value.trim();
        const email = document.getElementById("supportEmail").value.trim();
        const phone = document.getElementById("supportPhone").value.trim();
        const category = document.getElementById("supportCategory").value;
        const subject = document.getElementById("supportSubject").value.trim();
        const description = document.getElementById("supportDescription").value.trim();
        const screenshot = document.getElementById("supportScreenshot").files[0];
        const result = document.getElementById("supportResult");

        if (!name || !email || !phone || !category || !subject || !description) {
            result.textContent = "Please fill all required fields.";
            return;
        }

        const ticketId = `FV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const ticket = {
            ticketId: ticketId,
            name: name,
            email: email,
            phone: phone,
            category: category,
            subject: subject,
            description: description,
            screenshot: screenshot ? screenshot.name : "No screenshot",
            status: "Pending",
            date: new Date().toLocaleString()
        };

        const tickets = getStoredData("supportTickets", []);
        tickets.push(ticket);
        saveStoredData("supportTickets", tickets);
        result.textContent = `Ticket created: ${ticketId} | Status: Pending`;
        supportForm.reset();
    });
}

/* Advanced Dashboard Tools */
const financeScoreForm = document.getElementById("financeScoreForm");
if (financeScoreForm) {
    financeScoreForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const income = Number(document.getElementById("scoreIncome").value);
        const savings = Number(document.getElementById("scoreSavings").value);
        const debt = Number(document.getElementById("scoreDebt").value);
        const habit = document.getElementById("scoreHabit").value;
        const resultBox = document.getElementById("financeScoreResult");

        if (income <= 0 || savings < 0 || debt < 0) {
            resultBox.textContent = "Please enter valid finance details.";
            return;
        }

        let points = 0;
        const savingsRate = savings / income;
        const debtRate = debt / income;

        if (savingsRate >= 0.3) points += 40;
        else if (savingsRate >= 0.15) points += 25;
        else points += 10;

        if (debtRate <= 0.15) points += 30;
        else if (debtRate <= 0.35) points += 18;
        else points += 5;

        if (habit === "good") points += 30;
        if (habit === "average") points += 18;
        if (habit === "bad") points += 5;

        const label = points >= 75 ? "Excellent" : points >= 45 ? "Good" : "Poor";
        saveStoredData("financeScore", { points: points, label: label });
        resultBox.innerHTML = `Score: ${points}/100 <span class="score-pill score-${label.toLowerCase()}">${label}</span>`;
        flashResult(resultBox);
        renderDashboard();
    });
}

const quizForm = document.getElementById("quizForm");
if (quizForm) {
    quizForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const answers = [
            document.getElementById("quizOne").value,
            document.getElementById("quizTwo").value,
            document.getElementById("quizThree").value
        ];
        const score = answers.filter(function (answer) { return answer === "right"; }).length;
        const result = `Quiz Score: ${score}/3`;
        saveStoredData("quizScore", { score: score, total: 3 });
        document.getElementById("quizResult").textContent = result;
        flashResult(document.getElementById("quizResult"));
        renderDashboard();
    });
}

const goalPlannerForm = document.getElementById("goalPlannerForm");
if (goalPlannerForm) {
    goalPlannerForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const name = document.getElementById("goalName").value;
        const cost = Number(document.getElementById("goalCost").value);
        const months = Number(document.getElementById("goalMonths").value);
        const resultBox = document.getElementById("goalPlannerResult");

        if (cost <= 0 || months <= 0) {
            resultBox.textContent = "Please enter valid goal amount and months.";
            return;
        }

        const monthlySaving = cost / months;
        const result = `${name} plan: Save INR ${monthlySaving.toFixed(2)} per month for ${months} months.`;
        saveStoredData("goalPlan", { name: name, cost: cost, months: months, monthlySaving: monthlySaving });
        resultBox.textContent = result;
        flashResult(resultBox);
        renderSavingsChart();
    });
}

const advisorForm = document.getElementById("advisorForm");
if (advisorForm) {
    advisorForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const risk = document.getElementById("riskLevel").value;
        const years = Number(document.getElementById("advisorYears").value);
        const amount = Number(document.getElementById("advisorAmount").value);
        const resultBox = document.getElementById("advisorResult");

        if (years <= 0 || amount <= 0) {
            resultBox.textContent = "Please enter valid years and monthly saving.";
            return;
        }

        let suggestion = "SIP + Emergency Fund";
        if (risk === "low") suggestion = "FD + SIP + Emergency Fund";
        if (risk === "medium" && years >= 3) suggestion = "Index Fund SIP + Gold + Emergency Fund";
        if (risk === "high" && years >= 5) suggestion = "Stocks + ETF + SIP, with strict risk control";

        resultBox.textContent = `Recommended: ${suggestion}. Monthly capacity: INR ${amount}.`;
        flashResult(resultBox);
    });
}

const expenseForm = document.getElementById("expenseForm");
if (expenseForm) {
    expenseForm.addEventListener("submit", function (event) {
        event.preventDefault();
        const amount = Number(document.getElementById("expenseAmount").value);
        const category = document.getElementById("expenseCategory").value;
        if (amount <= 0) return;

        const expenses = getStoredData("expenses", []);
        expenses.push({ amount: amount, category: category, date: new Date().toLocaleDateString() });
        saveStoredData("expenses", expenses);
        expenseForm.reset();
        renderExpenseSummary();
        renderDashboard();
    });
}

function groupExpensesByCategory() {
    const expenses = getStoredData("expenses", []);
    return expenses.reduce(function (summary, item) {
        summary[item.category] = (summary[item.category] || 0) + Number(item.amount);
        return summary;
    }, {});
}

function renderBarChart(boxId, rows) {
    const chartBox = document.getElementById(boxId);
    if (!chartBox) return;

    const maxValue = Math.max.apply(null, rows.map(function (row) { return row.value; }).concat([1]));
    chartBox.innerHTML = rows.map(function (row) {
        const width = Math.max(4, Math.round((row.value / maxValue) * 100));
        return `
            <div class="bar-row">
                <strong>${row.label}</strong>
                <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
                <span>INR ${row.value.toFixed(0)}</span>
            </div>
        `;
    }).join("");
}

function renderExpenseSummary() {
    const summaryBox = document.getElementById("expenseSummary");
    if (!summaryBox) return;

    const groupedExpenses = groupExpensesByCategory();
    const rows = Object.keys(groupedExpenses).map(function (category) {
        return { label: category, value: groupedExpenses[category] };
    });
    const total = rows.reduce(function (sum, row) { return sum + row.value; }, 0);

    summaryBox.innerHTML = rows.length ? `<p><strong>Total Expenses:</strong> INR ${total.toFixed(2)}</p>` : "<p>No expenses added yet.</p>";
    renderBarChart("expenseChart", rows.length ? rows : [{ label: "None", value: 0 }]);
}

function renderSavingsChart() {
    const plan = getStoredData("goalPlan", null);
    if (!document.getElementById("savingsChart")) return;

    if (!plan) {
        renderBarChart("savingsChart", [{ label: "Month 1", value: 0 }, { label: "Month 2", value: 0 }, { label: "Month 3", value: 0 }]);
        return;
    }

    const monthsToShow = Math.min(6, plan.months);
    const rows = [];
    for (let index = 1; index <= monthsToShow; index += 1) {
        rows.push({ label: `Month ${index}`, value: plan.monthlySaving * index });
    }
    renderBarChart("savingsChart", rows);
}

/* Dashboard Data Display */
function updateTicketStatus(ticketId, status) {
    var tickets = getStoredData("supportTickets", []);
    var updatedTickets = tickets.map(function (ticket) {
        if (ticket.ticketId === ticketId) {
            ticket.status = status;
        }
        return ticket;
    });
    saveStoredData("supportTickets", updatedTickets);
    if (document.getElementById("profileBox")) {
        renderDashboard();
    }
}

function renderDashboard() {
    const profileBox = document.getElementById("profileBox");
    if (!profileBox) return;

    const user = getStoredData("loggedInUser", getStoredData("financeVerseUser", null));
    const calculations = getStoredData("savedCalculations", []);
    const tickets = getStoredData("supportTickets", []);
    const favorites = getStoredData("favoriteNews", []);
    const progress = getStoredData("learningProgress", {});
    const financeScore = getStoredData("financeScore", null);
    const quizScore = getStoredData("quizScore", null);
    const expenses = getStoredData("expenses", []);
    const completedCount = Object.keys(guidePages).filter(function (page) { return progress[page]; }).length;
    const totalGuides = Object.keys(guidePages).length;
    const progressPercent = Math.round((completedCount / totalGuides) * 100);

    const welcomeTitle = document.getElementById("welcomeTitle");
    if (welcomeTitle && user) {
        welcomeTitle.textContent = `Welcome back, ${user.name}`;
    }

    profileBox.innerHTML = user ? `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Finance Score:</strong> ${financeScore ? `${financeScore.points}/100 - ${financeScore.label}` : "Not checked yet"}</p>
        <p><strong>Quiz Score:</strong> ${quizScore ? `${quizScore.score}/${quizScore.total}` : "Not attempted yet"}</p>
    ` : "<p>No profile found. Please signup first.</p>";

    const progressBox = document.getElementById("progressBox");
    if (progressBox) {
        const guideRows = Object.keys(guidePages).map(function (page) {
            const completed = progress[page] ? 100 : 0;
            return `
                <div class="progress-row">
                    <div class="progress-label"><span>${guidePages[page]}</span><span>${completed}%</span></div>
                    <div class="progress-track"><div class="progress-fill" style="width:${completed}%"></div></div>
                </div>
            `;
        }).join("");

        progressBox.innerHTML = `
            <div class="progress-row">
                <div class="progress-label"><span>Overall Learning</span><span>${progressPercent}%</span></div>
                <div class="progress-track"><div class="progress-fill" style="width:${progressPercent}%"></div></div>
            </div>
            ${guideRows}
        `;
    }

    const earnedBadges = [
        { name: "SIP Beginner", earned: progress["investments.html"] },
        { name: "Scam Aware", earned: progress["risks.html"] },
        { name: "Budget Master", earned: calculations.some(function (item) { return item.name === "Budget Calculator"; }) || financeScore },
        { name: "Risk Manager", earned: progress["trading.html"] || (quizScore && quizScore.score >= 2) },
        { name: "Expense Tracker", earned: expenses.length > 0 }
    ];

    const badgeBox = document.getElementById("badgeBox");
    if (badgeBox) {
        badgeBox.innerHTML = `<div class="badge-list">${earnedBadges.map(function (badge) {
            return `<span class="badge ${badge.earned ? "earned" : ""}">${badge.name}</span>`;
        }).join("")}</div>`;
    }

    document.getElementById("savedCalculationsBox").innerHTML = calculations.length ? calculations.map(function (item) { return `<p><strong>${item.name}:</strong> ${item.result}</p>`; }).join("") : "<p>No saved calculations yet.</p>";
    document.getElementById("savedQueriesBox").innerHTML = tickets.length ? tickets.map(function (item) {
        return `
            <div class="ticket-row">
                <p><strong>${item.ticketId}</strong> - ${item.subject}</p>
                <select onchange="updateTicketStatus('${item.ticketId}', this.value)">
                    <option ${item.status === "Pending" ? "selected" : ""}>Pending</option>
                    <option ${item.status === "In Review" ? "selected" : ""}>In Review</option>
                    <option ${item.status === "Resolved" ? "selected" : ""}>Resolved</option>
                </select>
            </div>
        `;
    }).join("") : "<p>No saved queries yet.</p>";
    document.getElementById("favoriteNewsBox").innerHTML = favorites.length ? favorites.map(function (item) { return `<p><strong>${item.category}:</strong> ${item.title}</p>`; }).join("") : "<p>No favorite news saved yet.</p>";

    renderExpenseSummary();
    renderSavingsChart();
}

renderDashboard();

/* =====================================================
   Ask a Question - User Query Form
===================================================== */
try {
    (function () {
        var path = window.location.pathname.toLowerCase();
        if (path.indexOf("admin") !== -1) return;

        function createQuestionWidget() {
            var toggle = document.createElement("button");
            toggle.className = "q-toggle";
            toggle.id = "qToggle";
            toggle.textContent = "?";
            toggle.setAttribute("aria-label", "Ask a question");
            document.body.appendChild(toggle);

            var box = document.createElement("div");
            box.className = "q-box";
            box.id = "qBox";
            box.innerHTML =
                '<div class="q-header">' +
                    '<span style="font-size:1.2rem;">?</span>' +
                    '<h3>Ask a Question</h3>' +
                    '<button class="q-close" id="qClose">&#x2715;</button>' +
                '</div>' +
                '<div class="q-body">' +
                    '<p style="font-size:0.85rem;color:var(--navy);margin-bottom:10px;">Your question will be sent to the admin team.</p>' +
                    '<input class="q-input" id="qName" placeholder="Your name">' +
                    '<input class="q-input" id="qEmail" placeholder="Your email">' +
                    '<textarea class="q-input q-textarea" id="qMessage" placeholder="Write your question..."></textarea>' +
                    '<button class="q-send" id="qSend">Send Question</button>' +
                    '<p class="result" id="qResult"></p>' +
                '</div>';
            document.body.appendChild(box);

            document.getElementById("qToggle").onclick = function () {
                document.getElementById("qBox").classList.add("open");
                this.classList.add("open");
            };

            document.getElementById("qClose").onclick = function () {
                document.getElementById("qBox").classList.remove("open");
                document.getElementById("qToggle").classList.remove("open");
            };

            document.getElementById("qSend").onclick = function () {
                var name = document.getElementById("qName").value.trim();
                var email = document.getElementById("qEmail").value.trim();
                var message = document.getElementById("qMessage").value.trim();
                var result = document.getElementById("qResult");

                if (!name || !email || !message) {
                    result.textContent = "Please fill all fields.";
                    return;
                }

                var questions = getStoredData("finverseQuestions", []);
                questions.push({
                    id: Date.now(),
                    name: name,
                    email: email,
                    message: message,
                    date: new Date().toLocaleString(),
                    status: "Pending",
                    userAgent: navigator.userAgent
                });
                saveStoredData("finverseQuestions", questions);

                result.textContent = "Question sent! Admin will review it.";
                document.getElementById("qName").value = "";
                document.getElementById("qEmail").value = "";
                document.getElementById("qMessage").value = "";
            };
        }

        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", createQuestionWidget);
        } else {
            createQuestionWidget();
        }
    })();
} catch (e) {
    /* Silently catch any errors */
}
