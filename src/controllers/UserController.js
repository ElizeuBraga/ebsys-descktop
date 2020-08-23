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

    update(u){
        console.log(u)
        let user = new User();
        let result = user.update(u);
        return result
    }

    async login(usr, password){
        let user = new User();
        let result = await user.auth(usr, password);

        return result;
    }
}