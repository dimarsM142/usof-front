import React, { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import {useFetching} from '../hooks/useFetching.js';
import PostService from '../API/PostService.js';
import OneUser from "./one-user.js";
import MyLoader from "../components/UI/MyLoader2.js";
import './Admin-checkUsers.css';

const Users = () => {

    const router = useNavigate();
    const [users, setUsers] = useState([]);
    const [fetchUsers, isUsersLoading, errorUsers] = useFetching(async () => {
        const response = await PostService.getUsers(localStorage.getItem('access'));
        if(!response.data.message){
            setUsers(response.data);
        }
        else{ 
            setUsers('0 posts');
        }
    })

    useEffect(()=>{

        if(errorUsers){
            setTimeout(()=>{
                router('/error');
            },50);
        }
    },[errorUsers]);

   

    useEffect(()=>{
        fetchUsers();
    }, []);
    
    return (
        <div>
            {isUsersLoading 
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
                <div className="all-users">
                    <div className="creating-user">
                        <Link to='/admin/create-user'>Створити нового користувача</Link>
                    </div>
                    {users === '0 posts'
                        ?
                        <p className="no-users">Відсутні пости, які відповідають заданим критеріям :(</p>
                        :
                        <div className="user-container">
                            {users.map((user) =><OneUser user={user} key={user.userID}/>)}
                        </div>
                    }
                </div> 
            }
        </div>   
    );
}

export default Users;