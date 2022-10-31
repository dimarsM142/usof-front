import React, { useEffect, useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import Comments from "../components/comments/Comments.js";
import OneCategory from "../components/One-category-to-post.js";
import { parseDate } from "../components/date-style.js";
import MyLoader from "../components/UI/MyLoader2.js";
import './Post.css'
const PostById = () => {
    const router = useNavigate();
    const [post, setPost] = useState({});
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState('');
    const [type, setType] = useState('');
    const [favourites, setFavourites] = useState([]);
    const [isFavourite, setIsFavourite] = useState('');
    const [status, setStatus] = useState('active');
    const [loading , setLoading] = useState(true);
    const [successDeleting, setSuccessDeleting] = useState(false);
    const [locking, setLocking] = useState('');
    const [fetchPost, isPostLoading, errorPost] = useFetching(async () => {
        const response = await PostService.getPostByID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
        if(response.data[0]){
            setPost(response.data[0]);
            setStatus(response.data[0].status);
            setLocking(response.data[0].locking);
        }
        else{
            router('/error');
        }
    })
    const [fetchDeletePost, isDeleteLoading, errorDeletePost] = useFetching(async () => {
        const response = await PostService.deletePostByID(localStorage.getItem('access'), post.id);
        router('/posts');
    })


    const [fetchLikes, isLikesLoading, errorLikes] = useFetching(async () => {
        const response = await PostService.getLikesByPostID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
        if(response.data.message !== '0 likes on this post'){
            setLikes(response.data);
        }
    })
    const [fetchCreateLikes, isCreateLikesLoading, errorCreateLikes] = useFetching(async () => {
        const response = await PostService.createLikesByPostID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6), type);
    })
    const [fetchDeleteLikes, isDeleteLikesLoading, errorDeleteLikes] = useFetching(async () => {
        const response = await PostService.deleteLikesByPostID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
    })

    const [fetchFavourites, isFavouritesLoading, errorFavourites] = useFetching(async () => {
        const response = await PostService.getFavouritesByPostID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
        if(response.data.message !== '0 favourites on this post'){
            setFavourites(response.data);
        }
    })
    const [fetchCreateFavourites, isCreateFavouriteLoading, errorCreateFavourite] = useFetching(async () => {
        const response = await PostService.createFavouritesByPostID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
    })
    const [fetchDeleteFavourite, isDeleteFavouriteLoading, errorDeleteFavourite] = useFetching(async () => {
        const response = await PostService.deleteFavouritesByPostID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
    })
    const [fetchChangeLocking, isChangeLocking, errorChangeLocking] = useFetching(async () => {
        const response = await PostService.patchPostLocking(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
    })
    const [fetchStatusChange, isStatusLoading, errorStatusChange] = useFetching(async () => {
        const response = await PostService.patchPostStatus(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('posts/') + 6));
        if(status === 'inactive'){
            setStatus('active');
            router('/posts');
        }
        else{
            setStatus('inactive');
            router('/posts');
        }
    })

    useEffect(()=>{
        fetchPost();
        if(localStorage.getItem('isAuth') === 'true'){
            fetchLikes();
            fetchFavourites();
        }
    }, []);
    useEffect(()=>{
        if(likes.length !== 0) {
            for(let i = 0; i < likes.length; i++){
                
                if(likes[i].whoLiked === localStorage.getItem('login')){
                    setIsLiked(likes[i].type);
                    break;
                }
            }
        };
    }, [likes]);
    
    useEffect(()=>{
        if(errorPost || errorDeletePost || errorLikes || errorCreateLikes || errorDeleteLikes || errorStatusChange || errorChangeLocking){
            router('/error');
        }
    },[errorPost, errorDeletePost, errorLikes, errorDeleteLikes, errorCreateLikes, errorStatusChange, errorChangeLocking]);

    function deletePost(e){
        setSuccessDeleting(true);
        //fetchDeletePost();
    }


    useEffect(()=>{
        if(type && !isDeleteLikesLoading){
            fetchCreateLikes();
        }
    }, [type, isDeleteLikesLoading]);


    useEffect(()=>{
        if(isPostLoading || isStatusLoading){
            setLoading(true);
        }
        else{
            if(!isLikesLoading){
                setTimeout(()=>{setLoading(false);},300);
            }
            
        }
    },[isPostLoading, isStatusLoading]);

    function likeFoo(e){
        e.preventDefault();
        if(localStorage.getItem('isAuth') !== 'true'){
            router('/login');
            return;
        }
        if(e.currentTarget.className === 'fa fa-thumbs-down'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-o-down');
            fetchDeleteLikes();
            post.rating++;  
            setType('');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-up'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-o-up');
            fetchDeleteLikes();
            post.rating--;  
            setType('');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-o-down'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-down');
            if(e.currentTarget.nextElementSibling.className === 'fa fa-thumbs-up') {
                e.currentTarget.nextElementSibling.setAttribute('class', 'fa fa-thumbs-o-up');
                fetchDeleteLikes();
                post.rating -= 2;
            }
            else{
                post.rating--;    
            }
            setType('dislike');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-o-up'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-up');
            if(e.currentTarget.previousElementSibling.className === 'fa fa-thumbs-down') {
                e.currentTarget.previousElementSibling.setAttribute('class', 'fa fa-thumbs-o-down');
                fetchDeleteLikes();
                post.rating += 2;
            }
            else {
                post.rating++;     
            }
            
            setType('like');
        }
        
    }
    useEffect(()=>{
        if(favourites.length !== 0) {
            for(let i = 0; i < favourites.length; i++){
                if(favourites[i].whoAddToFavorite === localStorage.getItem('login')){
                    setIsFavourite(true);
                    break;
                }
            }
        };
    }, [favourites]);

    function changeFavourite(e){
        e.preventDefault();
        if(localStorage.getItem('isAuth') !== 'true'){
            router('/login');
            return;
        }
        if(e.currentTarget.className === 'fa fa-star'){
            e.currentTarget.setAttribute('class', 'fa fa-star-o');
            fetchDeleteFavourite();
        }
        else if(e.currentTarget.className === 'fa fa-star-o'){
            e.currentTarget.setAttribute('class', 'fa fa-star');
            fetchCreateFavourites();
        }
    }

    function changeStatus(e){
        e.preventDefault();
        fetchStatusChange();
    }

    function lockingFoo(e) {
        e.preventDefault();
        if(locking === 'unlocked'){
            setLocking('locked');
        }
        else if(locking === 'locked'){
            setLocking('unlocked');
        }
        fetchChangeLocking();
    }
    if(loading){
        return(
            <div className="loading-one-post">
                <div className="fake-post"></div>
                <div className="fake-comments"></div>
                <div className="fake-comments"></div>
               
                <div className="loading-test">
                    <p>Відбувається завантаження даних. Зачекайте..</p>
                </div>
                <div className="loader-container">
                    <MyLoader />
                </div>
            </div>
        );
    }
    else if(successDeleting){
        return(
            <div>
                <div className="post-form">
                    <p className="header">Видалення посту</p>
                    <p className="deleting-text">Ви впевнені що хочете видалити пост?</p>
                    <div className="buttons-delete">
                        <button className='stay' onClick={e=>{e.preventDefault(); setSuccessDeleting(false);}}>Повернутись назад</button>
                        <button className="delete-profile" onClick={e=>{e.preventDefault(); fetchDeletePost();}}>Видалити пост</button>
                    </div>
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                <div>
                    <div className="post-container">
                        <div className="post">
                            <div className='post-title'>
                                <p>{post.tittle}</p>
                            </div>
                            
                            <div className='post-author'>
                                <Link to={{pathname: `/${post.author}/posts`}}>{post.author}</Link>
                            </div>
                            <div className="post-content">
                                <p>{post.content}</p>
                            </div>
                            {post.categories !== undefined 
                                && 
                                <div className="post-categories">
                                    {post.categories.map((category)=> <OneCategory key={category} category={category}/>)}
                                </div>
                            }
                            <div className="post-date"><p>{parseDate(post.date)}</p></div>
                            <div className="post-params">
                                {localStorage.getItem('role') === 'admin' &&
                                <div>
                                    {locking === 'unlocked' 
                                        ?
                                        <div className="post-locking">
                                            <i className="fa fa-check-square" onClick={lockingFoo} aria-hidden="true"></i>
                                        </div>
                                        :
                                        <div className="post-locking">
                                            <i className="fa fa-minus-square" onClick={lockingFoo} aria-hidden="true"></i>
                                        </div>
                                    }
                                    </div>
                                }
                                 <div className="icon-favourites">
                                    {isFavourite === true 
                                        ?
                                        <i onClick={changeFavourite} className="fa fa-star" aria-hidden="true"></i>
                                        :
                                        <i onClick={changeFavourite} className="fa fa-star-o" aria-hidden="true"></i>
                                    }
                                </div>
                                <div className="post-rating">
                                    <img src='https://cdn-icons-png.flaticon.com/128/3163/3163706.png' alt='txt' />
                                    <p>{post.rating}</p>
                                </div>
                            </div>
                            {post.author === window.localStorage.getItem('login') 
                                ?
                                <div className="post-status">
                                    {status === 'active'
                                        ? 
                                        <div className='resizable'>
                                                <p>Змінити статус:</p>
                                                <i  onClick={changeStatus} className="fa fa-spinner" aria-hidden="true"></i>
                                            </div>
                                        :
                                        <div className='resizable' >
                                            <p>Змінити статус:</p>
                                            <svg onClick={changeStatus} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                            </svg>
                                        </div>
                                    }
                                </div>
                                :
                                <>
                                    {window.localStorage.getItem('role') === 'admin'
                                        ?
                                        <div className="post-status">
                                            {status === 'active'
                                                ? 
                                                <div className='resizable'>
                                                        <p>Змінити статус:</p>
                                                        <i  onClick={changeStatus} className="fa fa-spinner" aria-hidden="true"></i>
                                                    </div>
                                                :
                                                <div className='resizable' >
                                                    <p>Змінити статус:</p>
                                                    <svg onClick={changeStatus} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                                    </svg>
                                                </div>
                                            }
                                        </div>
                                        :
                                        <div className="post-status">
                                            {status === 'active'
                                                ? 
                                                <div><i className="fa fa-spinner" aria-hidden="true"></i></div>
                                                :
                                                <div>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                                                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                                                    </svg>
                                                </div>
                                            }
                                        </div>
                                    }
                                </>
                            }
                            
                            {isLiked !== '' 
                                ?
                                <div className="post-likes">
                                    {isLiked === 'like'
                                        ?
                                        <div className="post-likes-container">
                                            <i className="fa fa-thumbs-o-down" aria-hidden="true" onClick={likeFoo}></i>
                                            <i className="fa fa-thumbs-up" aria-hidden="true" onClick={likeFoo}></i>
                                        </div>
                                        :
                                        <div className="post-likes-container">
                                            <i className="fa fa-thumbs-down" aria-hidden="true" onClick={likeFoo}></i>
                                            <i className="fa fa-thumbs-o-up" aria-hidden="true" onClick={likeFoo}></i>
                                        </div>
                                    }
                                </div>
                                :
                                <div className="post-likes">
                                    <div className="post-likes-container">
                                        <i className="fa fa-thumbs-o-down" aria-hidden="true" onClick={likeFoo}></i>
                                        <i className="fa fa-thumbs-o-up" aria-hidden="true" onClick={likeFoo}></i>
                                    </div>
                                </div>
                            }
                        </div>
                        {post.author === window.localStorage.getItem('login') 
                            ?
                            <div className="delete-container">
                                <button onClick={deletePost}>Видалити пост</button>
                            </div>
                            :
                            <div>
                                {window.localStorage.getItem('role') === 'admin' &&
                                    <div className="delete-container">
                                        <button onClick={deletePost}>Видалити пост</button>
                                    </div> 
                                }
                            </div>
                        }
                    </div>
                </div>
                <Comments id={post.id} locking={locking}/>
            </div>
        );
    }
   
}

export default PostById;
