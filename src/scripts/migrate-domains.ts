import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is required");
  process.exit(1);
}

// Temporary schema to bypass strict domain validation during migration
const TaskSchema = new mongoose.Schema({
  title: String,
  domains: [String],
});
const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);

async function migrateDomains() {
  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("✅ Connected to MongoDB for migration");

    // Fetch all tasks
    const tasks = await Task.find({});
    let updatedCount = 0;

    for (const task of tasks) {
      let modified = false;
      const oldDomains = [...task.domains];
      
      // Migrate "Android" to "App Development"
      if (task.domains.includes("Android")) {
        task.domains = task.domains.map((d: string) => (d === "Android" ? "App Development" : d));
        modified = true;
      }
      
      // Remove "Open Source", and if empty, add "Other"
      if (task.domains.includes("Open Source")) {
        task.domains = task.domains.filter((d: string) => d !== "Open Source");
        if (task.domains.length === 0) {
          task.domains.push("Other");
        }
        modified = true;
      }

      // Deduplicate domains just in case
      task.domains = Array.from(new Set(task.domains));

      if (modified) {
        await task.save({ validateBeforeSave: false });
        console.log(`Updated task ${task._id}: [${oldDomains.join(", ")}] -> [${task.domains.join(", ")}]`);
        updatedCount++;
      }
    }

    console.log(`\nMigration complete. Updated ${updatedCount} tasks.`);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
    process.exit(0);
  }
}

migrateDomains();
