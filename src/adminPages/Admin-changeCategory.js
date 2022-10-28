import React, { useEffect, useState } from "react";
import {useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import MyInput from "../components/UI/MyInput.js";
import MyButton from '../components/UI/MyButton.js';
import './Admin-createCategory.css'
import MyLoader from "../components/UI/MyLoader.js";
const ChangeCategory = () => {
    
    function addPost(e){
        e.preventDefault();
        clearTimeout(curTimeoutID);
        if(category.tittle.length === 0){
            setErrorText('Введіть назву');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else if(category.tittle.length > 20){
            setErrorText('Заповніть назву довжини менше 20 символів');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else if(category.content.length === 0){
            setErrorText('Заповніть поле опису');
            const id = setTimeout(()=>{setErrorText('')}, 4000);
            setCurTimeoutID(id);
        }
        else {
            fetchCreateCategory();
        }
        
    }
    const router = useNavigate();
    const [category, setCategory] = useState({tittle: '', content:''});
    const [errorText, setErrorText] = useState('');
    const [curTimeoutID, setCurTimeoutID] = useState();
    const [fetchCategoryByID, isCategoryByID, errorCategoryByID] = useFetching(async () => {
        const response = await PostService.getCategoryByID(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('change-category/') + 16));
        setCategory({tittle: response.data.categories[0].tittle, content: response.data.categories[0].description})
       
    })
    const [fetchCreateCategory, isCategoryLoading, errorCreateCategory] = useFetching(async () => {
        const response = await PostService.changeCategory(localStorage.getItem('access'), +window.location.pathname.slice(window.location.pathname.indexOf('change-category/') + 16),category.tittle, category.content);
        if(response.data = 'Post succesfully created'){
            setTimeout(() =>{
                router('/categories');
            }, 50);
        }
    })
    useEffect(()=>{
        fetchCategoryByID();
    },[]);

    useEffect(()=>{
        if(errorCreateCategory || errorCategoryByID){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorCreateCategory, errorCategoryByID]);

    if(isCategoryByID || isCategoryLoading){
        return(
            <div className="category-create">
                <p className="header">ЗМІНА КАТЕГОРІЇ</p>
                <p className="loading-text">Відбувається надсилання або завантаження даних. Зачекайте...</p>
                <div className="loader">
                    <MyLoader />
                </div>
            </div>
        );
    }
    else{
        return (
            <div>
                <form onSubmit={addPost} className='category-create'>
                    <p className="header">ЗМІНА КАТЕГОРІЇ</p>
                    <p className="name-title-category-create">назва</p>
                    <MyInput placeholder="назва" value={category.tittle} onChange={e => setCategory({...category, tittle: e.target.value})} />
                    <p className="name-description-category-create">опис</p>
                    <div className="description-category-create">
                        <textarea placeholder="Опис" value={category.content} onChange={e => setCategory({...category, content: e.target.value})} />
                    </div>
                    <MyButton>Змінити</MyButton>
                    {errorText && <p className="error">{errorText}</p>}
                </form>
            </div>
        );
    }
}

export default ChangeCategory;