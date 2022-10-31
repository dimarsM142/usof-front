import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OnePost from "../components/One-Post.js";
import './User-favourites.css';
import MyLoader from "../components/UI/MyLoader2.js";
const UserFavourites = () => {
    const router = useNavigate();
    const [ava, setAva] = useState('');
    const [info, setData] = useState({});
    const [posts, setPosts] = useState([]);
    const [params, setParams] = useState({status:'',sort: 'rating', page: 1});
    const [isNext, setIsNext] = useState(10000000000000);
    const [fetchAvatarInfo, isAvatarLoading, errorAvatarInfo] = useFetching(async () => {
        const response = await PostService.getUserAvatarLogin(window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/favourite')));
        setAva(response.data.picture);
    })
    const [fetchUserInfo, isUserLoading, errorUserInfo] = useFetching(async () => {
        const response = await PostService.getUserInfoLogin(window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/favourite')));
        setData({login: response.data[0].login, fullName: response.data[0].fullName, rating: response.data[0].rating});
    })



    const [fetchUserPosts, isUserPostsLoading, errorUserPosts] = useFetching(async () => {
        const response = await PostService.getFavouritesByUserLogin(localStorage.getItem('access'), window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/favourite')), params.page);
        if(response.data.message || response.data.length === 0){
            setPosts('0 posts');
        }
        else{ 
            setPosts(response.data);
            if(isNext === 10000000000000){
                const responseNext = await PostService.getFavouritesByUserLogin(localStorage.getItem('access'), window.location.pathname.slice(1, window.location.pathname.lastIndexOf('/favourite')), params.page + 1);
                if(responseNext.data.message || responseNext.data.length === 0){
                    setIsNext(params.page);
                }
            }
            
        }
    })

    useEffect(()=>{

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
                                <div className="user-favourite-posts">
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
                                    </div> 
                                    <div className="center-part">
                                        
                                        {posts === '0 posts'
                                            ?
                                                <p className="no-posts">Відсутні збережені пости :(</p>
                                            :
                                            <div className="posts-container">
                                                <p className="left-title">Збережені пости</p>
                                                <div className="posts">
                                                    {posts.map((post) =><OnePost posts={post} key={post.id} />)}
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

export default UserFavourites;