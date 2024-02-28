import Users from "../models/userModel.js"
import { hashString } from "../utils/index.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { compareString } from "../utils/index.js";
import { createJWT } from "../utils/index.js";


export const register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    //validatoin of fields
    if (!(firstName || lastName || email || password)) {
        next("Provide Required Fields Information!");
        return;
    }

    try {
        const userExist = await Users.findOne({ email });

        if (userExist) {
            next("Email Address already exists");
            return;
        }

        const hashedPassword = await hashString(password);

        const user = await Users.create({
            firstName,
            lastName,
            email,
            password,
        });

        //send email verification to user
        sendVerificationEmail(user, res);

    }

    catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }


};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    console.log(email,password,password.length);

    try {
        if (!email || !password) {
            next("PLeaase Provide user Credentials");
            return;
        }


        // find user by email
        const user = await Users.findOne({ email }).select("+password").populate({
            path: "friends",
            select: "firstName lastName location profileUrl -password",
        });


        if (!user) {
            next("Invalid email or password");
            return;
        }

        if (!user?.verified) {
            next(
                "User email is not verified. Check your email account and verify your email"
            );
            return;
        }




        //comapre password
      
        const match= password.localeCompare(user?.password);
        const isMatch = await compareString(password, user?.password);


        console.log(user.password);


        let pass1=password;
        let pass2=user?.password;
       

        
        console.log(pass1,pass2);

        if (pass1!==pass2) {
          next("Invalid email or password");
          return;
        };
        user.password = undefined;
    
        const token = createJWT(user?._id);
    
        res.status(201).json({
          success: true,
          message: "Login successfully",
          user,
          token,
        });
      } 
      catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
      }
};