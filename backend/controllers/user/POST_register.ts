import chalk from "chalk";

import { Request,Response } from "express"
import bcrypt from "bcrypt"
import isString from "lodash.isstring"
import { v4 as uuidv4 } from 'uuid';
import { userModel } from "../../schema/userSchema.js";

interface ReqBodyRegisterUser {
  username: string;
  name?: string;
  email: string;
  password: string;
  profilePictureUrl?: string
  registerationMethod: "traditional"|"google"
}
/**
 * @desc Create an account
 * @HTTP_request_method POST
 * @route `/api/user`
 * @query method="traditional"
 * @access private
 * @todo the `registerationMethod` intially received from `req.body`, and I think it's weird. Planning to change it by using the query params
 */
export const POST_Register = async (
  req: Request<{}, {}, ReqBodyRegisterUser, {method:string}>, 
  res: Response
) => {
  console.log(chalk.yellow(`[API] ${req.method} ${req.originalUrl}`))
  const {method: registrationMethod} = req.query


  const {
    username,
    email,
    password,
    name,
    profilePictureUrl,
  } = req.body;

  // IF: the user did not provide any of these data
  if(!username || !email){
    const msg = `Either ${username} 'username' or ${email} 'email' is empty. Those are required data to be filled.`
    console.error(chalk.red(msg));

    return res.status(400).json({
      message:msg
    });
  }

  // IF: username has any kind of whitespace
  // https://stackoverflow.com/questions/17616624/detect-if-string-contains-any-spaces
  if (/\s/.test(username)) {
    const msg = `username '${username}' contains spaces or prohibited character`
    console.error(chalk.red(msg));

    return res.status(400).json({
      message:msg
    });
  }
  
  const userExists = await userModel.findOne({ $or: [{ username }, { email }] });
  
  // IF: the user already exists
  if (userExists) {
    const msg = `${username} or ${email} is already in use.`
    console.error(chalk.red(msg));
    return res.status(400).json({message:msg});
  }

  
  
  let user;
  if(registrationMethod==="traditional"){

    // IF: password does not exist
    if(!password){
      const msg = "Password field must not be empty."

      console.error(chalk.red(msg));

      return res.status(400).json({message:msg});
    }

    // It's not the client fault if the password is entered is not a literally a string type because the user did not know anything, they are just given a form in the UI and demanded to input in it. 
    // If this error happens, there is something wrong with the conversion datatype. Offically considered as a server error
    // also that `bcrypt` argument expect to be either "string" or "Buffer"
    if(!isString(password)){
      const msg = `password is not a string`
  
      console.error(chalk.red(msg));
      return res.status(500).json({message:msg})
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password,salt);
    user = await userModel.create({
      userId:uuidv4(),
      username,
      name,
      email,
      password:hashedPw,
      profilePictureUrl:profilePictureUrl?profilePictureUrl:"https://www.gravatar.com/avatar/?d=mp"
    });
  }
  // ELSE IF: registration method using google
  // NOTE: this registration method currently (Sep 2024) disabled
  // else if(registrationMethod==="google"){
  //   user = await userModel.create({
  //     userId:uuidv4(),
  //     username,
  //     name,
  //     email,
  //     profilePictureUrl
  //   })
  // }
  


  if(!user){
    return res.status(500).json({
      message:"something error with the server. Cannot create an user. userModel.create() is error"
    });
  }


  return res.status(201).json({
    message:"success creating a new user",
  })
}
