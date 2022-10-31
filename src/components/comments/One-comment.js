import React, { useEffect, useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import * as Scroll from 'react-scroll';
import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import { parseDate } from "../date-style";
import './One-comment.css';
let ScrollLink = Scroll.Link;
const OneComment = (props) =>{
    const [likes, setLikes] = useState([]);
    const [isLiked, setIsLiked] = useState('');
    const [type, setType] = useState('');
    const [locking, setLocking] = useState(props.comment.locking);
    const router = useNavigate();
    function deletePost(e){
        e.preventDefault();
        fetchDeleteComment();
    }
    const [fetchDeleteComment, isDeleteLoading, errorDeleteComment] = useFetching(async () => {
        const response = await PostService.deleteCommentByID(localStorage.getItem('access'), props.comment.id);
        props.fetchComments();
    })

    const [fetchLikes, isLikesLoading, errorLikes] = useFetching(async () => {
        const response = await PostService.getLikesByCommentID(localStorage.getItem('access'), props.comment.id);
        if(response.data.message !== '0 likes on this post'){
            setLikes(response.data);
        }
    })

    const [fetchCreateLikes, isCreateLikesLoading, errorCreateLikes] = useFetching(async () => {

        const response = await PostService.createLikesByCommentID(localStorage.getItem('access'), props.comment.id, type);
    })
    const [fetchDeleteLikes, isDeleteLikesLoading, errorDeleteLikes] = useFetching(async () => {
        const response = await PostService.deleteLikesByCommentID(localStorage.getItem('access'), props.comment.id);
    })
    const [fetchChangeLocking, isChangeLocking, errorChangeLocking] = useFetching(async () => {
        const response = await PostService.patchCommentLocking(localStorage.getItem('access'), props.comment.id);
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
            props.comment.rating++;  
            setType('');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-up'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-o-up');
            fetchDeleteLikes();
            props.comment.rating--;  
            setType('');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-o-down'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-down');
            if(e.currentTarget.nextElementSibling.className === 'fa fa-thumbs-up') {
                e.currentTarget.nextElementSibling.setAttribute('class', 'fa fa-thumbs-o-up');
                fetchDeleteLikes();
                props.comment.rating -= 2;
            }
            else{
                props.comment.rating--;    
            }
            setType('dislike');
        }
        else if(e.currentTarget.className === 'fa fa-thumbs-o-up'){
            e.currentTarget.setAttribute('class', 'fa fa-thumbs-up');
            if(e.currentTarget.previousElementSibling.className === 'fa fa-thumbs-down') {
                e.currentTarget.previousElementSibling.setAttribute('class', 'fa fa-thumbs-o-down');
                fetchDeleteLikes();
                props.comment.rating += 2;
            }
            else {
                props.comment.rating++;     
            }
            
            setType('like');
        }
        
    }


    useEffect(()=>{
        if(errorDeleteComment || errorCreateLikes || errorDeleteLikes || errorLikes){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorDeleteComment, errorCreateLikes, errorDeleteLikes, errorLikes]);


    useEffect(()=>{
        if(type && !isDeleteLikesLoading){
            fetchCreateLikes();
        }
    }, [type, isDeleteLikesLoading]);

    useEffect(()=>{
        fetchLikes();
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
    function replyFoo(){
        if(localStorage.getItem('isAuth') === 'true'){
            props.setReply({commentID: props.comment.id, author: props.comment.authorOfComment, content: props.comment.comment});
            props.createElement.current.focus();
        }
        else{
            router('/login');
            return;
        }
        
    }
    const closeMenu = () => {};
    return(
        <div>
            {props.comment.replyID !== null &&
                <div className="reply-up-side">
                    <Link to={{pathname: `/${props.comment.replyAuthor}/posts`}} className="reply-author">@{props.comment.replyAuthor}</Link>
                    {props.comment.replyComment.length < 30
                        ?
                        <ScrollLink to={props.comment.replyID.toString()} className='reply-comment' spy={true} smooth={true} offset={-60} duration={500} onClick={closeMenu}>
                            {props.comment.replyComment}
                        </ScrollLink>
                        :
                        <ScrollLink to={props.comment.replyID.toString()} className='reply-comment' spy={true} smooth={true} offset={-60} duration={500} onClick={closeMenu}>
                            {props.comment.replyComment.slice(0, 30) + ' ...'}
                        </ScrollLink>
                    }
                </div>
            }
            <div className="one-comment" id={props.comment.id}>
                <div className="comment-author">
                    <Link to={{pathname: `/${props.comment.authorOfComment}/posts`}}>{props.comment.authorOfComment}</Link>

                </div>
                <div className="comment-content">
                    <p>{props.comment.comment}</p>
                </div>
                <div className="comment-date"><p>{parseDate(props.comment.commentDate)}</p></div>
                <div className="comment-rating">
                    <img src='https://cdn-icons-png.flaticon.com/128/3163/3163706.png' alt='txt' />
                    <p>{props.comment.rating}</p>
                </div>
                <div className="comment-reply">
                    <i className="fa fa-reply" aria-hidden="true" onClick={replyFoo}></i>
                </div>
                <div className="comment-locking-container">
                    {localStorage.getItem('role') === 'admin' &&
                        <div>
                            {locking === 'unlocked' 
                                ?
                                <div className="comment-locking">
                                    <i className="fa fa-check-square" onClick={lockingFoo} aria-hidden="true"></i>
                                </div>
                                :
                                <div className="comment-locking">
                                    <i className="fa fa-minus-square" onClick={lockingFoo} aria-hidden="true"></i>
                                </div>
                            }
                        </div>
                    }
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
                {localStorage.getItem('login') === props.comment.authorOfComment ? 
                    <div className="delete-comment">
                        <i onClick={deletePost} className="fa fa-times-circle-o" aria-hidden="true"></i>
                    </div>
                    :
                        <div className="delete-comment">
                            {localStorage.getItem('role') === 'admin' &&
                                <i onClick={deletePost} className="fa fa-times-circle-o" aria-hidden="true"></i>
                            }
                        </div>
                }
            </div>
        </div>
    );
   
}

export default OneComment;