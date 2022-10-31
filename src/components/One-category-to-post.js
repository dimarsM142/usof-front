import React from "react";
import {Link} from 'react-router-dom';
import './One-category-to-post.css';
const OneCategoryToPost = (props) =>{
    return(
        <div className="one-category-to-post">
            <Link to={{pathname: `/posts`, search: `?category=${props.category}`}} >{props.category}</Link>
        </div>
    );
}

export default OneCategoryToPost;