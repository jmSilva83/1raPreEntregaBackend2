import bcrypt from 'bcrypt';

class AuthService {
    static async hashPassword(password) {
        if (!password) throw new Error("Password is required");
        const salts = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salts);
    }

    static async validatePassword(password, userPassword) {
        if (!password || !userPassword) throw new Error("Password and user password are required");
        return bcrypt.compare(password, userPassword);
    }
}

export default AuthService;
