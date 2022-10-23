import PostById from "../pages/Post";
import Posts from "../pages/Posts";
import Categories from "../pages/Categories";

import CreatePost from "../pages/Post-create";
import UserInfo from "../pages/User-info";
import UserPosts from "../pages/User-posts";

import ForgotPassword from "../pages/Forgot-password";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PasswordReset from "../pages/Reset-password";

export const privateRoutes = [
    {path:'/posts', element: Posts},
    {path:'/posts/create', element: CreatePost},
    {path:'/posts/:post_id', element: PostById},
    {path:'/categories', element: Categories},
    {path:'/:user_login/posts', element: UserPosts},
    {path:'/:user_login/info', element: UserInfo},

    
];

export const publicRoutes = [
    {path:'/posts', element: Posts},
    {path:'/posts/:post_id', element: PostById},
    {path:'/categories', element: Categories},
    {path:'/posts/login', element: Login},
    {path:'/register', element: Register},
    {path:'/forgot-password', element: ForgotPassword},
    {path:'/forgot-password/:token', element: PasswordReset},
    {path:'/:user_login/posts', element: UserPosts}
];