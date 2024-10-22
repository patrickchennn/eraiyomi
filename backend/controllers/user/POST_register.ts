import { Request,Response } from "express"
import bcrypt from "bcrypt"
import isString from "lodash.isstring"
import { v4 as uuidv4 } from 'uuid';
import { userModel } from "../../schema/userSchema.js";
import retResErrJson from "../../utils/retResErrJson.js";

interface ReqBodyRegisterUser {
  username: string;
  name?: string;
  email: string;
  password: string;
  profilePictureUrl?: string
  registerationMethod: "traditional"
}
/**
 * @desc Create an account
 * @route POST `/api/user?method="traditional"`
 * @access private
 */
export const POST_Register = async (
  req: Request<{}, {}, ReqBodyRegisterUser, {method:string}>, 
  res: Response
) => {
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
    return retResErrJson(res,400,`Either ${username} 'username' or ${email} 'email' is empty. Those are required data to be filled in order to register`)
  }

  // IF: `username` has any kind of whitespace
  // https://stackoverflow.com/questions/17616624/detect-if-string-contains-any-spaces
  if (/\s/.test(username)) {
    return retResErrJson(res,400,`username '${username}' contains spaces or prohibited character`)
  }
  
  const userExists = await userModel.findOne({ $or: [{ username }, { email }] });
  
  // IF: the user already exists
  if (userExists) {
    return retResErrJson(res,400,`${username} or ${email} is already in use.`)
  }

  
  
  let user;
  if(registrationMethod==="traditional"){

    // IF: password does not exist
    if(!password){
      return retResErrJson(res,400,"Password field must not be empty.")
    }

    // It's not the client fault if the password is entered is not a literally a string type because the user were (suppossed) to not know anything, they are just given a form in the UI and demanded to input in it. 
    // If this error happens, there is something wrong with the conversion datatype. Offically considered as a server error
    // also that `bcrypt` argument expect to be either "string" or "Buffer"
    if(!isString(password)){
      return retResErrJson(res,500,`password is not a string`)
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
    return retResErrJson(res,500,"something error with the server. Cannot create an user. userModel.create() is error")
  }


  return res.status(201).json({
    message:"success creating a new user",
  })
}
