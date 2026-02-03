var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/app.ts
import express2 from "express";
import cors from "cors";

// generated/prisma/client.ts
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/client";
var config = {
  "previewFeatures": [],
  "clientVersion": "7.3.0",
  "engineVersion": "9d6ad21cbbceab97458517b147a6a09ff43aa735",
  "activeProvider": "postgresql",
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nenum Role {\n  USER\n  SELLER\n  ADMIN\n}\n\nenum OrderStatus {\n  PENDING\n  PAID\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String?\n  email    String  @unique\n  password String?\n  role     Role    @default(USER)\n\n  // Relations\n  medicines Medicine[] @relation("SellerMedicines")\n  orders    Order[]\n  reviews   Review[]\n\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  emailVerified Boolean   @default(false)\n  image         String?\n  sessions      Session[]\n  accounts      Account[]\n  carts         Cart[]\n\n  @@map("user")\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String     @unique\n  medicines Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Medicine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  price       Float\n  stock       Int\n\n  featured Boolean @default(false)\n\n  // Foreign keys\n  categoryId String\n  sellerId   String\n\n  // Relations\n  category   Category    @relation(fields: [categoryId], references: [id])\n  seller     User        @relation("SellerMedicines", fields: [sellerId], references: [id])\n  reviews    Review[]\n  orderItems OrderItem[]\n\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  cartItems CartItem[]\n\n  @@index([categoryId])\n  @@index([sellerId])\n}\n\nmodel Cart {\n  id     String     @id @default(cuid())\n  user   User       @relation(fields: [userId], references: [id])\n  userId String\n  items  CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CartItem {\n  id        String   @id @default(cuid())\n  cart      Cart     @relation(fields: [cartId], references: [id])\n  cartId    String\n  product   Medicine @relation(fields: [productId], references: [id])\n  productId String\n  quantity  Int      @default(1)\n}\n\nmodel Order {\n  id     String      @id @default(uuid())\n  userId String\n  status OrderStatus @default(PENDING)\n  total  Float\n\n  // Relations\n  user  User        @relation(fields: [userId], references: [id])\n  items OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n}\n\nmodel OrderItem {\n  id         String @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Float\n\n  // Relations\n  order    Order    @relation(fields: [orderId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  @@index([orderId])\n  @@index([medicineId])\n}\n\nmodel Review {\n  id         String  @id @default(uuid())\n  rating     Int // 1\u20135\n  comment    String?\n  userId     String\n  medicineId String\n\n  // Relations\n  user     User     @relation(fields: [userId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@unique([userId, medicineId])\n  @@index([medicineId])\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  }
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"SellerMedicines"},{"name":"orders","kind":"object","type":"Order","relationName":"OrderToUser"},{"name":"reviews","kind":"object","type":"Review","relationName":"ReviewToUser"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"image","kind":"scalar","type":"String"},{"name":"sessions","kind":"object","type":"Session","relationName":"SessionToUser"},{"name":"accounts","kind":"object","type":"Account","relationName":"AccountToUser"},{"name":"carts","kind":"object","type":"Cart","relationName":"CartToUser"}],"dbName":"user"},"Category":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"medicines","kind":"object","type":"Medicine","relationName":"CategoryToMedicine"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Medicine":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"description","kind":"scalar","type":"String"},{"name":"price","kind":"scalar","type":"Float"},{"name":"stock","kind":"scalar","type":"Int"},{"name":"featured","kind":"scalar","type":"Boolean"},{"name":"categoryId","kind":"scalar","type":"String"},{"name":"sellerId","kind":"scalar","type":"String"},{"name":"category","kind":"object","type":"Category","relationName":"CategoryToMedicine"},{"name":"seller","kind":"object","type":"User","relationName":"SellerMedicines"},{"name":"reviews","kind":"object","type":"Review","relationName":"MedicineToReview"},{"name":"orderItems","kind":"object","type":"OrderItem","relationName":"MedicineToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"cartItems","kind":"object","type":"CartItem","relationName":"CartItemToMedicine"}],"dbName":null},"Cart":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"CartToUser"},{"name":"userId","kind":"scalar","type":"String"},{"name":"items","kind":"object","type":"CartItem","relationName":"CartToCartItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"CartItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"cart","kind":"object","type":"Cart","relationName":"CartToCartItem"},{"name":"cartId","kind":"scalar","type":"String"},{"name":"product","kind":"object","type":"Medicine","relationName":"CartItemToMedicine"},{"name":"productId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"}],"dbName":null},"Order":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"OrderStatus"},{"name":"total","kind":"scalar","type":"Float"},{"name":"user","kind":"object","type":"User","relationName":"OrderToUser"},{"name":"items","kind":"object","type":"OrderItem","relationName":"OrderToOrderItem"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":null},"OrderItem":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"orderId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"quantity","kind":"scalar","type":"Int"},{"name":"price","kind":"scalar","type":"Float"},{"name":"order","kind":"object","type":"Order","relationName":"OrderToOrderItem"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToOrderItem"}],"dbName":null},"Review":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"rating","kind":"scalar","type":"Int"},{"name":"comment","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"medicineId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"ReviewToUser"},{"name":"medicine","kind":"object","type":"Medicine","relationName":"MedicineToReview"},{"name":"createdAt","kind":"scalar","type":"DateTime"}],"dbName":null},"Session":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"token","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"SessionToUser"}],"dbName":"session"},"Account":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"accountId","kind":"scalar","type":"String"},{"name":"providerId","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"user","kind":"object","type":"User","relationName":"AccountToUser"},{"name":"accessToken","kind":"scalar","type":"String"},{"name":"refreshToken","kind":"scalar","type":"String"},{"name":"idToken","kind":"scalar","type":"String"},{"name":"accessTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"refreshTokenExpiresAt","kind":"scalar","type":"DateTime"},{"name":"scope","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"account"},"Verification":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"identifier","kind":"scalar","type":"String"},{"name":"value","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"}],"dbName":"verification"}},"enums":{},"types":{}}');
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.mjs"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.mjs");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull2,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull2,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull2,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes2,
  NullsOrder: () => NullsOrder,
  OrderItemScalarFieldEnum: () => OrderItemScalarFieldEnum,
  OrderScalarFieldEnum: () => OrderScalarFieldEnum,
  PrismaClientInitializationError: () => PrismaClientInitializationError2,
  PrismaClientKnownRequestError: () => PrismaClientKnownRequestError2,
  PrismaClientRustPanicError: () => PrismaClientRustPanicError2,
  PrismaClientUnknownRequestError: () => PrismaClientUnknownRequestError2,
  PrismaClientValidationError: () => PrismaClientValidationError2,
  QueryMode: () => QueryMode,
  ReviewScalarFieldEnum: () => ReviewScalarFieldEnum,
  SessionScalarFieldEnum: () => SessionScalarFieldEnum,
  SortOrder: () => SortOrder,
  Sql: () => Sql2,
  TransactionIsolationLevel: () => TransactionIsolationLevel,
  UserScalarFieldEnum: () => UserScalarFieldEnum,
  VerificationScalarFieldEnum: () => VerificationScalarFieldEnum,
  defineExtension: () => defineExtension,
  empty: () => empty2,
  getExtensionContext: () => getExtensionContext,
  join: () => join2,
  prismaVersion: () => prismaVersion,
  raw: () => raw2,
  sql: () => sql
});
import * as runtime2 from "@prisma/client/runtime/client";
var PrismaClientKnownRequestError2 = runtime2.PrismaClientKnownRequestError;
var PrismaClientUnknownRequestError2 = runtime2.PrismaClientUnknownRequestError;
var PrismaClientRustPanicError2 = runtime2.PrismaClientRustPanicError;
var PrismaClientInitializationError2 = runtime2.PrismaClientInitializationError;
var PrismaClientValidationError2 = runtime2.PrismaClientValidationError;
var sql = runtime2.sqltag;
var empty2 = runtime2.empty;
var join2 = runtime2.join;
var raw2 = runtime2.raw;
var Sql2 = runtime2.Sql;
var Decimal2 = runtime2.Decimal;
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var prismaVersion = {
  client: "7.3.0",
  engine: "9d6ad21cbbceab97458517b147a6a09ff43aa735"
};
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var DbNull2 = runtime2.DbNull;
var JsonNull2 = runtime2.JsonNull;
var AnyNull2 = runtime2.AnyNull;
var ModelName = {
  User: "User",
  Category: "Category",
  Medicine: "Medicine",
  Cart: "Cart",
  CartItem: "CartItem",
  Order: "Order",
  OrderItem: "OrderItem",
  Review: "Review",
  Session: "Session",
  Account: "Account",
  Verification: "Verification"
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var UserScalarFieldEnum = {
  id: "id",
  name: "name",
  email: "email",
  password: "password",
  role: "role",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  emailVerified: "emailVerified",
  image: "image"
};
var CategoryScalarFieldEnum = {
  id: "id",
  name: "name",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var MedicineScalarFieldEnum = {
  id: "id",
  name: "name",
  description: "description",
  price: "price",
  stock: "stock",
  featured: "featured",
  categoryId: "categoryId",
  sellerId: "sellerId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartScalarFieldEnum = {
  id: "id",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var CartItemScalarFieldEnum = {
  id: "id",
  cartId: "cartId",
  productId: "productId",
  quantity: "quantity"
};
var OrderScalarFieldEnum = {
  id: "id",
  userId: "userId",
  status: "status",
  total: "total",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var OrderItemScalarFieldEnum = {
  id: "id",
  orderId: "orderId",
  medicineId: "medicineId",
  quantity: "quantity",
  price: "price"
};
var ReviewScalarFieldEnum = {
  id: "id",
  rating: "rating",
  comment: "comment",
  userId: "userId",
  medicineId: "medicineId",
  createdAt: "createdAt"
};
var SessionScalarFieldEnum = {
  id: "id",
  expiresAt: "expiresAt",
  token: "token",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  ipAddress: "ipAddress",
  userAgent: "userAgent",
  userId: "userId"
};
var AccountScalarFieldEnum = {
  id: "id",
  accountId: "accountId",
  providerId: "providerId",
  userId: "userId",
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  idToken: "idToken",
  accessTokenExpiresAt: "accessTokenExpiresAt",
  refreshTokenExpiresAt: "refreshTokenExpiresAt",
  scope: "scope",
  password: "password",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var VerificationScalarFieldEnum = {
  id: "id",
  identifier: "identifier",
  value: "value",
  expiresAt: "expiresAt",
  createdAt: "createdAt",
  updatedAt: "updatedAt"
};
var SortOrder = {
  asc: "asc",
  desc: "desc"
};
var QueryMode = {
  default: "default",
  insensitive: "insensitive"
};
var NullsOrder = {
  first: "first",
  last: "last"
};
var defineExtension = runtime2.Extensions.defineExtension;

// generated/prisma/client.ts
globalThis["__dirname"] = path.dirname(fileURLToPath(import.meta.url));
var PrismaClient = getPrismaClientClass();

// src/middlewares/globalErrorHandler.ts
function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  if (err instanceof prismaNamespace_exports.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "You provide incorrect field type or missing fields";
  } else if (err instanceof prismaNamespace_exports.PrismaClientKnownRequestError) {
    if (err.code === "P2025") {
      statusCode = 400;
      errorMessage = "An operation failed because it depends on one or more records that were required but not found.";
    } else if (err.code === "P2002") {
      statusCode = 400;
      errorMessage = "Unique constraint failed on the {constraint}";
    } else if (err.code === "P2003") {
      statusCode = 400;
      errorMessage = "Foreign key constraint failed on the field: {field_name}";
    }
  } else if (err instanceof prismaNamespace_exports.PrismaClientUnknownRequestError) {
    statusCode = 500;
    errorMessage = "Error occured during query excution";
  } else if (err instanceof prismaNamespace_exports.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.";
  } else if (err instanceof prismaNamespace_exports.PrismaClientInitializationError) {
    if (err.errorCode === "P1000") {
      statusCode = 401;
      errorMessage = "Authentication failed against database server";
    }
  }
  res.status(statusCode);
  res.json({
    message: errorMessage,
    error: errorDetails
  });
}
var globalErrorHandler_default = errorHandler;

// src/modules/getProfile/getProfile.routes.ts
import { Router } from "express";

// src/lib/prisma.ts
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/modules/getProfile/getProfile.service.ts
var getProfileService = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true
    }
  });
};
var updateUserProfile = async (id, data) => {
  return prisma.user.update({
    where: { id },
    data
  });
};

