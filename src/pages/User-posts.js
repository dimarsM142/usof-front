import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OnePost from "../components/One-Post.js";
import './User-posts.css';
import MyLoader from "../components/UI/MyLoader2.js";
import MySearch from "../components/UI/MySearch.js";
const UserPosts = () => {
    const router = useNavigate();
    const [login, setLogin] = useState({});
    const [ava, setAva] = useState('');
    const [info, setData] = useState({});
    const [posts, setPosts] = useState([]);
    const [name, setName] = useState('');
    const [params, setParams] = useState({status:'',sort: 'rating', page: 1, name: ''});
    const [isNext, setIsNext] = useState(10000000000000);
    const [active, setActive] = useState({date: '', rating: 'active', active: '', inactive:'', all: 'active'});
    const [fetchAvatarInfo, isAvatarLoading, errorAvatarInfo] = useFetching(async () => {
        const response = await PostService.getUserAvatarLogin(window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/posts')));
        setAva(response.data.picture);
    })
    const [fetchUserInfo, isUserLoading, errorUserInfo] = useFetching(async () => {
        const response = await PostService.getUserInfoLogin(window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/posts')));
        setData({login: response.data[0].login, fullName: response.data[0].fullName, rating: response.data[0].rating});
    })



    const [fetchUserPosts, isUserPostsLoading, errorUserPosts] = useFetching(async () => {
        const response = await PostService.getUserPosts(localStorage.getItem('access'), window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/posts')), params);
        if(response.data.message || response.data.length === 0){
            setPosts('0 posts');
        }
        else{ 
            setPosts(response.data);
            if(isNext === 10000000000000){
                const responseNext = await PostService.getUserPosts(localStorage.getItem('access'), window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/posts')), params, params.page + 1);
                if(responseNext.data.message || responseNext.data.length === 0){
                    setIsNext(params.page);
                }
            }
            
        }
    })

    useEffect(()=>{
        setLogin(window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/posts')));
        fetchUserInfo();
        fetchAvatarInfo();
    }, []);

    useEffect(()=>{
        if(errorUserInfo || errorUserInfo || errorAvatarInfo){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorUserInfo, errorUserPosts, errorAvatarInfo]);
    useEffect(()=>{
        fetchUserPosts();
    }, [params]);

    function chooseSort(e){
        if(e.target.textContent === 'за датою'){
            if(params.sort !== 'date') {
                setActive({...active,  rating: '', date: 'active'});
                setIsNext(10000000000000);
                setParams({...params, sort:"date", page: 1});
            }
        }
        else if(e.target.textContent === 'за рейтингом'){
            if(params.sort !== 'rating') {
                setActive({...active,  rating: 'active', date: ''});
                setIsNext(10000000000000);
                setParams({...params, sort:"rating", page: 1})
            }
        }
    }
    function chooseStatus(e){
        if(e.target.textContent === 'активні'){
            if(params.status !== 'active'){
                setActive({...active, active: 'active', all: '', inactive: ''});
                setIsNext(10000000000000);
                setParams({...params, status:"active", page: 1, name:''});
                setName('');
            }
        }
        else if(e.target.textContent === 'завершені'){
            if(params.status !== 'inactive'){
                setActive({...active, active: '', all: '', inactive: 'active'});
                setIsNext(10000000000000);
                setParams({...params, status:"inactive", page: 1, name:''});
                setName('');
            }
        }
        else if(e.target.textContent === 'всі'){
            if(params.status) {
                setActive({...active, active: '', all: 'active', inactive: ''});
                setIsNext(10000000000000);
                setParams({...params, status:"", page: 1, name:''});
                setName('');
            }
        }
    }

    return (
        <div>
            {isAvatarLoading  
                ? 
                <div className="loading-posts">
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="loading-test">
                        <p>Відбувається завантаження даних. Зачекайте..</p>
                    </div>
                    <div className="loader-container">
                        <MyLoader />
                    </div>
                </div>
                : 
                <div>        
                    {isUserLoading
                        ? 
                        <div className="loading-posts">
                            <div className="fake-posts"></div>
                            <div className="fake-posts"></div>
                            <div className="fake-posts"></div>
                            <div className="loading-test">
                                <p>Відбувається завантаження даних. Зачекайте..</p>
                            </div>
                            <div className="loader-container">
                                <MyLoader />
                            </div>
                        </div>
                        :
                        <div>      
                            {isUserPostsLoading 
                                ?
                                <div className="loading-posts">
                                    <div className="fake-posts"></div>
                                    <div className="fake-posts"></div>
                                    <div className="fake-posts"></div>
                                    <div className="loading-test">
                                        <p>Відбувається завантаження даних. Зачекайте..</p>
                                    </div>
                                    <div className="loader-container">
                                        <MyLoader />
                                    </div>
                                </div>
                                :
                                <div className="user-posts">
                                    <div className="left-part">
                                        <div className="user-posts-info">
                                            <img src={ava} alt="ava"/>
                                            <div>
                                                <p className="login">{info.login}</p>
                                                <p className="full-name">{info.fullName}</p>             
                                                <div className="user-rating">
                                                    <img src='https://cdn-icons-png.flaticon.com/128/3163/3163706.png' alt='txt' />
                                                    <p >{info.rating}</p>                                    
                                                </div>
                                            </div>
                                        </div>
                                        <div className="user-posts-favourite">
                                            <Link to={{pathname: `/${window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/posts'))}/favourite`}}>Збережені</Link>
                                        </div>
                                        <div className="search-container">
                                            <MySearch placeholder={"Введіть те, що ви хочете знайти"} value={name} onChange={e=> setName(e.target.value)} onClickSearch={()=>{setParams({...params, name:name, page: 1}); setIsNext(10000000000000);}}/>
                                        </div>
                                        <div className="status-type">
                                            <p className="status-title">Статус</p> 
                                            <div className="status-content">
                                                <p onClick={chooseStatus} className={active.active}>активні</p>
                                                <p onClick={chooseStatus} className={active.inactive}>завершені</p>
                                                <p onClick={chooseStatus} className={active.all}>всі</p>
                                            </div>
                                        </div>
                                        
                                        <div className="sort-type">
                                            <p className="sort-title">Сортування</p> 
                                            <div className="sort-content">
                                                <p onClick={chooseSort} className={active.date}>за датою</p>
                                                <p onClick={chooseSort} className={active.rating}>за рейтингом</p>
                                            </div>
                                        </div>
                                    </div> 
                                    <div className="center-part">
                                        {posts === '0 posts'
                                            ?
                                                <p className="no-posts">Відсутні пости, які відповідають заданим критеріям :(</p>
                                            :
                                            <div className="posts-container">
                                                <div className="posts">
                                                    {posts.map((post) =><OnePost posts={post} key={post.id}/>)}
                                                </div>
                                                <div className="pagination">
                                                    {params.page !== 1 &&  <button onClick={()=>{setParams({...params, page: +params.page - 1})}} className='change-page left'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                                        </svg>
                                                    </button> }   
                                                    <p className='change-page number-page'>{params.page}</p>
                                                    {params.page < isNext && 
                                                    <button onClick={()=>{setParams({...params, page: +params.page + 1})}} className='change-page right'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                                        </svg>
                                                    </button> 
                                                    }
                                                </div>
                                            </div>
                                        }
                                    </div>
                                   
                                </div>   
                            }
                        </div>
                    }
                </div>
            }  
        </div>
    );
}

export default UserPosts;