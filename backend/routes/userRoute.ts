import  { Router } from "express"
import { GET_user } from "../controllers/user/GET_user.js"
import { POST_Register } from "../controllers/user/POST_register.js"
import { DELETE_user } from "../controllers/user/DELETE_user.js";
import { POST_loginTraditional } from "../controllers/user/POST_login_traditional.js";
import { POST_verify } from "../controllers/user/POST_verify.js";
import { GET_users } from "../controllers/user/GET_users.js";
import APIAuth from "../middleware/APIAuth.js";
import authVerify from "../middleware/authVerify.js";

export const routerUser = Router()

routerUser.route("/api/users")
  .get(
    (req,res,next)=>APIAuth(req,res,next,true),
    GET_users
  )
;

routerUser.route("/api/user")
  .get(GET_user)
  .post(
    (req,res,next)=>APIAuth(req,res,next,true),
    POST_Register
  )
;

routerUser.route("/api/user/:userId")
  .delete(DELETE_user)
;


routerUser.route("/api/user/login-traditional")
  .post(POST_loginTraditional)
;

routerUser.route("/api/user/verify")
  .post(
    (req,res,next)=>authVerify(req,res,next,true), 
    POST_verify
  )
;