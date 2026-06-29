import Post from "../models/post.models.js"
import {ImageKit} from "@imagekit/nodejs"
import dotenv from "dotenv";

dotenv.config();
const imagekit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});
export async function CreatePost(req,res){
    try{
       
        const {title,description,category,price,isFeatured}=req.body
        const imageUrl=await imagekit.files.upload({
            file:req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
  folder: "InstaProject",
        })
        const post= await Post.create({
            title,
            description,
            category,
            price,
            isFeatured,
            image:imageUrl.url,
            addedBy:req.user.id
        })
        console.log(req.user.id)
        if(!post)
        {
            return res.status(401).json({
                message:"Internal Server error"
            })
        }
        return res.status(201).json({
            message:"Post Created SuccessFully",post
        })
    }
    catch(error)
    {    console.error(error)
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }


}

export async function getAllPost(req, res) {
  try {
    const posts = await Post.find()
      .populate("addedBy", "fullName email")
      .sort({ createdAt: -1 });
     console.log(posts)
    return res.status(200).json({
      message: "All Posts Fetched Successfully",
      totalPosts: posts.length,
      posts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}
export async function getPostById(req, res) {
  try {
    const postId = req.params.id;

    const post = await Post.findById(postId).populate(
      "addedBy",
      "fullName email"
    );

    if (!post) {
      return res.status(404).json({
        message: "Unable to fetch post",
      });
    }
    console.log(post)

    return res.status(200).json({
      message: "Post Fetched Successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function updatePost(req, res) {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "Post not found",
      });
    }

    if (post.addedBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized",
      });
    }

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.category = req.body.category || post.category;
    post.price = req.body.price || post.price;

    if (req.body.isFeatured !== undefined) {
      post.isFeatured = req.body.isFeatured;
    }

    
    if (req.file) {
      const uploadedImage = await imagekit.files.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "InstaProject",
      });

      post.image = uploadedImage.url;
    }

    await post.save();

    return res.status(200).json({
      message: "Post Updated Successfully",
      post,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
}

export async function deletePost(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user.id; // From authentication middleware

        const post = await Post.findById(postId).populate(
            "addedBy",
            "email fullName"
        );

        if (!post) {
            return res.status(404).json({
                message: "No Such Post Exists"
            });
        }

        if (post.addedBy._id.toString() !== userId) {
            return res.status(401).json({
                message: "You are unauthorized"
            });
        }

                    const deletedPost = await Post.findByIdAndDelete(
                             postId,
                         
            
                      );    
            console.log(deletedPost)

        return res.status(200).json({
            message: "Post Deleted Successfully",
            
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
}
export async function getPostByCategory(req,res){
  try{

     const {category}=req.params
     const posts=await Post.find({category:category}).populate("addedBy","email fullName").sort({createdAt:-1})

     if(posts.length==0)
     {
      return res.status(400).json({
        message:"No post found for this category"
      })
     }
     return res.status(200).json({
      message:"All post based on Category",
      totalPosts:posts.length,
      posts
     })

  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({
      message:"Internal Server Error"
    })
  }
} 
export async function getDistinctCategory(req,res){
  try{
     const categories=await Post.distinct("category")
     if(categories.length==0)
     {
      return res.status(400).json({
        message:"Unable to find Categories"
      })
     }
     return res.status(200).json({
      message:"Distinct Categories",
      totalCategories:categories.length,
      categories
     })

  }
  catch(error)
  {
    console.error(error)
    return res.status(500).json({
      message:"Internal Server Error"
    })
  }
}