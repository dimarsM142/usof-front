import axios from "axios";

export default class PostService {
    static async login(login, password){
        let obj = {login:login, password:password};
        
        const response = await axios.post('https://us0f-backend.herokuapp.com/api/auth/login',
        obj, 
        {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        return response;
    }
    static async register(login, password, email, fullName){
        let obj = {login:login, password:password, passwordConfirmation: password, email:email, fullName:fullName};
        
        const response = await axios.post('https://us0f-backend.herokuapp.com/api/auth/register',
        obj, 
        {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        return response;
    }
    static async forgotPassword(email){
        const response = await axios.post(
            'https://us0f-backend.herokuapp.com/api/auth/password-reset',
            {email: email}, 
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        return response;
    }

    static async resetPassword(password, token){
        const response = await axios.post(
            `https://us0f-backend.herokuapp.com/api/auth/password-reset/${token}`,
            {password: password}, 
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        return response;
    }

    static async refreshToken(token){
        const response = await axios.post(
            `https://us0f-backend.herokuapp.com/api/auth/refresh`,
            {refreshToken: token},
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        return response;
    }

    static async getUserInfo(token){
        
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/me/users`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }
    static async changeUserInfo(token, info){
        let obj = {login:info.login, email:info.email, fullName:info.fullName};
        const response = await axios.patch(
            `https://us0f-backend.herokuapp.com/api/me/users`,
            obj,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }
    static async deleteUserInfo(token){
        const response = await axios.delete(
            `https://us0f-backend.herokuapp.com/api/me/users`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }
    static async patchUserAvatar(token, selectedFile){
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        const response = await axios.patch(
            `https://us0f-backend.herokuapp.com/api/users/me/avatar`,
            formData,
            {'headers': {'Content-Type':'multipart/form-data', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }

    static async getUserAvatar(token){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/users/me/avatar`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }
    static async getUserAvatarLogin(login){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/users/avatar/${login}`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        
        return response;
    }
    static async getUserInfoLogin(login){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/users/${login}`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json'}});
        
        return response;

    }

    static async getUserPosts(token, login, params, page = null){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/posts`,
            {params: {
                author: login,
                sort: params.sort,
                status: params.status,
                page: page || params.page
            },
            'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }

    static async getPosts(token, params, page = null){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/posts`,
            {params: {
                category: params.category,
                sort: params.sort,
                status: params.status,
                page: page || params.page
            },
            'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }
    static async getPostByID(token, id){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/posts/${id}`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }

    static async patchPostStatus(token, id){
        const response = await axios.patch(
            `https://us0f-backend.herokuapp.com/api/posts/${id}/status`,
            {},
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }

    static async getComments(token, id){
        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/posts/${id}/comments`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer '  + token}});
        
        return response;
    }

    static async getCategories(token){
        const response = await axios.get(
            'https://us0f-backend.herokuapp.com/api/categories',
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        
        return response;
    }

    static async createPost(token, tittle, content, categories){
        let categoriesString = '';
        
        for(let i = 0; i < categories.length; i++){
            categoriesString += categories[i].value;
            if(i !== categories.length - 1){
                categoriesString+=', ';
            }
        }
        const response = await axios.post(
            'https://us0f-backend.herokuapp.com/api/posts',
            {tittle: tittle, content: content, categories:categoriesString}, 
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }


    static async deletePostByID(token, id){
        const response = await axios.delete(
            `https://us0f-backend.herokuapp.com/api/posts/${id}`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        
        return response;
    }

    static async createComment(token, id, content){
        
        const response = await axios.post(
            `https://us0f-backend.herokuapp.com/api/posts/${id}/comments`,
            {content: content}, 
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }

    static async deleteCommentByID(token, id){
        const response = await axios.delete(
            `https://us0f-backend.herokuapp.com/api/comments/${id}`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        
        return response;
    }

    static async getLikesByPostID(token, id){

        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/posts/${id}/like`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }
    static async createLikesByPostID(token, id, type){

        const response = await axios.post(
            `https://us0f-backend.herokuapp.com/api/posts/${id}/like`,
            {type: type},
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }
    static async deleteLikesByPostID(token, id){
        const response = await axios.delete(
            `https://us0f-backend.herokuapp.com/api/posts/${id}/like`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }


    static async getLikesByCommentID(token, id){

        const response = await axios.get(
            `https://us0f-backend.herokuapp.com/api/comments/${id}/like`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }
    static async createLikesByCommentID(token, id, type){

        const response = await axios.post(
            `https://us0f-backend.herokuapp.com/api/comments/${id}/like`,
            {type: type},
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }
    static async deleteLikesByCommentID(token, id){
        const response = await axios.delete(
            `https://us0f-backend.herokuapp.com/api/comments/${id}/like`,
            {'headers': {'Content-Type':'application/json', 'Accept':'application/json', 'Authorization': 'Bearer ' + token}});
        return response;
    }
}