// src/modules/getProfile/getProfile.controller.ts
var getProfileController = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  const result = await getProfileService(user.id);
  res.json(result);
};
var updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }
  try {
    const updatedUser = await updateUserProfile(id, { name, email });
    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import nodemailer from "nodemailer";
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASS
  }
});
var auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql"
    // or "mysql", "postgresql", ...etc
  }),
  trustedOrigins: [process.env.APP_URL],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      try {
        const info = await transporter.sendMail({
          from: `"Medicine Store" <${process.env.APP_USER}>`,
          to: user.email,
          subject: "Please verify your email",
          html: `
        <h2>Verify your email</h2>
        <p>Click the button below to verify your email address.</p>

        <a href="${url}"
           style="background:#2563eb;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;">
          Verify Email
        </a>

        <p>If the button does not work, copy this link:</p>
        <p>${url}</p>
      `
        });
        console.log("Verification email sent:", info.messageId);
      } catch (error) {
        console.error("Email send failed:", error);
      }
    }
  },
  socialProviders: {
    google: {
      prompt: "select_account consent",
      accessType: "offline",
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }
  }
});

// src/middlewares/route-auth.ts
var UserRole = /* @__PURE__ */ ((UserRole2) => {
  UserRole2["USER"] = "USER";
  UserRole2["SELLER"] = "SELLER";
  UserRole2["ADMIN"] = "ADMIN";
  return UserRole2;
})(UserRole || {});
var routeAuth = (...role) => {
  return async (req, res, next) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers
      });
      if (!session) {
        return res.status(401).json({
          srccess: false,
          message: "you are not authorized"
        });
      }
      if (!session.user.emailVerified) {
        return res.status(401).json({
          success: false,
          message: "Email varification required. Please varify your email"
        });
      }
      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name ?? "",
        role: session.user.role,
        emailVerified: session.user.emailVerified
      };
      if (role.length && !role.includes(req.user.role)) {
        return res.status(401).json({
          success: false,
          message: "You don't have permission to access this resources"
        });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};
