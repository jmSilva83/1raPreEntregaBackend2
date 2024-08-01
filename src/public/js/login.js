const loginForm = document.getElementById('loginForm');


loginForm.addEventListener('submit',evt=>{
    evt.preventDefault();
    const data = new FormData(loginForm);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    fetch('/api/sessions/login',{
        method:'POST',
        body:JSON.stringify(obj),
        headers:{
            'Content-Type':'application/json'
        }
    })
})