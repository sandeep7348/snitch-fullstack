import { Mistral } from "@mistralai/mistralai";
import mongoose from "mongoose";
import Post from "../models/post.models.js";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";
import { 
  MOCK_PRODUCTS, 
  searchMockProducts, 
  getMockCategories, 
  getMockProductById 
} from "../config/mockData.js";

let client = null;
let embeddings = null;
let pinecone = null;

try {
  if (process.env.MISTRAL_API_KEY) {
    client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });
    embeddings = new MistralAIEmbeddings({
      model: "mistral-embed",
      apiKey: process.env.MISTRAL_API_KEY,
    });
  }
  if (process.env.PINECONE_API_KEY) {
    pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
  }
} catch (err) {
  console.warn("AI initialization warning:", err.message);
}

// ─── Tool definitions for Mistral function calling ────────────────────────────
const tools = [
  {
    type: "function",
    function: {
      name: "search_products",
      description:
        "Search for products by natural language query using AI semantic search. Use this when the user asks about finding, searching, or looking for specific clothing items.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              'Natural language product query, e.g. "black oversized t-shirt" or "casual summer outfit"',
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_product_details",
      description:
        "Get full details of a specific product by its ID. Use when the user asks for more information about a product.",
      parameters: {
        type: "object",
        properties: {
          productId: {
            type: "string",
            description: "The ID of the product",
          },
        },
        required: ["productId"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_products_by_category",
      description:
        "Get all products in a specific clothing category. Use when the user asks about a category like T-Shirts, Hoodies, Jeans, etc.",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: 'Category name, e.g. "Oversized", "Hoodies", "Cargo"',
          },
        },
        required: ["category"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_all_categories",
      description:
        "Get all available product categories. Use when the user asks what types of clothing are available.",
      parameters: { type: "object", properties: {} },
    },
  },
  {
    type: "function",
    function: {
      name: "compare_products",
      description:
        "Compare two products side by side. Use when the user asks to compare two specific products.",
      parameters: {
        type: "object",
        properties: {
          productId1: { type: "string", description: "ID of the first product" },
          productId2: { type: "string", description: "ID of the second product" },
        },
        required: ["productId1", "productId2"],
      },
    },
  },
];

// ─── Tool execution with DB & Mock fallback ─────────────────────────────────────
async function executeTool(name, args) {
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  switch (name) {
    case "search_products": {
      if (isDbConnected && embeddings && pinecone) {
        try {
          const vector = await embeddings.embedQuery(args.query);
          const index = pinecone.index(process.env.PINECONE_INDEX_NAME);
          const response = await index.query({ vector, topK: 5, includeMetadata: true });

          if (response.matches?.length > 0) {
            const ids = response.matches.map((m) => m.metadata.productId);
            const products = await Post.find({ _id: { $in: ids }, stock: { $gte: 1 } });
            const ordered = ids
              .map((id) => products.find((p) => p._id.toString() === id))
              .filter(Boolean);
            if (ordered.length > 0) {
              return { products: ordered.map(formatProduct), source: "vector" };
            }
          }
        } catch (vErr) {
          console.warn("Vector search failed, attempting MongoDB text search...");
        }
      }

      if (isDbConnected) {
        try {
          const regex = new RegExp(args.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
          const fallback = await Post.find({
            stock: { $gte: 1 },
            $or: [{ title: regex }, { description: regex }, { category: regex }],
          }).limit(5);

          if (fallback.length > 0) {
            return { products: fallback.map(formatProduct), source: "database_text" };
          }
        } catch (dbErr) {
          console.warn("MongoDB query failed, using in-memory catalog...");
        }
      }

      // Mock catalog fallback if DB disconnected or no matches
      const mockResults = searchMockProducts(args.query);
      return { products: mockResults.map(formatProduct), source: "mock_catalog" };
    }

    case "get_product_details": {
      if (isDbConnected) {
        try {
          const product = await Post.findById(args.productId);
          if (product) return { product: formatProduct(product) };
        } catch {}
      }
      return { product: formatProduct(getMockProductById(args.productId)) };
    }

    case "get_products_by_category": {
      if (isDbConnected) {
        try {
          const products = await Post.find({
            category: new RegExp(args.category, "i"),
            stock: { $gte: 1 },
          }).limit(6);
          if (products.length > 0) return { products: products.map(formatProduct) };
        } catch {}
      }
      const mockCategoryMatches = MOCK_PRODUCTS.filter(p => p.category.toLowerCase().includes(args.category.toLowerCase()));
      const items = mockCategoryMatches.length > 0 ? mockCategoryMatches : MOCK_PRODUCTS.slice(0, 4);
      return { products: items.map(formatProduct) };
    }

    case "get_all_categories": {
      if (isDbConnected) {
        try {
          const categories = await Post.distinct("category", { stock: { $gte: 1 } });
          if (categories.length > 0) return { categories };
        } catch {}
      }
      return { categories: getMockCategories() };
    }

    case "compare_products": {
      let p1 = null, p2 = null;
      if (isDbConnected) {
        try {
          [p1, p2] = await Promise.all([
            Post.findById(args.productId1),
            Post.findById(args.productId2),
          ]);
        } catch {}
      }
      if (!p1) p1 = getMockProductById(args.productId1);
      if (!p2) p2 = MOCK_PRODUCTS[1];
      return {
        product1: formatProduct(p1),
        product2: formatProduct(p2),
      };
    }

    default:
      return { error: "Unknown tool" };
  }
}

function formatProduct(p) {
  if (!p) return null;
  return {
    id: p._id ? p._id.toString() : p.id,
    title: p.title,
    description: p.description,
    category: p.category,
    price: p.price,
    stock: p.stock ?? 10,
    image: p.image,
    isFeatured: p.isFeatured ?? false,
  };
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Snitch AI — a smart, friendly fashion shopping assistant for the Snitch luxury streetwear clothing brand.

Your personality:
- Enthusiastic about fashion, fit, and streetwear culture
- Helpful, concise, and engaging
- You know the Snitch collection deeply

Your capabilities:
- Search for products using natural language
- Retrieve products by category (Oversized, Cargo, Hoodies, Jackets, Jeans)
- Get detailed product information & prices
- Compare two products side by side
- Suggest casual summer, winter, and streetwear outfits

Guidelines:
- When a user asks about products, ALWAYS use the search or category tools first
- Present product results in a clear, engaging way with bold titles and prices in ₹
- Keep responses concise and formatted nicely with bullet points or line breaks`;

// ─── Main Chat Handler ────────────────────────────────────────────────────────
export async function chat(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    const lastUserMsg = messages.filter((m) => m.role === "user").pop();
    const userQuery = lastUserMsg ? lastUserMsg.content : "";

    // ── Attempt Mistral AI Function Calling Loop if Client is available ──────────
    if (client) {
      try {
        const conversation = [
          { role: "system", content: SYSTEM_PROMPT },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ];

        let rounds = 0;
        const MAX_ROUNDS = 4;

        while (rounds < MAX_ROUNDS) {
          rounds++;

          const response = await client.chat.complete({
            model: "mistral-small-latest",
            messages: conversation,
            tools,
            toolChoice: "auto",
          });

          const choice = response.choices[0];
          conversation.push(choice.message);

          if (!choice.message.toolCalls || choice.message.toolCalls.length === 0) {
            return res.status(200).json({
              message: choice.message.content,
              role: "assistant",
            });
          }

          const toolResults = await Promise.all(
            choice.message.toolCalls.map(async (call) => {
              const args =
                typeof call.function.arguments === "string"
                  ? JSON.parse(call.function.arguments)
                  : call.function.arguments;

              const result = await executeTool(call.function.name, args);

              return {
                toolCallId: call.id,
                toolName: call.function.name,
                result,
              };
            })
          );

          for (const tr of toolResults) {
            conversation.push({
              role: "tool",
              toolCallId: tr.toolCallId,
              name: tr.toolName,
              content: JSON.stringify(tr.result),
            });
          }
        }
      } catch (aiError) {
        console.warn("Mistral AI API call failed or rate-limited:", aiError.message);
      }
    }

    // ── Fallback Handler (If Mistral API rate-limited / failed / offline) ──────────
    return generateFallbackResponse(res, userQuery);

  } catch (error) {
    console.error("General Chat Error:", error);
    return generateFallbackResponse(res, req.body?.messages?.slice(-1)[0]?.content || "");
  }
}

// ─── Smart Fallback Response Generator ────────────────────────────────────────
async function generateFallbackResponse(res, userQuery) {
  let products = [];
  const isDbConnected = mongoose.connection && mongoose.connection.readyState === 1;

  // Step 1: Try DB search if MongoDB is connected
  if (isDbConnected) {
    try {
      const words = userQuery.split(/\s+/).filter((w) => w.length > 2);
      if (words.length > 0) {
        const orConditions = words.flatMap((w) => {
          const r = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
          return [{ title: r }, { description: r }, { category: r }];
        });
        products = await Post.find({ stock: { $gte: 1 }, $or: orConditions }).limit(5);
      }

      if (!products || products.length === 0) {
        products = await Post.find({ stock: { $gte: 1 } }).limit(5);
      }
    } catch (dbErr) {
      console.warn("MongoDB search in fallback failed, falling back to mock catalog:", dbErr.message);
      products = [];
    }
  }

  // Step 2: Fallback to mock dataset if DB disconnected or 0 results
  if (!products || products.length === 0) {
    products = searchMockProducts(userQuery);
  }

  const formattedProds = products.map(formatProduct);

  // Step 3: Format intelligent conversational response
  let replyText = "Hey! 🛍️ Here are some top picks from the **Snitch Collection**:\n\n";

  const lowerQuery = userQuery.toLowerCase();
  if (lowerQuery.includes("black")) {
    replyText = "Here are our trending **Black Streetwear** styles:\n\n";
  } else if (lowerQuery.includes("cargo") || lowerQuery.includes("pant")) {
    replyText = "Check out our premium **Cargo & Utility Pants** collection:\n\n";
  } else if (lowerQuery.includes("hoodie") || lowerQuery.includes("sweatshirt")) {
    replyText = "Here are our cozy **Heavyweight Hoodies & Sweats**:\n\n";
  } else if (lowerQuery.includes("jacket") || lowerQuery.includes("coat")) {
    replyText = "Here are our top rated **Outerwear & Jackets**:\n\n";
  } else if (lowerQuery.includes("outfit") || lowerQuery.includes("suggest") || lowerQuery.includes("casual")) {
    replyText = "Here is a complete **Casual Streetwear Outfit** recommendation:\n\n";
  }

  formattedProds.slice(0, 4).forEach((p) => {
    replyText += `• **${p.title}** — **₹${p.price}**\n  *${p.category}* • ${p.description}\n\n`;
  });

  replyText += "💡 *Tip: Click on Shop All or search for specific sizes and colors in our store!*";

  return res.status(200).json({
    message: replyText,
    role: "assistant",
  });
}
