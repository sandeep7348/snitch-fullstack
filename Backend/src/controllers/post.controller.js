import Post from "../models/post.models.js";
import { ImageKit } from "@imagekit/nodejs";
import dotenv from "dotenv";
dotenv.config();
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import mongoose from "mongoose";
import { 
  MOCK_PRODUCTS, 
  searchMockProducts, 
  getMockCategories, 
  getMockProductById 
} from "../config/mockData.js";

let embeddings = null;
let pinecone = null;
let imagekit = null;

try {
  if (process.env.MISTRAL_API_KEY) {
    embeddings = new MistralAIEmbeddings({
      model: "mistral-embed",
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  if (process.env.PINECONE_API_KEY) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }
  if (process.env.IMAGE_KIT_PUBLIC_KEY) {
    imagekit = new ImageKit({
      publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
      privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
    });
  }
} catch (e) {
  console.warn("External SDK init warning:", e.message);
}

export async function CreatePost(req, res) {
  try {
    const { title, description, category, price, stock, isFeatured } = req.body;
    let imageUrl = "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800";

    if (imagekit && req.file) {
      const uploaded = await imagekit.files.upload({
        file: req.file.buffer.toString("base64"),
        fileName: req.file.originalname,
        folder: "InstaProject",
      });
      imageUrl = uploaded.url;
    }

    const post = await Post.create({
      title,
      description,
      category,
      price,
      stock,
      isFeatured,
      image: imageUrl,
      addedBy: req.user?.id || req.user?._id,
    });

    if (embeddings && pinecone) {
      try {
        const document = `Title: ${title} Category: ${category} Description: ${description} Price: ₹${price}`;
        const [vector] = await embeddings.embedDocuments([document]);
        const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
        await index.upsert([
          {
            id: post._id.toString(),
            values: vector,
            metadata: { title, description, category, price: Number(price), stock: Number(stock), productId: post._id.toString() },
          },
        ]);
      } catch (embErr) {
        console.warn("Embeddings upsert failed:", embErr.message);
      }
    }

    return res.status(201).json({ message: "Post Created Successfully", post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getAllPost(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortParam = req.query.sort || "newest";
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    if (isDbConnected) {
      let sortObj = { createdAt: -1 };
      if (sortParam === "price_asc") sortObj = { price: 1 };
      if (sortParam === "price_desc") sortObj = { price: -1 };
      if (sortParam === "popular") sortObj = { _id: 1 };

      const query = { stock: { $gte: 1 } };
      if (maxPrice) query.price = { $lte: maxPrice };

      const totalPosts = await Post.countDocuments(query);
      const posts = await Post.find(query)
        .populate("addedBy", "fullName email")
        .sort(sortObj)
        .skip(skip)
        .limit(limit);

      if (posts && posts.length > 0) {
        return res.status(200).json({
          message: "All Posts Fetched Successfully",
          totalPosts,
          totalPages: Math.ceil(totalPosts / limit),
          currentPage: page,
          posts,
        });
      }
    }
  } catch (error) {
    console.warn("DB getAllPost error, serving mock catalog fallback:", error.message);
  }

  // Fallback to MOCK_PRODUCTS if DB disconnected or empty
  let mockList = MOCK_PRODUCTS;
  const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice) : null;
  if (maxPrice) mockList = mockList.filter(p => p.price <= maxPrice);

  return res.status(200).json({
    message: "All Posts Fetched (Mock Fallback)",
    totalPosts: mockList.length,
    totalPages: 1,
    currentPage: 1,
    posts: mockList,
  });
}

export async function getPostById(req, res) {
  try {
    const postId = req.params.id;
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const post = await Post.findById(postId).populate("addedBy", "fullName email");
      if (post) {
        return res.status(200).json({ message: "Post Fetched Successfully", post });
      }
    }
  } catch (error) {
    console.warn("DB getPostById error, serving mock product:", error.message);
  }

  const mockProduct = getMockProductById(req.params.id);
  return res.status(200).json({ message: "Post Fetched Successfully (Mock)", post: mockProduct });
}

export async function updatePost(req, res) {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.category = req.body.category || post.category;
    post.price = req.body.price || post.price;
    post.stock = req.body.stock ?? post.stock;
    if (req.body.isFeatured !== undefined) post.isFeatured = req.body.isFeatured;

    await post.save();
    return res.status(200).json({ message: "Post Updated Successfully", post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function deletePost(req, res) {
  try {
    const { postId } = req.params;
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post Deleted Successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function getPostByCategory(req, res) {
  try {
    const { category } = req.params;
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    const isAllOrDiscover = !category || category.toLowerCase() === "discover" || category.toLowerCase() === "all";

    if (isDbConnected) {
      const query = { stock: { $gte: 1 } };
      if (!isAllOrDiscover) {
        query.category = new RegExp(category, "i");
      }

      const posts = await Post.find(query).limit(10);
      if (posts && posts.length > 0) {
        return res.status(200).json({
          message: "All post based on Category",
          totalPosts: posts.length,
          totalPages: 1,
          currentPage: 1,
          posts,
        });
      }
    }
  } catch (error) {
    console.warn("DB getPostByCategory error, using mock catalog:", error.message);
  }

  const isAllOrDiscover = !req.params.category || req.params.category.toLowerCase() === "discover" || req.params.category.toLowerCase() === "all";
  const filteredMock = isAllOrDiscover 
    ? MOCK_PRODUCTS 
    : MOCK_PRODUCTS.filter((p) => p.category.toLowerCase().includes(req.params.category.toLowerCase()));
  const items = filteredMock.length > 0 ? filteredMock : MOCK_PRODUCTS;

  return res.status(200).json({
    message: "All post based on Category (Mock)",
    totalPosts: items.length,
    totalPages: 1,
    currentPage: 1,
    posts: items,
  });
}

export async function getDistinctCategory(req, res) {
  try {
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;
    if (isDbConnected) {
      const categories = await Post.distinct("category", { stock: { $gte: 1 } });
      if (categories.length > 0) {
        return res.status(200).json({
          message: "Distinct Categories",
          totalCategories: categories.length,
          categories,
        });
      }
    }
  } catch (error) {
    console.warn("DB getDistinctCategory error, using mock categories:", error.message);
  }

  const categories = getMockCategories();
  return res.status(200).json({
    message: "Distinct Categories (Mock)",
    totalCategories: categories.length,
    categories,
  });
}

export async function searchProduct(req, res) {
  try {
    const { query } = req.body;
    const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

    if (isDbConnected) {
      const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      const fallbackProducts = await Post.find({
        stock: { $gte: 1 },
        $or: [{ title: regex }, { description: regex }, { category: regex }],
      }).limit(20);

      if (fallbackProducts && fallbackProducts.length > 0) {
        return res.status(200).json({
          message: "Products Found",
          totalProducts: fallbackProducts.length,
          products: fallbackProducts,
        });
      }
    }
  } catch (error) {
    console.warn("DB searchProduct error, using mock catalog search:", error.message);
  }

  const mockResults = searchMockProducts(req.body.query || "");
  return res.status(200).json({
    message: "Products Found (Mock Catalog)",
    totalProducts: mockResults.length,
    products: mockResults,
  });
}