var route_auth_default = routeAuth;

// src/modules/getProfile/getProfile.routes.ts
var router = Router();
router.get("/", route_auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "USER" /* USER */), getProfileController);
router.patch("/:id", updateUser);
var getProfileRouter = router;

// src/modules/category/category.route.ts
import { Router as Router2 } from "express";

// src/modules/category/category.service.ts
var createCategory = async (name) => {
  const category = await prisma.category.create({
    data: {
      name
    },
    include: {
      medicines: true
    }
  });
  return category;
};
var getAllCategory = async () => {
  const categories = await prisma.category.findMany(
    {
      orderBy: {
        createdAt: "desc"
      }
    }
  );
  return categories;
};
var categoryService = {
  createCategory,
  getAllCategory
};

// src/modules/category/category.controller.ts
var createCategory2 = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required"
      });
    }
    const category = await categoryService.createCategory(name);
    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to create category"
    });
  }
};
var getAllCategory2 = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategory();
    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find all category"
    });
  }
};
var categoryController = {
  createCategory: createCategory2,
  getAllCategory: getAllCategory2
};

// src/modules/category/category.route.ts
var router2 = Router2();
router2.post("/create", route_auth_default("ADMIN" /* ADMIN */), categoryController.createCategory);
router2.get("/all", route_auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "USER" /* USER */), categoryController.getAllCategory);
var categoryRouter = router2;

