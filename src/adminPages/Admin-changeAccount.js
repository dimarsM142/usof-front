import React, { useEffect, useState} from "react";
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import { useNavigate } from "react-router-dom";
import MyInput from "../components/UI/MyInput.js";
import MyButton from "../components/UI/MyButton.js";
import MyLoader from "../components/UI/MyLoader.js";
import Select from "react-select";
import './Admin-changeAccount.css';

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


const ChangeUser = () => {
    const router = useNavigate();
    const [info, setInfo] = useState({});
    const [errorText, setErrorText] = useState('');
    const [errorPhoto, setErrorPhoto] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [successRes, setSuccessRes] = useState(false);
    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const [fetchUserInfo, isPostsLoading, userError] = useFetching(async () => {
        const response = await PostService.getUserByLogin(localStorage.getItem('access'), window.location.pathname.slice(window.location.pathname.indexOf('change-user/') + 12));
        setInfo(response.data[0]);
    })
    const [fetchChangeUser, isChangeLoading, changeUserError] = useFetching(async () => {
        await PostService.changeUserInfoAdmin(localStorage.getItem('access'), info);
        
        setSuccessRes(true);
        setTimeout(()=>{
            router(`/posts`)
        }, 3000);
    })

    const [fetchChangeAva, isChangeAvaLoading, errorAvaChange] = useFetching(async () => {
        await PostService.changeUserAvatar(localStorage.getItem('access'), info.userID,selectedFile);
        setSuccessRes(true);
        setTimeout(()=>{
            router(`/posts`)
        }, 3000);
        
    })

    useEffect(() =>{
        fetchUserInfo();
    }, []);

    useEffect(()=>{
        if(changeUserError){
            
            if(changeUserError.data.message && changeUserError.data.message.sqlMessage && changeUserError.data.message.sqlMessage.includes("for key 'users.email'")){
                setErrorText('???????? ?????????? ?????? ??????????????????????????. ?????????????????? ????????');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else if(changeUserError.data.message && changeUserError.data.message.sqlMessage && changeUserError.data.message.sqlMessage.includes("for key 'users.login'")){
                setErrorText('?????????? ?????????? ?????? ??????????. ?????????????????? ??????????');
                const id = setTimeout(()=>{setErrorText('')}, 2000);
                setCurTimeoutID(id);
            }
            else {
                setTimeout(()=>{router(`/error`)},50)
            }
        }
        if(errorAvaChange || userError) {
            setTimeout(()=>{router(`/error`)},50)
        }
    },[changeUserError, errorAvaChange, userError]);

    function changeData(e){
        e.preventDefault();
        clearTimeout(curTimeoutID);
        
        if(!info.login){
            setErrorText('?????????????? ??????????');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!checkEmail(info.email)){
            setErrorText('?????????????? ?????????????? ????????????');
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else if(!info.fullName){
            setErrorText("?????????????? ?????????????????? ???????? ????'??");
            const id = setTimeout(()=>{setErrorText('')}, 2000);
            setCurTimeoutID(id);
        }
        else {
            fetchChangeUser();
        }       
        
    }

    function changeHandler(e){
        clearTimeout(curTimeoutID);
        e.preventDefault();
        if(e.target.files[0].type.indexOf('image')=== -1){
            setIsFilePicked(false);
            setErrorPhoto('???????????????????????? ?????? ??????????');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            setCurTimeoutID(id);
        }
        else{
            setSelectedFile(e.target.files[0]);
            setIsFilePicked(true);

        }
    }
    function handleSubmission(e){
        e.preventDefault();
        if(isFilePicked){
            fetchChangeAva();
        }
        else{
            setErrorPhoto('???????? ???? ????????????');
            const id = setTimeout(()=>{setErrorPhoto('')}, 2000);
            setCurTimeoutID(id);
        }
    }
    if(isPostsLoading || isChangeAvaLoading || isChangeLoading){
        return (
            <div>
                <div className="user">
                    <p className="header">?????????? ??????????????</p>
                    <p className="loading-text">???????????????????????? ???????????????????? ?????? ???????????????????????? ??????????. ??????????????????...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                {successRes 
                    ?
                    <div className="user">
                        <p className="header">?????????? ??????????????</p>
                        <div className="result-text">
                            <p className="main-text">???????? ?????????????? ?????????????? ??????????????.</p>
                            <p className="second-text">?????????? ?????? ???????? ???????????????????????????? ???? ?????????????? ????????????????.</p>
                        </div> 
                    </div>
                    :
                    <div className="user">
                        <p className="header">?????????? ??????????????</p>
                        <p className="user-title">?????????? ???????? ??????????????</p>
                        <div className="user-photo">
                            <img src={info.picture} alt="ava" className="ava-current"/>
                            <div className="input-container">
                                <input type="file" name="file" id='input-file' className="input-file" onChange={changeHandler} />
                                <label htmlFor="input-file" className="input-file-desc">
                                    <span className="input-file-icon">
                                        <i className="fa fa-download" aria-hidden="true"></i>
                                    </span>
                                    {isFilePicked
                                        ?
                                        <span className="input-file-text">???????? ????????????</span>
                                        :
                                        <span className="input-file-text">???????????? ????????</span>
                                    }
                                    
                                </label>
                            </div>
                            <MyButton onClick={handleSubmission}>?????????????? ????????</MyButton>
                            
                        </div>
                        {errorPhoto && <p className="error">{errorPhoto}</p>}
                        <p className="user-title">?????????? ?????????? ??????????????</p>
                        <div className="user-data">
                            <p className="user-name">??????????:</p>
                            <MyInput 
                                type="text"
                                placeholder="??????????" 
                                value={info.login} 
                                onChange={e => {                                    
                                    if(e.target.value.length - info.login.length < 0){
                                        setInfo({...info, login: e.target.value});
                                    }
                                    else if(e.target.value.length > 20){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("?????????????????????? ?????????????? ???????????? ???????????? 20 ????????????????");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[\s<>/|\\?:*"'`~,]/)) {
                                        setInfo({...info, login: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("???? ???? ???????????? ???????????? ?????????????? ?????? ???????????? ???????????? ?? ?????????? ???? ??????????????: \\ / | ? : * " + '"' + " ' ` , ~ < > ");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-name">???????????????????? ??????????:</p>
                            <MyInput 
                                type="text"
                                placeholder="??????????" 
                                value={info.email} 
                                onChange={e => { 
                                    if(e.target.value.length - info.email.length < 0){
                                        setInfo({...info, email: e.target.value})
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[^a-z_\-.@0-9]/)) {
                                        setInfo({...info, email: e.target.value})
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("?????????????????? ?????????????? ?????? ?????????? ?????????????????????? ??????????: a-z, 0-9, _, -, .");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-name">?????????? ????'??:</p>
                            <MyInput 
                                type="text"
                                placeholder="?????????? ????'??" 
                                value={info.fullName} 
                                onChange={e => {
                                    if(e.target.value.length - info.fullName.length < 0){
                                        setInfo({...info, fullName: e.target.value});
                                    }
                                    else if(e.target.value.length > 42){
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("?????????????????????? ?????????????? ???????????? ????'?? 42 ????????????????");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none';}, 1000);
                                    }
                                    else if(!e.target.value[e.target.value.length - 1].match(/[/|\\"'`]/)) {
                                        setInfo({...info, fullName: e.target.value});
                                    }
                                    else{
                                        clearTimeout(curTimeoutID);
                                        e.target.style.outline = '1px red solid';
                                        setErrorText("???? ???? ???????????? ???????????? ?????? ???????????? ???????????? ???? ??????????????: \\ / | " + '"' + " ' `");
                                        const id = setTimeout(()=>{setErrorText('')}, 2000);
                                        setCurTimeoutID(id);
                                        setTimeout(()=>{ e.target.style.outline = 'none'}, 1000);
                                    }
                                }}
                            /> 
                            <p className="user-name">????????:</p>
                            <Select 
                                className='select-create' 
                                name="roles" 
                                defaultValue={{value: 'user', label: '????????????????????'}}
                                isClearable={false}
                                isSearchable={false}
                                placeholder='??????????????????'
                                options={[{value: 'user', label: '????????????????????'}, {value: 'admin', label: '??????????????????????????'}]}
                                onChange={(e)=>{setInfo({...info, role: e.value});}} 
                                theme={theme => ({
                                    ...theme,
                                    colors: {
                                        primary: 'green',
                                        primary25: 'green',
                                        neutral0: '#FFFFFF',
                                        neutral10: 'rgba(0, 0, 0, 0.2)',
                                        neutral20: 'rgba(0, 0, 0, 0.5)',
                                        neutral30: 'rgba(0, 0, 0, 0.3)',
                                        neutral40: 'rgb(0, 125, 0)',
                                        neutral50: 'rgba(0, 0, 0, 0.7)',
                                        neutral80: 'green',
                                        danger: 'red',
                                        dangerLight: 'rgba(255, 0, 0, 0.2)',
                                    }
                                    
                                })}
                            />
                            <MyButton onClick={changeData}>??????????????</MyButton>
                        </div>
                        {errorText && <p className="error">{errorText}</p>}
                    </div>
                }
            </div>
        );
    }
   
}

export default ChangeUser;