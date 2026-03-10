/* ==================================================
   RISK ENGINE - INSTITUTIONAL ARCHITECTURE
   Depends ONLY on users{} and currentUserId
================================================== */

function initializeRiskEngine(userId){

    let users = JSON.parse(localStorage.getItem("users")) || {};
    let user = users[userId];

    if(!user.riskEngine){

        user.riskEngine = {
            riskScore: 0,
            riskLevel: "low",
            trustedIPs: [],
            trustedDevices: [],
            blacklisted: false,
            lastIP: null,
            lastDevice: null,
            flaggedActivities: []
        };

        users[userId] = user;
        localStorage.setItem("users", JSON.stringify(users));
    }
}

/* ==============================
   SIMULATION HELPERS
============================== */

function simulateIP(){
    return "192.168." + Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255);
}

function simulateCountry(){
    const countries = ["FR","US","DE","SG","AE"];
    return countries[Math.floor(Math.random()*countries.length)];
}

function generateDeviceId(){
    return btoa(navigator.userAgent + Math.random()).substring(0,16);
}

/* ==============================
   RISK SCORING SYSTEM
============================== */

function updateRiskScore(user, points, reason){

    user.riskEngine.riskScore += points;

    user.riskEngine.flaggedActivities.push({
        type: reason,
        date: Date.now()
    });

    evaluateRiskLevel(user);
    applySecurityRestrictions(user);
}

function evaluateRiskLevel(user){

    const score = user.riskEngine.riskScore;

    if(score <= 29) user.riskEngine.riskLevel = "low";
    else if(score <= 59) user.riskEngine.riskLevel = "medium";
    else if(score <= 79) user.riskEngine.riskLevel = "high";
    else user.riskEngine.riskLevel = "critical";
}

/* ==============================
   BLACKLIST LOGIC
============================== */

function applySecurityRestrictions(user){

    if(user.riskEngine.riskScore >= 80){
        user.riskEngine.blacklisted = true;
    }

    if(user.security && user.security.failedAttempts >= 5){
        user.riskEngine.blacklisted = true;
    }
}

/* ==============================
   LOGIN RISK CHECK
============================== */

function processLoginRisk(user){

    const ip = simulateIP();
    const country = simulateCountry();
    const deviceId = generateDeviceId();

    /* NEW IP */
    if(user.riskEngine.lastIP && user.riskEngine.lastIP !== ip){
        updateRiskScore(user,15,"new_ip_detected");
    }

    /* NEW DEVICE */
    if(!user.riskEngine.trustedDevices.includes(deviceId)){
        updateRiskScore(user,20,"new_device_detected");
    }

    user.riskEngine.lastIP = ip;
    user.riskEngine.lastDevice = deviceId;

    if(!user.riskEngine.trustedIPs.includes(ip)){
        user.riskEngine.trustedIPs.push(ip);
    }

    if(!user.riskEngine.trustedDevices.includes(deviceId)){
        user.riskEngine.trustedDevices.push(deviceId);
    }
}

/* ==============================
   WITHDRAW VALIDATION
============================== */

function canPerformSensitiveAction(user){

    if(user.riskEngine.blacklisted){
        return "Account restricted due to security concerns.";
    }

    if(user.riskEngine.riskLevel === "high" || user.riskEngine.riskLevel === "critical"){
        if(!user.security.twoFA.enabled){
            return "High risk detected. Enable 2FA.";
        }
    }

    return true;
}

/* ==============================
   SAVE USERS
============================== */

function saveUsersGlobal(users){
    localStorage.setItem("users", JSON.stringify(users));
}
