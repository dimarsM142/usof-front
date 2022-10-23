const checkAuth = (e) => {
    e.preventDefault();
    console.log("I~M HERE");
    console.log(localStorage.getItem('access'));
    console.log(localStorage.getItem('refresh'));
    if(!localStorage.getItem('access')){
        return false;
    }
    console.log(localStorage.getItem('isAuth'));
    if(localStorage.getItem('isAuth')){
        return true;
    }
    else{
        return false;  
    }
      
}

export default checkAuth;