// src/modules/medicine/medicine.route.ts
import { Router as Router3 } from "express";

// src/modules/medicine/medicine.service.ts
var addMedicine = async (data) => {
  const category = await prisma.category.findUnique({
    where: { name: data.categoryName }
  });
  if (!category) {
    throw new Error("Category not found");
  }
  const medicine = await prisma.medicine.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId: category.id,
      sellerId: data.sellerId
    }
  });
  return medicine;
};
var updateMedicine = async (idParam, data) => {
  let categoryId;
  if (data.categoryName) {
    const category = await prisma.category.findFirst({
      where: {
        name: {
          equals: data.categoryName,
          mode: "insensitive"
        }
      }
    });
    if (!category) {
      throw new Error("Category not found");
    }
    categoryId = category.id;
  }
  const medicine = await prisma.medicine.update({
    where: { id: idParam },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      categoryId
    }
  });
  return medicine;
};
var deleteMedicine = async (id) => {
  const medicine = await prisma.medicine.delete({
    where: {
      id
    }
  });
  return medicine;
};
var getAllMedicine = async (featured) => {
  return prisma.medicine.findMany({
    where: featured === void 0 ? {} : { featured }
  });
};
var getMedicineById = async (id) => {
  const medicine = await prisma.medicine.findUnique(
    {
      where: {
        id
      }
    }
  );
  return medicine;
};
var medicineService = {
  addMedicine,
  updateMedicine,
  deleteMedicine,
  getAllMedicine,
  getMedicineById
};

