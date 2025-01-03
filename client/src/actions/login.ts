'use server'

// import User from "@/models/User";
import bcrypt from "bcryptjs";
import {signIn} from "@/auth";

export const login = async (data: { email: string; password: string }) => {
    try {
        const {email, password} = data;

        // const existingUser = await User.findOne({email: email});
        // if (!existingUser) {
        //     return {error: "Email does not exist"};
        // }
        //
        // const isPasswordValid = await bcrypt.compare(password, existingUser?.password);
        // if (!isPasswordValid) {
        //     return {error: "Incorrect password"};
        // }

        await signIn('credentials', {
            email,
            password,
            redirect: false
        });

    } catch {
        return {error: "Login failed"};
    }
    return {success: "Login successful"};
}