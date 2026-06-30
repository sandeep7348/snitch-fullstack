import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.models.js";
import dotenv from "dotenv";
import { validationResult } from "express-validator";



dotenv.config();


export async function login(req, res) {
  try {
    const { email, password } = req.body;
    console.log("Login request received", { email });

    if (!email || !password) {
      console.log("Login validation failed: missing email or password");
      return res.status(400).json({
        message: "Please provide both email and password",
      });
    }
    
    const user = await User.findOne({ email });
    console.log("Login user lookup result", { email, found: !!user });
    if (!user) {
      return res.status(404).json({
        message: "No such user exists",
      });
    }


    const comparePassword = await bcrypt.compare(password, user.password);
    console.log("Password comparison result", { email, validPassword: comparePassword });
    if (!comparePassword) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      user:{
          id: user.id,
          email: user.email,
         fullName: user.fullName
        },

      token:token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function register(req, res) {
  try {
    const { email, contact, password, fullName } = req.body;

  
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log('Register request for:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with given email",
      });
    }

    const user = await User.create({
      email,
      contact,
      password,
      fullName,
    });

    if (!user) {
      return res.status(500).json({
        message: "Failed to register user",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "default_jwt_secret",
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "User registered successfully",
      user:{
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      },
      token:token,
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
}
export async function isAuthenticated(req,res,next)
{    
    try{
    const token=req.cookies.token
    if(!token)
    {
      return res.status(401).json({
        message:"You are Not Authorized"
      })
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    req.user=decoded
    next()
  }
  catch(error)
  {
    return res.status(401).json({
      message:"Invalid or Expired Token"
    })
  }
}

export async function getUserDetails(req,res){
     try{
      const id=req.user.id
      const user=await User.findById(id)
      if(!user)
      {
        return res.status(404).json({
          message:"No Such User Exists"
        })
      }
      return res.status(200).json({
        message:"User Found",
        user:{
          id:user.id,
          email:user.email,
          contact:user.contact,
          fullName:user.fullName
        }
      })
    }
    catch(error)
    {
      return res.status(500).json({
        message:"Internal Server Error"
      })
    }

      
}
export async function logOut(req,res){
      try{
         
           res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
         return res.status(200).json({
          message:"Log out Successfully",
          
         })
      }
      catch(error)
      {
         return res.status(500).json({
          message:"Internal Server Error"
         })

      }
}
