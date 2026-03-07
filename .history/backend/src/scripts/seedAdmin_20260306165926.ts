import mongoose from "mongoose";
import dotenv from "dotenv";
Node.js v22.18.0

C:\AgroShare\backend>pnpm exec ts-node src/scripts/seedAdmin.ts
Error: Cannot find module 'C:\AgroShare\backend\src\utils\hash' imported from C:\AgroShare\backend\src\scripts\seedAdmin.ts
    at finalizeResolution (node:internal/modules/esm/resolve:274:11)
    at moduleResolve (node:internal/modules/esm/resolve:859:10)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:783:12)
    at ModuleLoader.#cachedDefaultResolve (node:internal/modules/esm/loader:707:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:690:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:307:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:183:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///C:/AgroShare/backend/src/utils/hash'
}

C:\AgroShare\backend>npx ts-node src/scripts/seedAdmin.ts
Error: Cannot find module 'C:\AgroShare\backend\src\utils\hash' imported from C:\AgroShare\backend\src\scripts\seedAdmin.ts
    at finalizeResolution (node:internal/modules/esm/resolve:274:11)
    at moduleResolve (node:internal/modules/esm/resolve:859:10)
    at defaultResolve (node:internal/modules/esm/resolve:983:11)
    at ModuleLoader.defaultResolve (node:internal/modules/esm/loader:783:12)
    at ModuleLoader.#cachedDefaultResolve (node:internal/modules/esm/loader:707:25)
    at ModuleLoader.resolve (node:internal/modules/esm/loader:690:38)
    at ModuleLoader.getModuleJobForImport (node:internal/modules/esm/loader:307:38)
    at ModuleJob._link (node:internal/modules/esm/module_job:183:49) {
  code: 'ERR_MODULE_NOT_FOUND',
  url: 'file:///C:/AgroShare/backend/src/utils/hash'
}

C:\AgroShare\backend>
dotenv.config();

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!);

    const existingAdmin = await User.findOne({
      email: "admin@agroshare.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await hashPassword("Admin@123");

    await User.create({
      name: "Super Admin",
      email: "admin@agroshare.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "admin",
       status: "active",
    });

    console.log("Admin created successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
};

seedAdmin();