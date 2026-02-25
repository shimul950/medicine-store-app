var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __commonJS = (cb, mod) => function __require2() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// node_modules/dotenv/package.json
var require_package = __commonJS({
  "node_modules/dotenv/package.json"(exports, module) {
    module.exports = {
      name: "dotenv",
      version: "17.3.1",
      description: "Loads environment variables from .env file",
      main: "lib/main.js",
      types: "lib/main.d.ts",
      exports: {
        ".": {
          types: "./lib/main.d.ts",
          require: "./lib/main.js",
          default: "./lib/main.js"
        },
        "./config": "./config.js",
        "./config.js": "./config.js",
        "./lib/env-options": "./lib/env-options.js",
        "./lib/env-options.js": "./lib/env-options.js",
        "./lib/cli-options": "./lib/cli-options.js",
        "./lib/cli-options.js": "./lib/cli-options.js",
        "./package.json": "./package.json"
      },
      scripts: {
        "dts-check": "tsc --project tests/types/tsconfig.json",
        lint: "standard",
        pretest: "npm run lint && npm run dts-check",
        test: "tap run tests/**/*.js --allow-empty-coverage --disable-coverage --timeout=60000",
        "test:coverage": "tap run tests/**/*.js --show-full-coverage --timeout=60000 --coverage-report=text --coverage-report=lcov",
        prerelease: "npm test",
        release: "standard-version"
      },
      repository: {
        type: "git",
        url: "git://github.com/motdotla/dotenv.git"
      },
      homepage: "https://github.com/motdotla/dotenv#readme",
      funding: "https://dotenvx.com",
      keywords: [
        "dotenv",
        "env",
        ".env",
        "environment",
        "variables",
        "config",
        "settings"
      ],
      readmeFilename: "README.md",
      license: "BSD-2-Clause",
      devDependencies: {
        "@types/node": "^18.11.3",
        decache: "^4.6.2",
        sinon: "^14.0.1",
        standard: "^17.0.0",
        "standard-version": "^9.5.0",
        tap: "^19.2.0",
        typescript: "^4.8.4"
      },
      engines: {
        node: ">=12"
      },
      browser: {
        fs: false
      }
    };
  }
});

