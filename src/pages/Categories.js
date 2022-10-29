import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OneCategory from "../components/One-category.js";
import MyLoader from "../components/UI/MyLoader2.js";
import MySearch from "../components/UI/MySearch.js";
import './Categories.css';
const Categories = () => {

    const router = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [name, setName] = useState('');
    const [fetchCategories, isCategoriesLoading, errorCategories] = useFetching(async () => {
        const response = await PostService.getCategories(localStorage.getItem('access'));
        if(response.data.categories){
            setCategories(response.data.categories);
            setSelectedCategories(response.data.categories);
        }
        else{
            setCategories('0 categories');
            setSelectedCategories('0 categories');
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
    function searchFoo(){
        if(name.length === 0){
            setSelectedCategories(categories);
        }
        else{
            let temArpp = [];
            for(let i = 0; i < categories.length; i++) {
                if(categories[i].tittle.toLowerCase().includes(name.toLowerCase()) || categories[i].description.toLowerCase().includes(name.toLowerCase())){
                    temArpp.push(categories[i]); 
                }
            }
            if(temArpp.length > 0){ 
                setSelectedCategories(temArpp)
            }
            else {
                setSelectedCategories('0 categories');
            }     
        }
    }
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
                    {selectedCategories === '0 categories'
                        ?
                            <div>
                                {categories !== '0 categories' &&
                                    <div className="search-container">
                                        <MySearch placeholder={"Введіть категорії, які ви хочете знайти"} value={name} onChange={e=> setName(e.target.value)} onClickSearch={searchFoo}/>
                                    </div>
                                }
                                <p className="no-posts">Відсутні категорії, які відповідають заданим критеріям :(</p>
                            </div>
 
                        :
                            <div className="all-categories">
                                <div className="search-container">
                                    <MySearch placeholder={"Введіть категорії, які ви хочете знайти"} value={name} onChange={e=> setName(e.target.value)} onClickSearch={searchFoo}/>
                                </div>
                                {selectedCategories.map((category) =><OneCategory category={category} key={category.categoryID} fetchCategories={fetchCategories}/>)}
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