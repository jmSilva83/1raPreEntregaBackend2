import usersModel from "./models/user.model.js";

export default class UsersManager {

    getUsers(){
        return usersModel.find();
    }
    getUserById(userId){
        return usersModel.findById(userId)
    }
    getUserByEmail(userEmail){
        return usersModel.findOne({email:userEmail});
    }
    createUser(user){
        return usersModel.create(user);
    }
    updateUser(userId,user) {
        return usersModel.updateOne({_id:userId},{$set:user})
    }
}