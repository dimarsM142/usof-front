import React, { useEffect, useState } from "react";

import {BrowserRouter, Route, Routes, Navigate} from 'react-router-dom';
import Error from "./pages/Error";
import Login from "./pages/Login";
import Posts from "./pages/Posts"
import Navigation from "./components/Navigation.js";
import Footer from "./components/Footer.js";
import { privateRoutes, publicRoutes } from "./router";
import PostService from "./API/PostService";
import { useFetching } from "./hooks/useFetching";
function App() {
    const [timerID, setTimerID] = useState('');
    const[auth, setAuth] = useState(localStorage.getItem('isAuth') === 'false' ? false : true);


    function clearRefresh(){
        if(timerID){
            clearInterval(timerID);
        }
    }
    function createRefresh(){
        let timerIdCurrent = setInterval(refreshToken, 60 * 50 * 1000);
        setTimerID(timerIdCurrent);
    }
    function refreshToken(){
        fetchRefresh();
        console.log("TICK");
    }
    useEffect(() =>{
        if(localStorage.getItem('isAuth') === 'true'){
            refreshToken();
        }
        else{
            setAuth(false);
        }
    }, []);
  
    const [fetchRefresh, isPostsLoading, refreshError] = useFetching(async () => {
        const response = await PostService.refreshToken(localStorage.getItem('refresh'));
            if(response.data && response.data.AccessToken){
                console.log("Я ОНОВИВ ТОКЕНИ")
                localStorage.setItem('access', response.data.AccessToken);
                localStorage.setItem('refresh', response.data.RefreshToken);
                localStorage.setItem('isAuth', 'true');
                setAuth(true);                
            }
        
    })
    useEffect(()=>{
        if(refreshError){
            setAuth(false);
            localStorage.setItem('access', '');
            localStorage.setItem('refresh', '');
            localStorage.setItem('isAuth', 'false');
            console.log("ЗМІНИВСЯ СТАТУС ПОМИЛКИ!");
            console.log(refreshError);
        }
    }, [refreshError]);
    return (
        <div className="App">
            
            <BrowserRouter>
            <Navigation auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>
            {auth
                ?
                <Routes>
                    {privateRoutes.map(route =>
                            <Route path={route.path} element={<route.element auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>} key={route.path} />
                        )
                    }
                    <Route path="/posts" element={<Posts auth={auth} setAuth={setAuth} refreshToken={createRefresh} clearRefresh={clearRefresh}/>} />
                    <Route path="/" element={<Navigate to="/posts" replace />} />
                    <Route path="/error" element={<Error refreshToken={createRefresh}/>} />
                    <Route path="*" element={<Navigate to="/error" replace />} />
                </Routes>
                :
                <Routes>
                     {publicRoutes.map(route =>
                            <Route path={route.path} element={<route.element auth={auth} setAuth={setAuth} refreshToken={createRefresh}/>} key={route.path} />
                        )
                    }
                    <Route path="/error" element={<Error />} />
                    <Route path="/login" element={<Login auth={auth} setAuth={setAuth} refreshToken={createRefresh}/>} />
                    <Route path="*" element={<Navigate to="/login" replace />} />
                </Routes>
            }
           <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
