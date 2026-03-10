let users = JSON.parse(localStorage.getItem("users"));
let user = users[currentUserId];

const riskCheck = canPerformSensitiveAction(user);

if(riskCheck !== true){
    alert(riskCheck);
    return;
}
