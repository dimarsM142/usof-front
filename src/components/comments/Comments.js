import React, { useEffect, useRef, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {useFetching} from '../../hooks/useFetching.js';
import PostService from '../../API/PostService.js';
import OneComment from "./One-comment.js";
import CommentCreate from "./CommentCreate.js";
import './Comments.css';
const Comments = (props) =>{
    const router = useNavigate();
    const createElement= useRef();
    const [reply, setReply] = useState({commentID: '', author: '', content: ''});
    const [comments, setComments] = useState({});
    const [fetchComments, , errorComments] = useFetching(async () => {
        const response = await PostService.getComments(localStorage.getItem('access'), +props.id);
        setComments(response.data);
    })
    useEffect(()=>{
        if(props.id){
            fetchComments();
        }
    }, [props.id]);
    useEffect(()=>{
        if(errorComments){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    }, [errorComments]);
    return(
        <div>
            <div className="all-comments"> 
                {comments[0] 
                    ?
                        <div className="comments-container">
                            <p>Відповіді:</p>
                            {comments.map((comment)=> <OneComment comment={comment} key={comment.id} fetchComments={fetchComments} createElement={createElement} setReply={setReply}/>)}
                        </div>
                    :
                        <p className="no-comments">Відсутні коментарі:(</p>
                }

                {window.localStorage.getItem('isAuth') === 'true' &&
                    <div>
                        {props.locking === 'unlocked' &&
                            <div className="comments-create-container">
                                <p>Знаєте відповідь на запитання?</p>
                                <CommentCreate id={props.id} reply={reply} fetchComments={fetchComments} createElement={createElement} setReply={setReply}/>
                            </div>
                        }
                    </div>
                    
                }
            </div>
        </div>
    );
}

export default Comments;