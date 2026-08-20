const raycastConfig = require("@raycast/eslint-config");

module.exports = [...raycastConfig, { ignores: ["dist/**", "raycast-env.d.ts"] }];