// src/modules/medicine/medicine.controller.ts
var addMedicine2 = async (req, res) => {
  try {
    const { name, description, price, stock, categoryName } = req.body;
    const sellerId = req.user?.id;
    if (!name || !price || !stock || !categoryName || !sellerId) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }
    const result = await medicineService.addMedicine({ name, description, price, stock, sellerId, categoryName });
    res.status(201).json({
      success: true,
      message: "Medicine created successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add medicine"
    });
  }
};
var updateMedicine2 = async (req, res) => {
  try {
    const { idParam } = req.params;
    const { name, description, price, stock, categoryName } = req.body;
    if (!idParam) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required"
      });
    }
    const result = await medicineService.updateMedicine(idParam, { name, description, price, stock, categoryName });
    res.status(200).json({
      success: true,
      message: "Medicine updated successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to modify medicine"
    });
  }
};
var deleteMedicine2 = async (req, res) => {
  try {
    const { idParam } = req.params;
    if (!idParam) {
      return res.status(400).json({
        success: false,
        message: "Medicine id is required"
      });
    }
    const result = await medicineService.deleteMedicine(idParam);
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete medicine"
    });
  }
};
var getAllMedicine2 = async (req, res) => {
  try {
    const { featured } = req.query;
    const result = await medicineService.getAllMedicine(
      featured !== void 0 ? featured === "true" : void 0
    );
    res.status(200).json({
      success: true,
      message: "Medicine fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find all medicine"
    });
  }
};
var getMedicineById2 = async (req, res) => {
  try {
    const { idParam } = req.params;
    const result = await medicineService.getMedicineById(idParam);
    res.status(200).json({
      success: true,
      message: "Medicine fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find medicine"
    });
  }
};
var medicineController = {
  addMedicine: addMedicine2,
  updateMedicine: updateMedicine2,
  deleteMedicine: deleteMedicine2,
  getAllMedicine: getAllMedicine2,
  getMedicineById: getMedicineById2
};

// src/modules/medicine/medicine.route.ts
var router3 = Router3();
router3.post("/seller/add", route_auth_default("SELLER" /* SELLER */), medicineController.addMedicine);
router3.put("/seller/:idParam", route_auth_default("SELLER" /* SELLER */), medicineController.updateMedicine);
router3.delete("/seller/:idParam", route_auth_default("SELLER" /* SELLER */), medicineController.deleteMedicine);
router3.get("/", medicineController.getAllMedicine);
router3.get("/:idParam", medicineController.getMedicineById);
var medicineRouter = router3;

// src/modules/user/user.route.ts
import { Router as Router4 } from "express";

// src/modules/user/user.service.ts
var getAllUser = async () => {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc"
    }
  });
  return users;
};
var updateUserStatus = async (userId, data) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      role: data.role,
      emailVerified: data.emailVerified
    }
  });
  return user;
};
var userService = {
  getAllUser,
  updateUserStatus
};

// src/modules/user/user.controller.ts
var getAllUser2 = async (req, res) => {
  try {
    const result = await userService.getAllUser();
    res.status(200).json({
      success: true,
      message: "All User Fetched Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find all user"
    });
  }
};
var updateUserStatus2 = async (req, res) => {
  try {
    if (req.user?.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access reject. Admin only."
      });
    }
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is not given"
      });
    }
    const { role, emailVerified } = req.body;
    if (role && !Object.values(UserRole).includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value"
      });
    }
    const user = await userService.updateUserStatus(userId, {
      role,
      emailVerified
    });
    res.status(200).json({
      success: true,
      message: "User status updated successfully",
      data: user
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || "Failed to update user status"
    });
  }
};
var userController = {
  getAllUser: getAllUser2,
  updateUserStatus: updateUserStatus2
};

// src/modules/user/user.route.ts
var router4 = Router4();
router4.get("/users", route_auth_default("ADMIN" /* ADMIN */), userController.getAllUser);
router4.patch("/users/:userId", route_auth_default("ADMIN" /* ADMIN */), userController.updateUserStatus);
var userRouter = router4;

// src/modules/order/order.route.ts
import { Router as Router5 } from "express";

