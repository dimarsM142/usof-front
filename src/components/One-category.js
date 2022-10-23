import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import './One-category.css'
const OneCategory = (props) =>{
    return(
        <div className="category">
            <div className='title'>
                <Link to={{pathname: `/posts`, search: `?category=${props.category.tittle}`}} >{props.category.tittle}</Link>
            </div>
            <p className="description">{props.category.description}</p>
        </div>
    );
}

export default OneCategory;