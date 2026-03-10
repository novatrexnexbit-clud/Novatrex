/* ==============================
   NOVATREX CORE USER SYSTEM
   Centralized User Engine
================================ */

/* ---------- INITIALIZATION ---------- */
function initStorage() {
    if (!localStorage.getItem("users")) {
        localStorage.setItem("users", JSON.stringify({}));
    }
}

/* ---------- SESSION MANAGEMENT ---------- */
function setSession(userID) {
    localStorage.setItem("session", userID);
}

function clearSession() {
    localStorage.removeItem("session");
}

function getSession() {
    return localStorage.getItem("session");
}

/* ---------- USERS STORAGE ---------- */
function getAllUsers() {
    return JSON.parse(localStorage.getItem("users")) || {};
}

function saveAllUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

/* ---------- CURRENT USER ---------- */
function getCurrentUser() {
    const session = getSession();
    const users = getAllUsers();
    if (!session) return null;
    return users[session] || null;
}

function updateCurrentUser(updatedData) {
    const session = getSession();
    if (!session) return;

    const users = getAllUsers();
    users[session] = updatedData;
    saveAllUsers(users);
}

/* ---------- CREATE USER ---------- */
function createUser(userID, profileData) {
    const users = getAllUsers();

    users[userID] = {
        profile: profileData || {},
        wallet: {
            available: 0,
            locked: 0,
            bonus: 0,
            gains: 0
        },
        history: [],
        security: {
            twofa: false,
            pin: null
        },
        preferences: {
            notifications: false,
            signals: false,
            leverage: "1x"
        }
    };

    saveAllUsers(users);
}

/* ---------- DELETE USER ---------- */
function deleteCurrentUser() {
    const session = getSession();
    if (!session) return;

    const users = getAllUsers();
    delete users[session];

    saveAllUsers(users);
    clearSession();
}

/* ---------- PAGE PROTECTION ---------- */
function protectPage() {
    initStorage();
    const session = getSession();
    const users = getAllUsers();

    if (!session || !users[session]) {
        if (!window.location.href.includes("login.html")) {
            window.location.href = "login.html";
        }
        return false;
    }

    return true;
}
