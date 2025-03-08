import { Request,Response } from "express"
import bcrypt from "bcrypt"
import isString from "lodash.isstring"
import { userModel } from "../../schema/userSchema.js";
import retResErrJson from "../../utils/retResErrJson.js";

interface ReqBodyRegisterUser {
  username: string;
  name: string;
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

  // User input check if: the user did not provide any of these data
  if(!username || !email){
    return retResErrJson(res,400,"Either username or email is empty")
  }

  // User input check if:: `username` has any kind of whitespace
  // https://stackoverflow.com/questions/17616624/detect-if-string-contains-any-spaces
  if (/\s/.test(username)) {
    return retResErrJson(res,400,`Username '${username}' contains spaces or prohibited character`)
  }
  
  const userExists = await userModel.findOne({ $or: [{ username }, { email }] });
  
  // User input check if: user already exists
  if (userExists) {
    return retResErrJson(res,400,`${username} or ${email} is already in use`)
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
      return retResErrJson(res,500,`Password is not a string`)
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPw = await bcrypt.hash(password,salt);
    user = await userModel.create({
      username,
      name,
      email,
      password:hashedPw,
      profilePictureUrl: profilePictureUrl ? profilePictureUrl:"https://www.gravatar.com/avatar/?d=mp",
      articleIdRef:[]
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
    return retResErrJson(res,500,"Something error within the server. Cannot create an user.")
  }


  return res.status(201).json({
    message:"Success creating a new user",
  })
}