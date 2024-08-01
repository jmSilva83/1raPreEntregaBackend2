const logout = document.getElementById('logout-button');

logout.addEventListener('click',evt=>{
    fetch('/api/sessions/logout');
})