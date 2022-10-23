import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import { useFetching } from "../../hooks/useFetching";
import PostService from "../../API/PostService";
import MyButton from '../UI/MyButton.js';
import './CommentCreate.css';
const CommentCreate = (props) =>{
    const router = useNavigate();
    const [comment, setComment] = useState('');
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    function submitForm(e){
        e.preventDefault();
        clearTimeout(curTimeoutID);
        if(comment.length === 0){
            setErrorText('Заповніть поле коментаря');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else{
            fetchCreatePost();
        }
        
        
    }

    const [fetchCreatePost, isCreatePostLoading, errorCreatePost] = useFetching(async () => {
        const response = await PostService.createComment(localStorage.getItem('access'), props.id, comment);
        props.fetchComments();
        setComment('');
    })

    useEffect(()=>{
        if(errorCreatePost){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorCreatePost]);
    return(
        <form onSubmit={submitForm} className='create-comment'>
            <textarea placeholder="напишіть ваш коментар" value={comment}  onChange={e => setComment(e.target.value)} />
            <MyButton>Надіслати</MyButton>
            {errorText && <p className="error">{errorText}</p>}
        </form>
    );
}

export default CommentCreate;