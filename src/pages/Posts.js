import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OnePost from "../components/One-Post.js";
import MyLoader from "../components/UI/MyLoader2.js";
import './Posts.css';
import MySearch from "../components/UI/MySearch.js";
const Posts = () => {

    const router = useNavigate();
    const [posts, setPosts] = useState([]);
    const [params, setParams] = useState({sort:'rating', category:'', status:'', page: 1, name:''});
    const [isNext, setIsNext] = useState(10000000000000);
    const [isCategory, setIsCategory] = useState(false);
    const [name, setName] = useState('');
    const [active, setActive] = useState({date: '', rating: 'active', active: '', inactive:'', all: 'active'});
    const [loading , setLoading] = useState();
    const [fetchPosts, isPostsLoading, errorPosts] = useFetching(async () => {
        const response = await PostService.getPosts(localStorage.getItem('access'), params);
        if(!response.data.message){
            if(isNext === 10000000000000){
                const responseNext = await PostService.getPosts(localStorage.getItem('access'), params, params.page + 1);
                
                if(responseNext.data.message || responseNext.data.length === 0){
                    setIsNext(params.page);
                } 
            }    

            setPosts(response.data);
        }
        else{ 
            setPosts('0 posts');
        }
    })

    useEffect(()=>{

        if(errorPosts){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorPosts]);

    useEffect(() =>{
        if(window.location.search && window.location.search.indexOf('category') !== -1){
            setParams({...params, category: window.location.search.slice(window.location.search.indexOf('category=') + 9), page: 1});
            setIsCategory(true);
            setIsNext(10000000000000);
        }
        else{
            setParams({...params, category: '', page: 1})
            setIsCategory(true);
            setIsNext(10000000000000);
        }
    }, [window.location.search]);

    useEffect(()=>{
        if(isCategory){
            fetchPosts();
        }
    }, [params]);
    function chooseSort(e){
        if(e.target.textContent === 'за датою'){
            if(params.sort !== 'date') {
                setActive({...active,  rating: '', date: 'active'});
                setIsNext(10000000000000);
                setParams({...params, sort:"date", page: 1});
            }
        }
        else if(e.target.textContent === 'за рейтингом'){
            if(params.sort !== 'rating') {
                setActive({...active,  rating: 'active', date: ''});
                setIsNext(10000000000000);
                setParams({...params, sort:"rating", page: 1})
            }
        }
    }
    function chooseStatus(e){
        if(e.target.textContent === 'активні'){
            if(params.status !== 'active'){
                setActive({...active, active: 'active', all: '', inactive: ''});
                setIsNext(10000000000000);
                setParams({...params, status:"active", page: 1, name:''});
                setName('');
            }
        }
        else if(e.target.textContent === 'завершені'){
            if(params.status !== 'inactive'){
                setActive({...active, active: '', all: '', inactive: 'active'});
                setIsNext(10000000000000);
                setParams({...params, status:"inactive", page: 1, name:''});
                setName('');
            }
        }
        else if(e.target.textContent === 'всі'){
            if(params.status) {
                setActive({...active, active: '', all: 'active', inactive: ''});
                setIsNext(10000000000000);
                setParams({...params, status:"", page: 1, name:''});
                setName('');
            }
        }
    }
    useEffect(()=>{
        if(!isPostsLoading && posts){
            setTimeout(()=>{setLoading(false);},300);  
        }
        else{
            setLoading(true);            
        }
    },[isPostsLoading]);
    return (
        <div>
            {loading 
                ?
                <div className="loading-posts">
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="fake-posts"></div>
                    <div className="loading-test">
                        <p>Відбувається завантаження даних. Зачекайте..</p>
                    </div>
                    <div className="loader-container">
                        <MyLoader />
                    </div>
                </div>
                
                :
                <div className="all-posts">
                    <div className="left-part">
                       
                        {params.category ? <p className="title">{params.category}</p> : <p className="title">Всі категорії</p>}
                        <div className="search-container">
                            <MySearch placeholder={"Введіть те, що ви хочете знайти"} value={name} onChange={e=> setName(e.target.value)} onClickSearch={()=>{setParams({...params, name:name, page: 1}); setIsNext(10000000000000);}}/>
                        </div>
                        <div className="status-type">
                            <p className="status-title">Статус</p> 
                            <div className="status-content">
                                <p onClick={chooseStatus} className={active.active}>активні</p>
                                <p onClick={chooseStatus} className={active.inactive}>завершені</p>
                                <p onClick={chooseStatus} className={active.all}>всі</p>
                            </div>
                        </div>
                        
                        <div className="sort-type">

                            <p className="sort-title">Сортування</p> 
                            <div className="sort-content">
                                <p onClick={chooseSort} className={active.date}>за датою</p>
                                <p onClick={chooseSort} className={active.rating}>за рейтингом</p>
                            </div>
                        </div>
                    </div>
                    <div className="center-part">
                        <div className="post-create-link">
                            {localStorage.getItem('isAuth') !== 'false' 
                                ?
                                <div>
                                    <p>Не знайшли запитання?</p>
                                    <Link to='/posts/create'>Задати нове запитання</Link>
                                </div>
                                : 
                                <div>
                                    <p>Не знайшли запитання?</p>
                                    <Link to='/login'>Зайти в акаунт</Link>
                                </div>
                            }
                        </div>
                        {posts === '0 posts'
                            ?
                            <p className="no-posts">Відсутні пости, які відповідають заданим критеріям :(</p>
                            :
                            <div className="posts-container">
                                <div className="posts">
                                    {posts.map((post) =><OnePost posts={post} key={post.id}/>)}
                                </div>
                                <div className="pagination">
                                    {params.page !== 1 &&  <button onClick={()=>{setParams({...params, page: +params.page - 1})}} className='change-page left'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                        </svg>
                                    </button> }   
                                    <p className='change-page number-page'>{params.page}</p>
                                    {params.page < isNext && 
                                    <button onClick={()=>{setParams({...params, page: +params.page + 1})}} className='change-page right'>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg>
                                    </button> 
                                    }
                                </div>
                            </div>
                        }
                    </div>
                </div>     
            }
        </div>   
    );
}

export default Posts;