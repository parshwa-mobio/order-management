import mongoose from "mongoose";
import dotenv from "dotenv";
import { logger } from "../utils/logger.js";
import { seedUsers } from "./userSeeder.js";
import { seedProducts } from "./productSeeder.js";
import { seedOrders } from "./orderSeeder.js";
import { seedDistributors } from "./distributorSeeder.js";
import { seedNotifications } from "./notificationSeeder.js";
import { seedDocuments } from "./documentSeeder.js";

dotenv.config();

const clearCollections = async () => {
  const collections = await mongoose.connection.db.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  logger.info("All collections cleared");
};

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info("Connected to MongoDB");

    await clearCollections();

    // Order matters due to relationships
    const users = await seedUsers();
    const distributors = await seedDistributors(users);
    const products = await seedProducts();
    const orders = await seedOrders(users, products, distributors);
    await seedNotifications(users, orders);
    await seedDocuments(orders, users);

    logger.info("Database seeded successfully");
    process.exit(0);
  } catch (error) {
    logger.error("Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
