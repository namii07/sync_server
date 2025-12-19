import User from "../models/User.js";
import Post from "../models/Post.js";
import { hashPassword } from "./hashPassword.js";

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log("Database already seeded");
      return;
    }

    // Create sample users
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

    // Create sample posts
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

    console.log("✅ Database seeded successfully!");
    console.log("👥 Test users created:");
    console.log("   Email: alice@example.com | Password: password123");
    console.log("   Email: john@example.com | Password: password123");
    console.log("   Email: sarah@example.com | Password: password123");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};