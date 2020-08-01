import {User} from '../models/User'

export class UserController{
    store(u){
        let user = new User();
        let result = user.create(u);

        return result;
    }

    async login(usr, password){
        let user = new User();
        let result = await user.auth(usr, password);

        return result;
    }
}