// src/modules/order/order.service.ts
var createOrder = async (userId, total) => {
  const order = await prisma.order.create({
    data: {
      userId,
      total
    }
  });
  return order;
};
var getAllUserOrder = async () => {
  const orders = await prisma.order.findMany({
    where: {
      user: {
        role: "USER"
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: true
      // optional
    }
  });
  return orders;
};
var getAllSellerOrder = async () => {
  const orders = await prisma.order.findMany({
    where: {
      user: {
        role: "SELLER"
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: true
      // optional
    }
  });
  return orders;
};
var getOrderById = async (id) => {
  const order = await prisma.order.findUnique(
    {
      where: {
        id
      }
    }
  );
  return order;
};
var orderService = {
  createOrder,
  getAllUserOrder,
  getOrderById,
  getAllSellerOrder
};

// src/modules/order/order.controller.ts
var createOrder2 = async (req, res) => {
  try {
    const { total } = req.body;
    const userId = req.user?.id;
    if (!total) {
      return res.status(400).json({
        success: false,
        message: "total must be provided"
      });
    }
    const result = await orderService.createOrder(userId, total);
    res.status(201).json({
      success: true,
      message: "Order made successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to add order"
    });
  }
};
var getAllUserOrder2 = async (req, res) => {
  try {
    const result = await orderService.getAllUserOrder();
    res.status(200).json({
      success: true,
      message: "All order delevery Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find all order"
    });
  }
};
var getAllSellerOrder2 = async (req, res) => {
  try {
    const result = await orderService.getAllSellerOrder();
    res.status(200).json({
      success: true,
      message: "All order delevery Successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find all order"
    });
  }
};
var getOrderById2 = async (req, res) => {
  try {
    const { orderId } = req.params;
    const result = await orderService.getOrderById(orderId);
    res.status(200).json({
      success: true,
      message: "Order found successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to find order"
    });
  }
};
var orderController = {
  createOrder: createOrder2,
  getAllUserOrder: getAllUserOrder2,
  getOrderById: getOrderById2,
  getAllSellerOrder: getAllSellerOrder2
};

// src/modules/order/order.route.ts
var router5 = Router5();
router5.post("/", route_auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "USER" /* USER */), orderController.createOrder);
router5.get("/", route_auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */), orderController.getAllUserOrder);
router5.get("/seller", route_auth_default("SELLER" /* SELLER */), orderController.getAllSellerOrder);
router5.get("/:orderId", route_auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "USER" /* USER */), orderController.getOrderById);
var orderRouter = router5;

// src/modules/cart/cart.route.ts
import express from "express";

// src/modules/cart/cart.service.ts
var getUserCart = async (userId) => {
  return prisma.cart.findFirst({
    where: { userId },
    include: { items: { include: { product: true } } }
  });
};
var addToCart = async (userId, productId, quantity) => {
  let cart = await prisma.cart.findFirst({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId }
    });
  }
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId }
  });
  if (existingItem) {
    return prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity }
    });
  }
  return prisma.cartItem.create({
    data: { cartId: cart.id, productId, quantity }
  });
};
var deleteCartservice = async (cartId) => {
  return prisma.cart.delete({
    where: {
      id: cartId
    }
  });
};

// src/modules/cart/cart.controller.ts
var getCart = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await getUserCart(userId);
    res.json({ success: true, cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};
var addProductToCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;
  if (!productId || !quantity) {
    return res.status(400).json({ error: "productId and quantity required" });
  }
  try {
    const item = await addToCart(userId, productId, quantity);
    res.json({ success: true, item });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add product to cart" });
  }
};
var deleteCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    if (!cartId) {
      return res.status(400).json({
        success: false,
        message: "cart id is required"
      });
    }
    const result = await deleteCartservice(cartId);
    res.status(200).json({
      success: true,
      message: "Medicine deleted successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to delete cart"
    });
  }
};

// src/modules/cart/cart.route.ts
var router6 = express.Router();
router6.get("/:userId", getCart);
router6.post("/:userId/add", addProductToCart);
router6.delete("/:cartId", deleteCart);
var cartRoutes = router6;

// src/app.ts
var app = express2();
app.use(cors({
  origin: process.env.APP_URL || "http://localhost:3000",
  credentials: true
}));
app.use(express2.json());
app.use("/api/auth/profile", getProfileRouter);
app.use("/api/category", categoryRouter);
app.use("/api/medicine", medicineRouter);
app.use("/api/admin", userRouter);
app.use("/api/order", orderRouter);
app.use("/api/cart", cartRoutes);
app.get("/", (req, res) => {
  res.send("hellow world 123");
});
app.use(globalErrorHandler_default);
var app_default = app;

// src/server.ts
import { toNodeHandler } from "better-auth/node";
var PORT = process.env.PORT || 5e3;
app_default.all("/api/auth/*splat", toNodeHandler(auth));
app_default.get("api/auth/profile", route_auth_default("ADMIN" /* ADMIN */, "SELLER" /* SELLER */, "USER" /* USER */), (req, res) => {
  res.json(req.user);
});
async function main() {
  try {
    await prisma.$connect();
    console.log("Connected to database successfully");
    app_default.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("An error occured", error), await prisma.$disconnect();
    process.exit(1);
  }
}
main();
