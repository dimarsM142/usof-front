import React, { useEffect, useState } from "react";
import {useNavigate, Link} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import Select from 'react-select';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import './Post-create.css';
import MyLoader from "../components/UI/MyLoader.js";
const CreatePost = () => {
    
    function addPost(e){
        e.preventDefault();
        console.log(post);
        clearTimeout(curTimeoutID);
        if(post.tittle.length === 0){
            setErrorText('Введіть заголовок');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else if(post.tittle.length > 32){
            setErrorText('Заповніть заголовок довжини менше 32 символів');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else if(post.content.length === 0){
            setErrorText('Заповніть поле запитання');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else if(post.categories.length === 0){
            setErrorText('Введіть принаймні одну категорію, до якої належить це запитання');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else {
            fetchCreatePost();
        }
        
    }
    const router = useNavigate();
    const [post, setPost] = useState({tittle: '', content:'', categories: []});
    const [categories, setCategories] = useState([]);
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [fetchCategories, isCategoriesLoading, errorCategories] = useFetching(async () => {
        const response = await PostService.getCategories(localStorage.getItem('access'));
        if(response.data.categories){
            let tempArr = [];
            for(let i = 0; i < response.data.categories.length; i++){
                tempArr.push({value: response.data.categories[i].tittle, label: response.data.categories[i].tittle});
            }
            setCategories(tempArr);
        }
        else{
            setCategories('0 categories');
        }
    })
    const [fetchCreatePost, isCreatePostsLoading, errorCreatePosts] = useFetching(async () => {
        const response = await PostService.createPost(localStorage.getItem('access'), post.tittle, post.content, post.categories);
        if(response.data = 'Post succesfully created'){
            setTimeout(() =>{
                router('/posts');
            }, 50);
        }
    })
    useEffect(()=>{
        fetchCategories();
    }, []);

    useEffect(()=>{
        if(errorCategories || errorCreatePosts){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorCategories, errorCreatePosts]);

    function handleChange(e){
        setPost({...post, categories: e});
    }

    return (
       
        <div>
            {isCreatePostsLoading 
                ?
                <div className="post-create">
                    <p className="header">СТВОРЕННЯ ПОСТУ</p>
                    <p className="loading-text">Відбувається надсилання даних. Зачекайте...</p>
                    <div className="loader">
                        <MyLoader />
                    </div>
                </div>
                :
                <form onSubmit={addPost} className='post-create'>
                    <p className="header">СТВОРЕННЯ ПОСТУ</p>
                    <p className="name-title-post-create">заголовок</p>
                    <MyInput placeholder="заголовок" value={post.tittle} onChange={e => setPost({...post, tittle: e.target.value})} />
                    <p className="name-question-post-create">запитання</p>
                    <div className="question-post-create">
                        <textarea placeholder="Пост" value={post.content} onChange={e => setPost({...post, content: e.target.value})} />
                    </div>
                    <p className="name-categories-post-create">Оберіть категорії</p>
                    <Select 
                        className='select-create' 
                        isMulti options={categories} 
                        name="colors" 
                        placeholder='Категорії'
                        onChange={handleChange} 
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
                                neutral80: 'rgba(0, 0, 0, 0.6)',
                                danger: 'red',
                                dangerLight: 'rgba(255, 0, 0, 0.2)',
                            }
                            
                        })}
                    />
                    <MyButton>Поставити запитання</MyButton>
                    {errorText && <p className="error">{errorText}</p>}
                </form>
            }
        </div>   
       
    );
}

export default CreatePost;