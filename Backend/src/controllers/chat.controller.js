import { Mistral } from "@mistralai/mistralai";
import Post from "../models/post.models.js";
import { MistralAIEmbeddings } from "@langchain/mistralai";
import { Pinecone } from "@pinecone-database/pinecone";

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY });

const embeddings = new MistralAIEmbeddings({
  model: "mistral-embed",
  apiKey: process.env.MISTRAL_API_KEY,
});

const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });

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
            description: "The MongoDB ObjectId of the product",
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
            description: 'Category name, e.g. "T-SHIRTS", "HOODIES", "JEANS"',
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

// ─── Tool execution ───────────────────────────────────────────────────────────
async function executeTool(name, args) {
  switch (name) {
    case "search_products": {
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
          return { products: ordered.map(formatProduct), source: "vector" };
        }

        // Fallback: text search
        const regex = new RegExp(args.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        const fallback = await Post.find({
          stock: { $gte: 1 },
          $or: [{ title: regex }, { description: regex }, { category: regex }],
        }).limit(5);
        return { products: fallback.map(formatProduct), source: "text" };
      } catch {
        return { products: [], error: "Search failed" };
      }
    }

    case "get_product_details": {
      const product = await Post.findById(args.productId);
      if (!product) return { error: "Product not found" };
      return { product: formatProduct(product) };
    }

    case "get_products_by_category": {
      const products = await Post.find({
        category: new RegExp(args.category, "i"),
        stock: { $gte: 1 },
      }).limit(6);
      return { products: products.map(formatProduct) };
    }

    case "get_all_categories": {
      const categories = await Post.distinct("category", { stock: { $gte: 1 } });
      return { categories };
    }

    case "compare_products": {
      const [p1, p2] = await Promise.all([
        Post.findById(args.productId1),
        Post.findById(args.productId2),
      ]);
      return {
        product1: p1 ? formatProduct(p1) : null,
        product2: p2 ? formatProduct(p2) : null,
      };
    }

    default:
      return { error: "Unknown tool" };
  }
}

function formatProduct(p) {
  return {
    id: p._id.toString(),
    title: p.title,
    description: p.description,
    category: p.category,
    price: p.price,
    stock: p.stock,
    image: p.image,
    isFeatured: p.isFeatured,
  };
}

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Snitch AI — a smart, friendly fashion shopping assistant for the Snitch clothing brand.

Your personality:
- Enthusiastic about fashion and style
- Helpful, concise, and friendly
- You know the Snitch catalog deeply

Your capabilities:
- Search for products using natural language (you have access to AI semantic search)
- Retrieve products by category
- Get detailed product information
- Compare two products side by side
- Suggest outfits and style combinations
- Answer questions about pricing, stock, and product details

Guidelines:
- When a user asks about products, ALWAYS use the search or category tools first
- Present product results in a clear, engaging way
- For outfit suggestions, search for complementary items
- Keep responses concise unless asked for details
- If no products match, suggest similar alternatives
- Always mention price and availability when discussing products
- Use rupee symbol ₹ for prices

You represent the Snitch brand — a premium streetwear clothing brand.`;

// ─── Main chat handler ────────────────────────────────────────────────────────
export async function chat(req, res) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    // Build conversation with system prompt
    const conversation = [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // Agentic loop — allow up to 5 tool call rounds
    let rounds = 0;
    const MAX_ROUNDS = 5;

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

      // No tool calls — final text response
      if (!choice.message.toolCalls || choice.message.toolCalls.length === 0) {
        return res.status(200).json({
          message: choice.message.content,
          role: "assistant",
        });
      }

      // Execute all tool calls
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

      // Add tool results to conversation
      for (const tr of toolResults) {
        conversation.push({
          role: "tool",
          toolCallId: tr.toolCallId,
          name: tr.toolName,
          content: JSON.stringify(tr.result),
        });
      }
    }

    return res.status(200).json({
      message: "I'm having trouble processing your request. Please try again.",
      role: "assistant",
    });
  } catch (error) {
    console.error("Chat error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
