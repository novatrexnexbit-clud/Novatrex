initializeRiskEngine(currentUserId);

let users = JSON.parse(localStorage.getItem("users"));
let user = users[currentUserId];

processLoginRisk(user);

if(user.riskEngine.blacklisted){
    alert("Account restricted due to security concerns.");
    return;
}

saveUsersGlobal(users);
