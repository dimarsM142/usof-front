import PostById from "../pages/Post";
import Posts from "../pages/Posts";
import Categories from "../pages/Categories";

import CreatePost from "../pages/Post-create";
import UserInfo from "../pages/User-info";
import UserPosts from "../pages/User-posts";
import UserFavourites from "../pages/User-favourites";

import ForgotPassword from "../pages/Forgot-password";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PasswordReset from "../pages/Reset-password";

import Users from '../adminPages/Admin-checkUsers';
import OneUser from '../adminPages/Admin-checkOneUser';
import CreateUser from '../adminPages/Admin-createUser';
import ChangeUser from '../adminPages/Admin-changeAccount.js';
import CreateCategory from '../adminPages/Admin-createCategory';
import ChangeCategory from '../adminPages/Admin-changeCategory';

export const privateRoutes = [
    {path:'/posts', element: Posts},
    {path:'/posts/create', element: CreatePost},
    {path:'/posts/:post_id', element: PostById},
    {path:'/categories', element: Categories},
    {path:'/:user_login/posts', element: UserPosts},
    {path:'/:user_login/info', element: UserInfo},
    {path:'/:user_login/favourite', element: UserFavourites}
    
];

export const adminRoutes = [
    {path:'/posts', element: Posts},
    {path:'/posts/create', element: CreatePost},
    {path:'/posts/:post_id', element: PostById},
    {path:'/categories', element: Categories},
    {path:'/:user_login/posts', element: UserPosts},
    {path:'/:user_login/info', element: UserInfo},
    {path:'/:user_login/favourite', element: UserFavourites},
    {path: '/admin/create-category', element: CreateCategory},
    {path: '/admin/change-category/:id', element: ChangeCategory},
    {path: '/admin/users', element : Users},
    {path: '/admin/users/:login', element: OneUser},
    {path: '/admin/create-user', element: CreateUser},
    {path: '/admin/change-user/:id', element: ChangeUser}, 
];


export const publicRoutes = [
    {path:'/posts', element: Posts},
    {path:'/posts/:post_id', element: PostById},
    {path:'/categories', element: Categories},
    {path:'/posts/login', element: Login},
    {path:'/register', element: Register},
    {path:'/forgot-password', element: ForgotPassword},
    {path:'/forgot-password/:token', element: PasswordReset},
    {path:'/:user_login/posts', element: UserPosts},
    {path:'/:user_login/favourite', element: UserFavourites}
];