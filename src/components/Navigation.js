import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import './Navigation.css'
const Navigation = (props) => {
    const router = useNavigate();

    const logOut = (e) =>{
        e.preventDefault();
        window.localStorage.setItem('access', '');
        window.localStorage.setItem('refresh', '');
        window.localStorage.setItem('isAuth', 'false');
        window.localStorage.setItem('login', '');
        window.localStorage.setItem('ava', '');
        props.clearRefresh();
        props.setAuth(false);
        setTimeout(()=>{
            router('/login');
        },400); 
        
    }
    if(props.auth){
        let loginLink = `/${localStorage.getItem('login')}/info`
        return (
            <nav className="up-nav">
                <ul>
                    <li><img className="logo" src='https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/640px-Boston_Celtics.svg.png' alt='logo'/></li>
                    <li><Link to="/posts">Пости</Link></li>
                    <li><Link to="/categories">Категорії</Link></li> 
                    <li className="rigth logout"><Link to="/login" onClick={logOut}>Вийти</Link></li>
                    <li className="rigth account">
                        <Link to={loginLink} style={{position: 'relative'}}>
                            <p>{localStorage.getItem('login')}</p>
                            {localStorage.getItem('ava') !== '' &&
                                <img src={localStorage.getItem('ava')} alt='ava' />
                            }
                            
                        </Link>
                    </li>  
                </ul>
            </nav>
        );
    }
    else{
        return (
            <nav className="up-nav">
                <ul>
                    <li><img className="logo" src='https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Boston_Celtics.svg/640px-Boston_Celtics.svg.png' alt='logo'/></li>
                    <li><Link to="/posts">Пости</Link></li>
                    <li><Link to="/categories">Категорії</Link></li> 
                    <li className="rigth"><Link to="/login">Ввійти</Link></li>
                    
                </ul>
            </nav>
        );
    }
   
}

export default Navigation;