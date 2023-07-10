module.exports = {
  "env": { // 环境 针对那些环境的语法
    "browser": true,
    "es2021": true,
    "node": true
  },
  "extends": [ // 集成了那些规则，别人写好的
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential"
  ],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parser": "vue-eslint-parser", // 可以解析.vue文件
  "parserOptions": {
    "ecmaVersion": "latest",
    "parser": "@typescript-eslint/parser", // 解析ts文件
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint",
    "vue"
  ],
  "rules": { // 自定义规则
    'vue/multi-word-component-names': "off"
  }
}
