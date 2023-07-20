// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

 
const login =document.getElementById('log-in');
login.addEventListener('click',()=>{
    window.electron.login();
})

const logout =document.getElementById('log-out');
logout.addEventListener('click',()=>{
    window.electron.logout();
})