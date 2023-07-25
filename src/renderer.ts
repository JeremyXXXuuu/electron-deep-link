// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

interface UserInfo {
    name: string;
    email: string;
    picture?: string;
    profile: {
      name: string;
      group: string;
    };
  }
 
const login =document.getElementById('log-in');
login.addEventListener('click',()=>{
    window.electron.login();
})

const logout =document.getElementById('log-out');
logout.addEventListener('click',()=>{
    window.electron.logout();
})

const userInfoButton =document.getElementById('user-info-button');
userInfoButton.addEventListener('click',()=>{
    window.electron.userInfo();
})

const userInfo =document.getElementById('user-info');
window.electron.ipcRenderer.on('userInfo',(args: UserInfo)=>{
    // console.log(args);
    if( args === null || args === undefined){
        userInfo.innerHTML = 'Not logged in';
        return;
    }
    userInfo.innerHTML = args.profile.name + ' from ' + args.profile.group;
} )