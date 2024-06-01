const fs = require("fs").promises;
const path = require("path");

// Array of directory paths to create
const directories = [
  "config",
  "routes",
  "views",
  "services",
  "controllers",
  "models",
  "middlewares",
  "public/uploads",
];

// Array of filenames to create in the root directory
const rootFiles = ["app.js", "index.js", "server.js"];

// Function to create directories
const createDirectories = async (dirs) => {
  for (const dir of dirs) {
    try {
      // Resolve the directory path to handle absolute paths correctly
      const resolvedDirPath = path.resolve(__dirname, dir);
      console.log(`Creating directory: ${resolvedDirPath}`);

      // Create the directory and any necessary subdirectories
      await fs.mkdir(resolvedDirPath, { recursive: true });
      console.log(`Directory ${resolvedDirPath} created successfully.`);
    } catch (err) {
      console.error(`Error creating directory ${dir}:`, err);
    }
  }
};

// Function to create files in the root directory
const createFilesInRoot = async (files) => {
  try {
    for (const file of files) {
      const filePath = path.resolve(__dirname, file);
      console.log(`Creating file: ${filePath}`);
      await fs.writeFile(filePath, "", "utf8");
      console.log(`File ${filePath} created successfully.`);
    }
  } catch (err) {
    console.error(`Error creating files:`, err);
  }
};

// Create the directories and files in the root directory
const main = async () => {
  await createDirectories(directories);
  await createFilesInRoot(rootFiles);
};

main().catch((err) => {
  console.error("Error in main:", err);
});
