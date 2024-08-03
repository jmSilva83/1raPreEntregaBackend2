import bcrypt from 'bcrypt';

export default class AuthService {
    async hashPassword(password) {
        if (!password) throw new Error("Password is required");
        const salts = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salts);
    }

    async validatePassword(password, userPassword) {
        if (!password || !userPassword) throw new Error("Password and user password are required");
        return bcrypt.compare(password, userPassword);
    }
}


