import {User} from '../models/User'

export class UserController{
    constructor(){

    }

    async index(){
        let user = new User();
        let users = await user.all();
        return users;
    }

    store(u){
        let user = new User();
        let result = user.create(u);

        return result;
    }

    update(u, resetpwd = false){
        let user = new User();
        let result = user.update(u, resetpwd);
        return result
    }

    async login(usr, password){
        let user = new User();
        let result = await user.auth(usr, password);

        return result;
    }
}