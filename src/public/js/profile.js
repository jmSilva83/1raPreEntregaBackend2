const logout = document.getElementById('logoutButton');

logout.addEventListener('click',evt=>{
    fetch('/api/sessions/logout');
})