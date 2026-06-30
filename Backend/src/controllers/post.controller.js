import Post from "../models/post.models.js"
import {ImageKit} from "@imagekit/nodejs"
import dotenv from "dotenv";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import {Pinecone} from "@pinecone-database/pinecone"
dotenv.config();
const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
});
const pinecone = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });


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
        const document = `
Title: ${title}
Category: ${category}
Description: ${description}
Price: ₹${price}
`;

const [vector] = await embeddings.embedDocuments([document]);
   
        const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
        await index.upsert([
  {
    id: post._id.toString(),
    values: vector,
    metadata: {
      title,
      description,
      category,
      price: Number(price),
    
      productId: post._id.toString(),
    },
  },
]);
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
    const document = `
Title: ${post.title}
Category: ${post.category}
Description: ${post.description}
Price: ₹${post.price}
`;

const [vector] = await embeddings.embedDocuments([document]);

const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

await index.upsert([
  {
    id: post._id.toString(),
    values: vector,
    metadata: {
      productId: post._id.toString(),
      title: post.title,
      description: post.description,
      category: post.category,
      price: Number(post.price),
    },
  },
]);

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
    const { postId } = req.params;
    const userId = req.user.id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        message: "No Such Post Exists",
      });
    }

    if (post.addedBy.toString() !== userId) {
      return res.status(403).json({
        message: "You are unauthorized",
      });
    }

    
    const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
    await index.deleteOne(postId);

    
    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      message: "Post Deleted Successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
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