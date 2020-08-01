import {User} from '../models/User'

export class UserController{
    constructor(){

    }

    store(u){
        let user = new User();
        let result = user.create(u);

        return result;
    }

    update(u){
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