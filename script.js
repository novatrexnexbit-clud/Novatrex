/* ===== AUTH SYSTEM STABLE ===== */

const AUTH_USERS = "auth_users";
const AUTH_SESSION = "auth_session";

function authShowMessage(elementId, message, type){
const el = document.getElementById(elementId);
if(!el) return;

el.className = "auth-message";
el.classList.add(type === "success" ? "auth-success" : "auth-error");
el.innerText = message;
el.style.display = "block";

setTimeout(()=>{ el.style.opacity = "1"; },10);
}

function authToggleLoading(button, loading){
const spinner = button.querySelector(".auth-spinner");
const text = button.querySelector(".auth-btn-text");

if(loading){
button.disabled = true;
spinner.style.display = "inline-block";
text.style.opacity = "0.7";
}else{
button.disabled = false;
spinner.style.display = "none";
text.style.opacity = "1";
}
}

/* REGISTER */

function authRegister(){

const email = document.getElementById("authRegisterEmail").value.trim();
const password = document.getElementById("authRegisterPassword").value.trim();
const button = document.getElementById("authRegisterBtn");

if(!email || !password){
authShowMessage("authRegisterMessage","Tous les champs sont requis","error");
return;
}

let users = JSON.parse(localStorage.getItem(AUTH_USERS)) || [];

if(users.find(u=>u.email===email)){
authShowMessage("authRegisterMessage","Email déjà existant","error");
return;
}

authToggleLoading(button,true);

setTimeout(()=>{

users.push({email,password});
localStorage.setItem(AUTH_USERS, JSON.stringify(users));

authToggleLoading(button,false);
authShowMessage("authRegisterMessage","Compte créé avec succès","success");

setTimeout(()=>{
window.location.href="login.html";
},1200);

},1500);
}

/* LOGIN */

function authLogin(){

const email = document.getElementById("authLoginEmail").value.trim();
const password = document.getElementById("authLoginPassword").value.trim();
const button = document.getElementById("authLoginBtn");

if(!email || !password){
authShowMessage("authLoginMessage","Tous les champs sont requis","error");
return;
}

let users = JSON.parse(localStorage.getItem(AUTH_USERS)) || [];
let user = users.find(u=>u.email===email && u.password===password);

if(!user){
authShowMessage("authLoginMessage","Identifiants incorrects","error");
return;
}

authToggleLoading(button,true);

setTimeout(()=>{

localStorage.setItem(AUTH_SESSION, JSON.stringify(user));

authToggleLoading(button,false);
authShowMessage("authLoginMessage","Connexion réussie","success");

setTimeout(()=>{
window.location.href="delivery.html";
},1200);

},1500);
}

/* AUTO BIND */

document.addEventListener("DOMContentLoaded",()=>{

const regBtn = document.getElementById("authRegisterBtn");
if(regBtn) regBtn.addEventListener("click",authRegister);

const logBtn = document.getElementById("authLoginBtn");
if(logBtn) logBtn.addEventListener("click",authLogin);

});
let users = JSON.parse(localStorage.getItem("users"));
let user = users[currentUserId];

document.getElementById("riskScore").innerText = user.riskEngine.riskScore;
document.getElementById("riskLevel").innerText = user.riskEngine.riskLevel;
document.getElementById("blacklistStatus").innerText = user.riskEngine.blacklisted ? "Blacklisted" : "Active";
