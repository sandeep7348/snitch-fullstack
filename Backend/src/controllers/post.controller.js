import Post from "../models/post.models.js"
import {ImageKit} from "@imagekit/nodejs"
import dotenv from "dotenv";
dotenv.config();
import { MistralAIEmbeddings } from "@langchain/mistralai";
import {Pinecone} from "@pinecone-database/pinecone"


console.log("MISTRAL_API_KEY =", process.env.MISTRAL_API_KEY);

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY
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
       
        const { title, description, category, price, stock, isFeatured } = req.body;
        const imageUrl=await imagekit.files.upload({
            file:req.file.buffer.toString("base64"),
            fileName: req.file.originalname,
  folder: "InstaProject",
        })
          const post = await Post.create({
              title,
              description,
              category,
              price,
              stock,
              isFeatured,
              image: imageUrl.url,
              addedBy: req.user.id
          });
            const document = `
                Title: ${title}
                Category: ${category}
                Description: ${description}
                Price: ₹${price}
                Stock: ${stock}
                `;
        const [vector] = await embeddings.embedDocuments([document]);
   
        const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
        await index.upsert({
  records: [
    {
      id: post._id.toString(),
      values: vector,
              metadata: {
            title,
            description,
            category,
            price: Number(price),
            stock: Number(stock),
            productId: post._id.toString(),
        },
          },
          ],
          });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalPosts = await Post.countDocuments({ stock: { $gte: 1 } });
    
    const posts = await Post.find({ stock: { $gte: 1 } })
      .populate("addedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return res.status(200).json({
      message: "All Posts Fetched Successfully",
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
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
    post.stock = req.body.stock ?? post.stock;

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
        Stock: ${post.stock}
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
      stock: Number(post.stock),
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
    await index.deleteOne({
  id: postId,
});

    
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
     const {category}=req.params;
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;
     const skip = (page - 1) * limit;

     const totalPosts = await Post.countDocuments({category:category, stock: { $gte: 1 }});
     
     const posts = await Post.find({category:category, stock: { $gte: 1 }})
        .populate("addedBy","email fullName")
        .sort({createdAt:-1})
        .skip(skip)
        .limit(limit);

     if(posts.length==0)
     {
      return res.status(400).json({
        message:"No post found for this category"
      })
     }
     return res.status(200).json({
      message:"All post based on Category",
      totalPosts,
      totalPages: Math.ceil(totalPosts / limit),
      currentPage: page,
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
     const categories=await Post.distinct("category", { stock: { $gte: 1 } })
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

export async function searchProduct(req, res) {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    // Try vector search first
    try {
      const vector = await embeddings.embedQuery(query);

      const index = pinecone.index(process.env.PINECONE_INDEX_NAME);

      const response = await index.query({
        vector,
        topK: 10,
        includeMetadata: true,
      });

      if (response.matches && response.matches.length > 0) {
        const productIds = response.matches.map((match) => match.metadata.productId);
        const products = await Post.find({ _id: { $in: productIds }, stock: { $gte: 1 } }).populate("addedBy", "fullName email");
        const orderedProducts = productIds
          .map((id) => products.find((product) => product._id.toString() === id))
          .filter(Boolean);

        if (orderedProducts.length > 0) {
          return res.status(200).json({
            message: "Products Found",
            totalProducts: orderedProducts.length,
            products: orderedProducts,
          });
        }
      }
      // if no matches or no in-stock vector results, fallthrough to text search
      console.debug("searchProduct: no vector matches, falling back to text search", { query });
    } catch (vectorError) {
      console.error("searchProduct: vector search failed, falling back to text search", vectorError.message || vectorError);
    }

    // Fallback: MongoDB regex search on title/description/category (case-insensitive)
    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const fallbackProducts = await Post.find({
      $and: [
        { stock: { $gte: 1 } },
        {
          $or: [
            { title: regex },
            { description: regex },
            { category: regex },
          ],
        },
      ],
    })
      .limit(50)
      .populate("addedBy", "fullName email");

    if (!fallbackProducts || fallbackProducts.length === 0) {
      return res.status(404).json({ message: "No matching products found" });
    }

    return res.status(200).json({
      message: "Products Found (fallback)",
      totalProducts: fallbackProducts.length,
      products: fallbackProducts,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
}