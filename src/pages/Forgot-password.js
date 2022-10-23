import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import MyLoader from '../components/UI/MyLoader.js';
import './Forgot-password.css';

function checkEmail(email){
    let arrOfAt = email.match(/@/g);
    if(!arrOfAt || arrOfAt.length !== 1){
        return false;
    }
    if(!email.slice(email.indexOf('@') + 1) || email.slice(email.indexOf('@') + 1).indexOf('.') === -1|| email.slice(email.indexOf('@') + 1).indexOf('-') !== -1 || email.slice(email.indexOf('@') + 1).indexOf('_') !== -1){
        return false;
    }
    return true;
}

const ForgotPassword = () => {
    const router = useNavigate();
    const [message, setMessage] = useState('');
    const [dataInputed, setDataInputed] = useState({email:""});
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [fetchForgotPassword, isPostsLoading, postError] = useFetching(async () => {
            const response = await PostService.forgotPassword(dataInputed.email);
            setMessage(response.data);
    })
    useEffect(() =>{
        if(postError){
            if(postError.data.message === 'This email is not registred'){
                setErrorText('Даний email не зареєстрований');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(postError){
                router('/error');
            }
        }
    }, [postError]);
    
    function sendPass(e){
        e.preventDefault();
        clearTimeout(curTimeoutID);
        if(!checkEmail(dataInputed.email)){
            setErrorText("Введіть правильний email")
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
            return;
        }
        fetchForgotPassword();
        setDataInputed({email:''});
    }
    if(message){
        return (
            <div className="forgotForm">
            <p className="header">ЗМІНА ПАРОЛЯ</p>
            <div className="result-text">
                <p className="main-text">Пароль успішно надіслано вам на пошту.</p>
                <p className="second-text">Перейдіть по посиланню на вашій пошті, щоб встановити новий пароль.</p>
            </div>
            <p className="lastPartName">Згадали пароль?</p>
            <Link className="lastPart" to="/login">Зайти в акаунт</Link> 
        </div>
        );
    }
    else{
        return (
            <div>
                {isPostsLoading
                    ?
                    <div className="forgotForm">
                        <p className="header">ЗМІНА ПАРОЛЯ</p>
                        <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                        <div className="loader">
                            <MyLoader />
                        </div>
                    </div>
                    :
                    <div className="forgotForm">
                        <p className="header">ЗМІНА ПАРОЛЯ</p>
                        <p className="nameInput">електронна пошта:</p>
                        <MyInput 
                            type="text" 
                            placeholder="пошта" 
                            value={dataInputed.email} 
                            onChange={e => {
                                if(e.target.value.length - dataInputed.email.length < 0){
                                    setDataInputed({...dataInputed, email: e.target.value})
                                }
                                else if(!e.target.value[e.target.value.length - 1].match(/[^a-z_\-.@0-9]/)) {
                                    setDataInputed({...dataInputed, email: e.target.value})
                                }
                                else{
                                    clearTimeout(curTimeoutID);
                                    e.target.style.outline = '1px red solid';
                                    setErrorText("Дозволені символи для вводу електронної пошти: a-z, 0-9, _, -, .");
                                    const id = setTimeout(()=>{setErrorText('')}, 2000);
                                    setCurTimeoutID(id);
                                    setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                }
                            }}
                        />    
                        <MyButton type='submit' onClick={sendPass}>Надіслати</MyButton>
                        {errorText && <p className="error">{errorText}</p>} 
                        <p className="lastPartName">Згадали пароль?</p>
                        <div className="lastPart">
                            <Link to="/login">Зайти в акаунт</Link>
                        </div>
                        
                           
                    </div>   
                }      
            </div>
        );
    }

}

export default ForgotPassword;