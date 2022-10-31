import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import { useFetching } from "../hooks/useFetching";
import PostService from "../API/PostService";
import './One-category.css'
const OneCategory = (props) =>{
    
    const router = useNavigate();
    const [category, setCategory] = useState({tittle: '', content:''});
    
    const [fetchDeleteCategory, isCategoryLoading, errorDeleteCategory] = useFetching(async () => {
        PostService.deleteCategory(localStorage.getItem('access'), props.category.categoryID);
        props.fetchCategories();
    })


    useEffect(()=>{
        if(errorDeleteCategory){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorDeleteCategory]);

    function deleteCategory(e){
        e.preventDefault();
        fetchDeleteCategory();
    }
    
    return(
        <div className="category">
            {localStorage.getItem('role') === 'admin' &&
                <div className="admin-functions">
                    <div className="change-category">
                        <Link to={{pathname: `/admin/change-category/${props.category.categoryID}`}}>
                            <i className="fa fa-pencil-square-o" aria-hidden="true"></i>
                        </Link>
                    </div>
                    <div className="delete-category">
                        <i className="fa fa-times-circle-o" aria-hidden="true" onClick={deleteCategory}></i>
                    </div>
                </div>
            }
            <div className='title'>
                <Link to={{pathname: `/posts`, search: `?category=${props.category.tittle}`}} >{props.category.tittle}</Link>
            </div>
            <p className="description">{props.category.description}</p>
        </div>
    );
}

export default OneCategory;