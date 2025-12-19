import dotenv from "dotenv";
import User from "./models/User.js";
import Post from "./models/Post.js";
import { hashPassword } from "./utils/hashPassword.js";
import connectDB from "./Db/db.js";

dotenv.config();

const forceSeed = async () => {
  try {
    await connectDB();
    console.log("🔄 Force reseeding database...");

    // Clear all data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log("🧹 Cleared existing data");

    // Create users with proper hashing
    const users = await User.create([
      {
        username: "alice",
        email: "alice@example.com",
        password: await hashPassword("password123"),
        bio: "Frontend Developer | React Enthusiast 🚀",
        avatar: "https://i.pinimg.com/736x/b3/35/ec/b335ecd186e7a7e8913c41418ce9c9c0.jpg"
      },
      {
        username: "john",
        email: "john@example.com", 
        password: await hashPassword("password123"),
        bio: "Full Stack Developer | Open Source Contributor",
        avatar: "https://i.pinimg.com/736x/78/49/25/784925b2707ac85810965a0fcb0da88a.jpg"
      },
      {
        username: "sarah",
        email: "sarah@example.com",
        password: await hashPassword("password123"),
        bio: "UI/UX Designer | Creative Thinker ✨",
        avatar: "https://i.pinimg.com/736x/51/da/e4/51dae45486f8cdf2a37067a5439bdc7f.jpg"
      }
    ]);

    console.log("👥 Created users:", users.map(u => u.email));

    // Create posts
    await Post.create([
      {
        content: "Just launched my new React project! 🚀 #ReactJS #WebDev",
        author: users[0]._id,
        likes: [users[1]._id, users[2]._id],
        image: "https://i.pinimg.com/736x/ea/e2/91/eae29154a567b88bb9b830f58a868e75.jpg"
      },
      {
        content: "Beautiful sunset coding session ☀️ #JavaScript #Coding",
        author: users[1]._id,
        likes: [users[0]._id],
        image: "https://i.pinimg.com/736x/78/49/25/784925b2707ac85810965a0fcb0da88a.jpg"
      },
      {
        content: "Working on some amazing UI designs today! What do you think? 🎨",
        author: users[2]._id,
        likes: [users[0]._id, users[1]._id]
      }
    ]);

    console.log("📝 Created sample posts");
    console.log("✅ Force seeding completed!");
    console.log("\n🔑 Login credentials:");
    console.log("   Email: alice@example.com | Password: password123");
    console.log("   Email: john@example.com | Password: password123");
    console.log("   Email: sarah@example.com | Password: password123");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Force seeding failed:", error);
    process.exit(1);
  }
};

forceSeed();