// node_modules/dotenv/lib/main.js
var require_main = __commonJS({
  "node_modules/dotenv/lib/main.js"(exports, module) {
    "use strict";
    var fs = __require("fs");
    var path2 = __require("path");
    var os = __require("os");
    var crypto = __require("crypto");
    var packageJson = require_package();
    var version = packageJson.version;
    var TIPS = [
      "\u{1F510} encrypt with Dotenvx: https://dotenvx.com",
      "\u{1F510} prevent committing .env to code: https://dotenvx.com/precommit",
      "\u{1F510} prevent building .env in docker: https://dotenvx.com/prebuild",
      "\u{1F916} agentic secret storage: https://dotenvx.com/as2",
      "\u26A1\uFE0F secrets for agents: https://dotenvx.com/as2",
      "\u{1F6E1}\uFE0F auth for agents: https://vestauth.com",
      "\u{1F6E0}\uFE0F  run anywhere with `dotenvx run -- yourcommand`",
      "\u2699\uFE0F  specify custom .env file path with { path: '/custom/path/.env' }",
      "\u2699\uFE0F  enable debug logging with { debug: true }",
      "\u2699\uFE0F  override existing env vars with { override: true }",
      "\u2699\uFE0F  suppress all logs with { quiet: true }",
      "\u2699\uFE0F  write to custom object with { processEnv: myObject }",
      "\u2699\uFE0F  load multiple .env files with { path: ['.env.local', '.env'] }"
    ];
    function _getRandomTip() {
      return TIPS[Math.floor(Math.random() * TIPS.length)];
    }
    function parseBoolean(value) {
      if (typeof value === "string") {
        return !["false", "0", "no", "off", ""].includes(value.toLowerCase());
      }
      return Boolean(value);
    }
    function supportsAnsi() {
      return process.stdout.isTTY;
    }
    function dim(text) {
      return supportsAnsi() ? `\x1B[2m${text}\x1B[0m` : text;
    }
    var LINE = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function parse(src) {
      const obj = {};
      let lines = src.toString();
      lines = lines.replace(/\r\n?/mg, "\n");
      let match;
      while ((match = LINE.exec(lines)) != null) {
        const key = match[1];
        let value = match[2] || "";
        value = value.trim();
        const maybeQuote = value[0];
        value = value.replace(/^(['"`])([\s\S]*)\1$/mg, "$2");
        if (maybeQuote === '"') {
          value = value.replace(/\\n/g, "\n");
          value = value.replace(/\\r/g, "\r");
        }
        obj[key] = value;
      }
      return obj;
    }
    function _parseVault(options) {
      options = options || {};
      const vaultPath = _vaultPath(options);
      options.path = vaultPath;
      const result = DotenvModule.configDotenv(options);
      if (!result.parsed) {
        const err = new Error(`MISSING_DATA: Cannot parse ${vaultPath} for an unknown reason`);
        err.code = "MISSING_DATA";
        throw err;
      }
      const keys = _dotenvKey(options).split(",");
      const length = keys.length;
      let decrypted;
      for (let i = 0; i < length; i++) {
        try {
          const key = keys[i].trim();
          const attrs = _instructions(result, key);
          decrypted = DotenvModule.decrypt(attrs.ciphertext, attrs.key);
          break;
        } catch (error) {
          if (i + 1 >= length) {
            throw error;
          }
        }
      }
      return DotenvModule.parse(decrypted);
    }
    function _warn(message) {
      console.error(`[dotenv@${version}][WARN] ${message}`);
    }
    function _debug(message) {
      console.log(`[dotenv@${version}][DEBUG] ${message}`);
    }
    function _log(message) {
      console.log(`[dotenv@${version}] ${message}`);
    }
    function _dotenvKey(options) {
      if (options && options.DOTENV_KEY && options.DOTENV_KEY.length > 0) {
        return options.DOTENV_KEY;
      }
      if (process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0) {
        return process.env.DOTENV_KEY;
      }
      return "";
    }
    function _instructions(result, dotenvKey) {
      let uri;
      try {
        uri = new URL(dotenvKey);
      } catch (error) {
        if (error.code === "ERR_INVALID_URL") {
          const err = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        }
        throw error;
      }
      const key = uri.password;
      if (!key) {
        const err = new Error("INVALID_DOTENV_KEY: Missing key part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environment = uri.searchParams.get("environment");
      if (!environment) {
        const err = new Error("INVALID_DOTENV_KEY: Missing environment part");
        err.code = "INVALID_DOTENV_KEY";
        throw err;
      }
      const environmentKey = `DOTENV_VAULT_${environment.toUpperCase()}`;
      const ciphertext = result.parsed[environmentKey];
      if (!ciphertext) {
        const err = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${environmentKey} in your .env.vault file.`);
        err.code = "NOT_FOUND_DOTENV_ENVIRONMENT";
        throw err;
      }
      return { ciphertext, key };
    }
    function _vaultPath(options) {
      let possibleVaultPath = null;
      if (options && options.path && options.path.length > 0) {
        if (Array.isArray(options.path)) {
          for (const filepath of options.path) {
            if (fs.existsSync(filepath)) {
              possibleVaultPath = filepath.endsWith(".vault") ? filepath : `${filepath}.vault`;
            }
          }
        } else {
          possibleVaultPath = options.path.endsWith(".vault") ? options.path : `${options.path}.vault`;
        }
      } else {
        possibleVaultPath = path2.resolve(process.cwd(), ".env.vault");
      }
      if (fs.existsSync(possibleVaultPath)) {
        return possibleVaultPath;
      }
      return null;
    }
    function _resolveHome(envPath) {
      return envPath[0] === "~" ? path2.join(os.homedir(), envPath.slice(1)) : envPath;
    }
    function _configVault(options) {
      const debug = parseBoolean(process.env.DOTENV_CONFIG_DEBUG || options && options.debug);
      const quiet = parseBoolean(process.env.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (debug || !quiet) {
        _log("Loading env from encrypted .env.vault");
      }
      const parsed = DotenvModule._parseVault(options);
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      DotenvModule.populate(processEnv, parsed, options);
      return { parsed };
    }
    function configDotenv(options) {
      const dotenvPath = path2.resolve(process.cwd(), ".env");
      let encoding = "utf8";
      let processEnv = process.env;
      if (options && options.processEnv != null) {
        processEnv = options.processEnv;
      }
      let debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || options && options.debug);
      let quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || options && options.quiet);
      if (options && options.encoding) {
        encoding = options.encoding;
      } else {
        if (debug) {
          _debug("No encoding is specified. UTF-8 is used by default");
        }
      }
      let optionPaths = [dotenvPath];
      if (options && options.path) {
        if (!Array.isArray(options.path)) {
          optionPaths = [_resolveHome(options.path)];
        } else {
          optionPaths = [];
          for (const filepath of options.path) {
            optionPaths.push(_resolveHome(filepath));
          }
        }
      }
      let lastError;
      const parsedAll = {};
      for (const path3 of optionPaths) {
        try {
          const parsed = DotenvModule.parse(fs.readFileSync(path3, { encoding }));
          DotenvModule.populate(parsedAll, parsed, options);
        } catch (e) {
          if (debug) {
            _debug(`Failed to load ${path3} ${e.message}`);
          }
          lastError = e;
        }
      }
      const populated = DotenvModule.populate(processEnv, parsedAll, options);
      debug = parseBoolean(processEnv.DOTENV_CONFIG_DEBUG || debug);
      quiet = parseBoolean(processEnv.DOTENV_CONFIG_QUIET || quiet);
      if (debug || !quiet) {
        const keysCount = Object.keys(populated).length;
        const shortPaths = [];
        for (const filePath of optionPaths) {
          try {
            const relative = path2.relative(process.cwd(), filePath);
            shortPaths.push(relative);
          } catch (e) {
            if (debug) {
              _debug(`Failed to load ${filePath} ${e.message}`);
            }
            lastError = e;
          }
        }
        _log(`injecting env (${keysCount}) from ${shortPaths.join(",")} ${dim(`-- tip: ${_getRandomTip()}`)}`);
      }
      if (lastError) {
        return { parsed: parsedAll, error: lastError };
      } else {
        return { parsed: parsedAll };
      }
    }
    function config2(options) {
      if (_dotenvKey(options).length === 0) {
        return DotenvModule.configDotenv(options);
      }
      const vaultPath = _vaultPath(options);
      if (!vaultPath) {
        _warn(`You set DOTENV_KEY but you are missing a .env.vault file at ${vaultPath}. Did you forget to build it?`);
        return DotenvModule.configDotenv(options);
      }
      return DotenvModule._configVault(options);
    }
    function decrypt(encrypted, keyStr) {
      const key = Buffer.from(keyStr.slice(-64), "hex");
      let ciphertext = Buffer.from(encrypted, "base64");
      const nonce = ciphertext.subarray(0, 12);
      const authTag = ciphertext.subarray(-16);
      ciphertext = ciphertext.subarray(12, -16);
      try {
        const aesgcm = crypto.createDecipheriv("aes-256-gcm", key, nonce);
        aesgcm.setAuthTag(authTag);
        return `${aesgcm.update(ciphertext)}${aesgcm.final()}`;
      } catch (error) {
        const isRange = error instanceof RangeError;
        const invalidKeyLength = error.message === "Invalid key length";
        const decryptionFailed = error.message === "Unsupported state or unable to authenticate data";
        if (isRange || invalidKeyLength) {
          const err = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          err.code = "INVALID_DOTENV_KEY";
          throw err;
        } else if (decryptionFailed) {
          const err = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          err.code = "DECRYPTION_FAILED";
          throw err;
        } else {
          throw error;
        }
      }
    }
    function populate(processEnv, parsed, options = {}) {
      const debug = Boolean(options && options.debug);
      const override = Boolean(options && options.override);
      const populated = {};
      if (typeof parsed !== "object") {
        const err = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        err.code = "OBJECT_REQUIRED";
        throw err;
      }
      for (const key of Object.keys(parsed)) {
        if (Object.prototype.hasOwnProperty.call(processEnv, key)) {
          if (override === true) {
            processEnv[key] = parsed[key];
            populated[key] = parsed[key];
          }
          if (debug) {
            if (override === true) {
              _debug(`"${key}" is already defined and WAS overwritten`);
            } else {
              _debug(`"${key}" is already defined and was NOT overwritten`);
            }
          }
        } else {
          processEnv[key] = parsed[key];
          populated[key] = parsed[key];
        }
      }
      return populated;
    }
    var DotenvModule = {
      configDotenv,
      _configVault,
      _parseVault,
      config: config2,
      decrypt,
      parse,
      populate
    };
    module.exports.configDotenv = DotenvModule.configDotenv;
    module.exports._configVault = DotenvModule._configVault;
    module.exports._parseVault = DotenvModule._parseVault;
    module.exports.config = DotenvModule.config;
    module.exports.decrypt = DotenvModule.decrypt;
    module.exports.parse = DotenvModule.parse;
    module.exports.populate = DotenvModule.populate;
    module.exports = DotenvModule;
  }
});

// node_modules/dotenv/lib/env-options.js
var require_env_options = __commonJS({
  "node_modules/dotenv/lib/env-options.js"(exports, module) {
    "use strict";
    var options = {};
    if (process.env.DOTENV_CONFIG_ENCODING != null) {
      options.encoding = process.env.DOTENV_CONFIG_ENCODING;
    }
    if (process.env.DOTENV_CONFIG_PATH != null) {
      options.path = process.env.DOTENV_CONFIG_PATH;
    }
    if (process.env.DOTENV_CONFIG_QUIET != null) {
      options.quiet = process.env.DOTENV_CONFIG_QUIET;
    }
    if (process.env.DOTENV_CONFIG_DEBUG != null) {
      options.debug = process.env.DOTENV_CONFIG_DEBUG;
    }
    if (process.env.DOTENV_CONFIG_OVERRIDE != null) {
      options.override = process.env.DOTENV_CONFIG_OVERRIDE;
    }
    if (process.env.DOTENV_CONFIG_DOTENV_KEY != null) {
      options.DOTENV_KEY = process.env.DOTENV_CONFIG_DOTENV_KEY;
    }
    module.exports = options;
  }
});

// node_modules/dotenv/lib/cli-options.js
var require_cli_options = __commonJS({
  "node_modules/dotenv/lib/cli-options.js"(exports, module) {
    "use strict";
    var re = /^dotenv_config_(encoding|path|quiet|debug|override|DOTENV_KEY)=(.+)$/;
    module.exports = function optionMatcher(args) {
      const options = args.reduce(function(acc, cur) {
        const matches = cur.match(re);
        if (matches) {
          acc[matches[1]] = matches[2];
        }
        return acc;
      }, {});
      if (!("quiet" in options)) {
        options.quiet = "true";
      }
      return options;
    };
  }
});

// src/app.ts
import express2 from "express";
import cors from "cors";

// generated/prisma/client.ts
import * as process2 from "process";
import * as path from "path";
import { fileURLToPath } from "url";

// generated/prisma/internal/class.ts
import * as runtime from "@prisma/client/runtime/library";
var config = {
  "generator": {
    "name": "client",
    "provider": {
      "fromEnvVar": null,
      "value": "prisma-client"
    },
    "output": {
      "value": "C:\\projects-level2\\medicine-store-app\\generated\\prisma",
      "fromEnvVar": null
    },
    "config": {
      "engineType": "library"
    },
    "binaryTargets": [
      {
        "fromEnvVar": null,
        "value": "windows",
        "native": true
      }
    ],
    "previewFeatures": [],
    "sourceFilePath": "C:\\projects-level2\\medicine-store-app\\prisma\\schema.prisma",
    "isCustomOutput": true
  },
  "relativePath": "../../prisma",
  "clientVersion": "6.19.2",
  "engineVersion": "c2990dca591cba766e3b7ef5d9e8a84796e47ab7",
  "datasourceNames": [
    "db"
  ],
  "activeProvider": "postgresql",
  "postinstall": false,
  "inlineDatasources": {
    "db": {
      "url": {
        "fromEnvVar": "DATABASE_URL",
        "value": null
      }
    }
  },
  "inlineSchema": '// This is your Prisma schema file,\n// learn more about it in the docs: https://pris.ly/d/prisma-schema\n\n// Looking for ways to speed up your queries, or scale easily with your serverless or edge functions?\n// Try Prisma Accelerate: https://pris.ly/cli/accelerate-init\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\nenum Role {\n  USER\n  SELLER\n  ADMIN\n}\n\nenum OrderStatus {\n  PENDING\n  PAID\n  SHIPPED\n  DELIVERED\n  CANCELLED\n}\n\nmodel User {\n  id       String  @id @default(uuid())\n  name     String?\n  email    String  @unique\n  password String?\n  role     Role    @default(USER)\n\n  // Relations\n  medicines Medicine[] @relation("SellerMedicines")\n  orders    Order[]\n  reviews   Review[]\n\n  createdAt     DateTime  @default(now())\n  updatedAt     DateTime  @updatedAt\n  emailVerified Boolean   @default(false)\n  image         String?\n  sessions      Session[]\n  accounts      Account[]\n  carts         Cart[]\n\n  @@map("user")\n}\n\nmodel Category {\n  id        String     @id @default(uuid())\n  name      String     @unique\n  medicines Medicine[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel Medicine {\n  id          String  @id @default(uuid())\n  name        String\n  description String?\n  price       Float\n  stock       Int\n\n  featured Boolean @default(false)\n\n  // Foreign keys\n  categoryId String\n  sellerId   String\n\n  // Relations\n  category   Category    @relation(fields: [categoryId], references: [id])\n  seller     User        @relation("SellerMedicines", fields: [sellerId], references: [id])\n  reviews    Review[]\n  orderItems OrderItem[]\n\n  createdAt DateTime   @default(now())\n  updatedAt DateTime   @updatedAt\n  cartItems CartItem[]\n\n  @@index([categoryId])\n  @@index([sellerId])\n}\n\nmodel Cart {\n  id     String     @id @default(cuid())\n  user   User       @relation(fields: [userId], references: [id])\n  userId String\n  items  CartItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n}\n\nmodel CartItem {\n  id        String   @id @default(cuid())\n  cart      Cart     @relation(fields: [cartId], references: [id])\n  cartId    String\n  product   Medicine @relation(fields: [productId], references: [id])\n  productId String\n  quantity  Int      @default(1)\n}\n\nmodel Order {\n  id     String      @id @default(uuid())\n  userId String\n  status OrderStatus @default(PENDING)\n  total  Float\n\n  // Relations\n  user  User        @relation(fields: [userId], references: [id])\n  items OrderItem[]\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  @@index([userId])\n}\n\nmodel OrderItem {\n  id         String @id @default(uuid())\n  orderId    String\n  medicineId String\n  quantity   Int\n  price      Float\n\n  // Relations\n  order    Order    @relation(fields: [orderId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  @@index([orderId])\n  @@index([medicineId])\n}\n\nmodel Review {\n  id         String  @id @default(uuid())\n  rating     Int // 1\u20135\n  comment    String?\n  userId     String\n  medicineId String\n\n  // Relations\n  user     User     @relation(fields: [userId], references: [id])\n  medicine Medicine @relation(fields: [medicineId], references: [id])\n\n  createdAt DateTime @default(now())\n\n  @@unique([userId, medicineId])\n  @@index([medicineId])\n}\n\nmodel Session {\n  id        String   @id\n  expiresAt DateTime\n  token     String\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n  ipAddress String?\n  userAgent String?\n  userId    String\n  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@unique([token])\n  @@index([userId])\n  @@map("session")\n}\n\nmodel Account {\n  id                    String    @id\n  accountId             String\n  providerId            String\n  userId                String\n  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)\n  accessToken           String?\n  refreshToken          String?\n  idToken               String?\n  accessTokenExpiresAt  DateTime?\n  refreshTokenExpiresAt DateTime?\n  scope                 String?\n  password              String?\n  createdAt             DateTime  @default(now())\n  updatedAt             DateTime  @updatedAt\n\n  @@index([userId])\n  @@map("account")\n}\n\nmodel Verification {\n  id         String   @id\n  identifier String\n  value      String\n  expiresAt  DateTime\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt\n\n  @@index([identifier])\n  @@map("verification")\n}\n',
  "inlineSchemaHash": "9f68439f4e67ca1deefa5bcb0b91db0aef674019db9cdd06e4d3c84703575b1a",
  "copyEngine": true,
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "dirname": ""
};
config.runtimeDataModel = JSON.parse('{"models":{"User":{"dbName":"user","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"email","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"role","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Role","nativeType":null,"default":"USER","isGenerated":false,"isUpdatedAt":false},{"name":"medicines","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Medicine","nativeType":null,"relationName":"SellerMedicines","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"orders","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","nativeType":null,"relationName":"OrderToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","nativeType":null,"relationName":"ReviewToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"emailVerified","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"image","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sessions","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Session","nativeType":null,"relationName":"SessionToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"accounts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Account","nativeType":null,"relationName":"AccountToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"carts","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Cart","nativeType":null,"relationName":"CartToUser","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Category":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"medicines","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Medicine","nativeType":null,"relationName":"CategoryToMedicine","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Medicine":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"name","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"stock","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"featured","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Boolean","nativeType":null,"default":false,"isGenerated":false,"isUpdatedAt":false},{"name":"categoryId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"sellerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"category","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Category","nativeType":null,"relationName":"CategoryToMedicine","relationFromFields":["categoryId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"seller","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"SellerMedicines","relationFromFields":["sellerId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"reviews","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Review","nativeType":null,"relationName":"MedicineToReview","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"orderItems","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","nativeType":null,"relationName":"MedicineToOrderItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"cartItems","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","nativeType":null,"relationName":"CartItemToMedicine","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Cart":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"CartToUser","relationFromFields":["userId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"CartItem","nativeType":null,"relationName":"CartToCartItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"CartItem":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"cart","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Cart","nativeType":null,"relationName":"CartToCartItem","relationFromFields":["cartId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"cartId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"product","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Medicine","nativeType":null,"relationName":"CartItemToMedicine","relationFromFields":["productId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"productId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"Int","nativeType":null,"default":1,"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Order":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"status","kind":"enum","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"OrderStatus","nativeType":null,"default":"PENDING","isGenerated":false,"isUpdatedAt":false},{"name":"total","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"OrderToUser","relationFromFields":["userId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"items","kind":"object","isList":true,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"OrderItem","nativeType":null,"relationName":"OrderToOrderItem","relationFromFields":[],"relationToFields":[],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"OrderItem":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"orderId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"medicineId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"quantity","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Float","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"order","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Order","nativeType":null,"relationName":"OrderToOrderItem","relationFromFields":["orderId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"medicine","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Medicine","nativeType":null,"relationName":"MedicineToOrderItem","relationFromFields":["medicineId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Review":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"uuid","args":[4]},"isGenerated":false,"isUpdatedAt":false},{"name":"rating","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"comment","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"medicineId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"ReviewToUser","relationFromFields":["userId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"medicine","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Medicine","nativeType":null,"relationName":"MedicineToReview","relationFromFields":["medicineId"],"relationToFields":["id"],"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["userId","medicineId"]],"uniqueIndexes":[{"name":null,"fields":["userId","medicineId"]}],"isGenerated":false},"Session":{"dbName":"session","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"token","kind":"scalar","isList":false,"isRequired":true,"isUnique":true,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true},{"name":"ipAddress","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userAgent","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"SessionToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[["token"]],"uniqueIndexes":[{"name":null,"fields":["token"]}],"isGenerated":false},"Account":{"dbName":"account","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accountId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"providerId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"userId","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":true,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"user","kind":"object","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"User","nativeType":null,"relationName":"AccountToUser","relationFromFields":["userId"],"relationToFields":["id"],"relationOnDelete":"Cascade","isGenerated":false,"isUpdatedAt":false},{"name":"accessToken","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"refreshToken","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"idToken","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"accessTokenExpiresAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"refreshTokenExpiresAt","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"scope","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"password","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false},"Verification":{"dbName":"verification","schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"identifier","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"value","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"expiresAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"createdAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":true,"type":"DateTime","nativeType":null,"default":{"name":"now","args":[]},"isGenerated":false,"isUpdatedAt":false},{"name":"updatedAt","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"DateTime","nativeType":null,"isGenerated":false,"isUpdatedAt":true}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{"Role":{"values":[{"name":"USER","dbName":null},{"name":"SELLER","dbName":null},{"name":"ADMIN","dbName":null}],"dbName":null},"OrderStatus":{"values":[{"name":"PENDING","dbName":null},{"name":"PAID","dbName":null},{"name":"SHIPPED","dbName":null},{"name":"DELIVERED","dbName":null},{"name":"CANCELLED","dbName":null}],"dbName":null}},"types":{}}');
config.engineWasm = void 0;
config.compilerWasm = void 0;
function getPrismaClientClass(dirname2) {
  config.dirname = dirname2;
  return runtime.getPrismaClient(config);
}

// generated/prisma/internal/prismaNamespace.ts
var prismaNamespace_exports = {};
__export(prismaNamespace_exports, {
  AccountScalarFieldEnum: () => AccountScalarFieldEnum,
  AnyNull: () => AnyNull,
  CartItemScalarFieldEnum: () => CartItemScalarFieldEnum,
  CartScalarFieldEnum: () => CartScalarFieldEnum,
  CategoryScalarFieldEnum: () => CategoryScalarFieldEnum,
  DbNull: () => DbNull,
  Decimal: () => Decimal2,
  JsonNull: () => JsonNull,
  MedicineScalarFieldEnum: () => MedicineScalarFieldEnum,
  ModelName: () => ModelName,
  NullTypes: () => NullTypes,
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
import * as runtime2 from "@prisma/client/runtime/library";
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
  client: "6.19.2",
  engine: "c2990dca591cba766e3b7ef5d9e8a84796e47ab7"
};
var NullTypes = {
  DbNull: runtime2.objectEnumValues.classes.DbNull,
  JsonNull: runtime2.objectEnumValues.classes.JsonNull,
  AnyNull: runtime2.objectEnumValues.classes.AnyNull
};
var DbNull = runtime2.objectEnumValues.instances.DbNull;
var JsonNull = runtime2.objectEnumValues.instances.JsonNull;
var AnyNull = runtime2.objectEnumValues.instances.AnyNull;
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
var PrismaClient = getPrismaClientClass(__dirname);
path.join(__dirname, "query_engine-windows.dll.node");
path.join(process2.cwd(), "generated/prisma/query_engine-windows.dll.node");

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

// node_modules/dotenv/config.js
(function() {
  require_main().config(
    Object.assign(
      {},
      require_env_options(),
      require_cli_options()(process.argv)
    )
  );
})();

// src/lib/prisma.ts
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
  trustedOrigins: process.env.APP_URL ? [process.env.APP_URL] : [],
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

// src/middlewares/notfound.ts
function notFound(req, res) {
  res.status(404).json({
    message: "Route not found!",
    path: req.originalUrl,
    date: Date()
  });
}

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
app.use(notFound);
var app_default = app;

// src/index.ts
var index_default = app_default;
export {
  index_default as default
};
