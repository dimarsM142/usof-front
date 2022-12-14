import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OneCategory from "../components/One-category-to-post.js";
import './One-Post.css';
import { parseDate } from "./date-style.js";

const OnePost = (props) =>{
    const router = useNavigate();
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState('');
    const [type, setType] = useState('');
    const [favourites, setFavourites] = useState([]);
    const [isFavourite, setIsFavourite] = useState('');
    const [locking, setLocking] = useState(props.posts.locking);

    const [fetchLikes, , errorLikes] = useFetching(async () => {
        const response = await PostService.getLikesByPostID(localStorage.getItem('access'), props.posts.id);
        if(response.data.message !== '0 likes on this post'){
            setLikes(response.data);
        }
    })
    const [fetchChangeLocking, , errorChangeLocking] = useFetching(async () => {
        await PostService.patchPostLocking(localStorage.getItem('access'), props.posts.id);
    })
    const [fetchCreateLikes, , errorCreateLikes] = useFetching(async () => {
        await PostService.createLikesByPostID(localStorage.getItem('access'), props.posts.id, type);
    })
    const [fetchDeleteLikes, isDeleteLikesLoading, errorDeleteLikes] = useFetching(async () => {
        await PostService.deleteLikesByPostID(localStorage.getItem('access'), props.posts.id);
    })
    const [fetchFavourites, , errorFavourites] = useFetching(async () => {
        const response = await PostService.getFavouritesByPostID(localStorage.getItem('access'), props.posts.id);
        if(response.data.message !== '0 favourites on this post'){
            setFavourites(response.data);
        }
    })
    const [fetchCreateFavourites, , errorCreateFavourite] = useFetching(async () => {
        await PostService.createFavouritesByPostID(localStorage.getItem('access'), props.posts.id);
    })
    const [fetchDeleteFavourite, , errorDeleteFavourite] = useFetching(async () => {
        await PostService.deleteFavouritesByPostID(localStorage.getItem('access'), props.posts.id);
    })
    
    function likeFoo(e){
        e.preventDefault();
        if(localStorage.getItem('isAuth') !== 'true'){
            router('/login');
            return;
        }
        if(e.currentTarget.className === 'fa fa-thumbs-down'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-o-down');
            fetchDeleteLikes();
            props.posts.rating++;  
            setType('');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-up'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-o-up');
            fetchDeleteLikes();
            props.posts.rating--;  
            setType('');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-o-down'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-down');
            if(e.currentTarget.nextElementSibling.className === 'fa fa-thumbs-up') {
                e.currentTarget.nextElementSibling.setAttribute('class', 'fa fa-thumbs-o-up');
                fetchDeleteLikes();
                props.posts.rating -= 2;
            }
            else{
                props.posts.rating--;    
            }
            setType('dislike');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-o-up'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-up');
            if(e.currentTarget.previousElementSibling.className === 'fa fa-thumbs-down') {
                e.currentTarget.previousElementSibling.setAttribute('class', 'fa fa-thumbs-o-down');
                fetchDeleteLikes();
                props.posts.rating += 2;
            }
            else {
                props.posts.rating++;     
            }
            
            setType('like');
        }
        
    }

    useEffect(()=>{
        if(errorLikes || errorCreateLikes || errorDeleteLikes || errorFavourites || errorCreateFavourite || errorDeleteFavourite || errorChangeLocking) {
            router('/error');
        }
    },[errorLikes, errorDeleteLikes, errorCreateLikes, errorFavourites, errorCreateFavourite, errorDeleteFavourite, errorChangeLocking]);

    useEffect(()=>{
        if(type && !isDeleteLikesLoading) {
            fetchCreateLikes();
        }
    }, [type, isDeleteLikesLoading]);

    useEffect(()=>{

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
    return(
        <div className="one-post">
            <div className='post-author'>
                <Link to={{pathname: `/${props.posts.author}/posts`}}>{props.posts.author}</Link>
            </div>
            
            {props.posts.status === 'active'
                ? 
                <div className="post-status"><i className="fa fa-spinner" aria-hidden="true"></i></div>
                :
                <div className="post-status">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/>
                    </svg>
                </div>
            }
            <div className="post-date"><p>{parseDate(props.posts.date)}</p></div>
            <div  className='post-title'>
                <Link to={{pathname: `/posts/${props.posts.id}`}}>{props.posts.tittle}</Link>
            </div>
            <div className="post-content">
                {props.posts.content.length <= 300
                    ?
                    <p>{props.posts.content}</p>
                    :
                    <p>{props.posts.content.slice(0, 300) + ' ...'}</p>

                }
                
            </div>
            
            <div className="post-categories">{props.posts.categories.map((category)=> <OneCategory key={category} category={category}/>)}</div>
            <div className="post-params">
                <div className="post-comments">   
                    <Link to={{pathname: `/posts/${props.posts.id}`}}><i className="fa fa-comments" aria-hidden="true"></i></Link>
                    
                </div>
                <div className="icon-favourites">
                    {isFavourite === true 
                        ?
                        <i onClick={changeFavourite} className="fa fa-star" aria-hidden="true"></i>
                        :
                        <i onClick={changeFavourite} className="fa fa-star-o" aria-hidden="true"></i>
                    }
                </div>
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
               
                <div className="post-rating">
                    <img src='https://cdn-icons-png.flaticon.com/128/3163/3163706.png' alt='txt' />
                    <p>{props.posts.rating}</p>
                </div>                
            </div>

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
    );
}

export default OnePost;