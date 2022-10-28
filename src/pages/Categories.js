import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OneCategory from "../components/One-category.js";
import MyLoader from "../components/UI/MyLoader2.js";
import './Categories.css';
const Categories = () => {

    const router = useNavigate();
    const [categories, setCategories] = useState([]);

    const [fetchCategories, isCategoriesLoading, errorCategories] = useFetching(async () => {
        const response = await PostService.getCategories(localStorage.getItem('access'));
        if(response.data.categories){
            setCategories(response.data.categories);
        }
        else{
            setCategories('0 categories');
        }
    })
    useEffect(()=>{
        fetchCategories();
    }, []);

    useEffect(()=>{
        if(errorCategories){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorCategories]);

    return (
        <div>

            {isCategoriesLoading 
                ?
                <div className="loading-categories">
                    <div className="fake-categories"></div>
                    <div className="fake-categories"></div>
                    <div className="fake-categories"></div>
                    <p>Відбувається завантаження даних. Зачекайте..</p>
                    <div className="loader-container">
                        <MyLoader />
                    </div>
                </div>
                :
                <div className="all-categories">
                    {categories === '0 categories'
                        ?
                            <p className="no-posts">Відсутні пости, які відповідають заданим критеріям :(</p>
                        :
                            <div className="all-categories">
                                {categories.map((category) =><OneCategory category={category} key={category.categoryID} fetchCategories={fetchCategories}/>)}
                                {localStorage.getItem('role') === 'admin' && 
                                    <div className="creating-category">
                                        <Link to='/admin/create-category'>Створити нову категорію</Link>
                                    </div>
                                }
                            </div>
                    }
                </div>
            }
        </div>
    );
}

export default Categories;