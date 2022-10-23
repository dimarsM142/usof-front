const checkAuth = (e) => {
    e.preventDefault();
    if(!localStorage.getItem('access')){
        return false;
    }
    if(localStorage.getItem('isAuth')){
        return true;
    }
    else{
        return false;  
    }
      
}

export default checkAuth;