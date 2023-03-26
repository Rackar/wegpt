module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  // parserOptions: {
  //   parser: "babel-eslint",
  // },
  rules: {
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
    //if后必须加花括号
    curly: 1,
    //禁止条件表达式中出现赋值操作符
    "no-cond-assign": 1,
    //箭头函数括号适时省略
    "arrow-parens": [1, "always"],
    //不允许var，用let const代替
    "no-var": 1,
    // 能用const时不用let

    "prefer-const": 1,
    // 每个变量定义需要单独行
    "one-var": [1, "never"],

    // 不允许定义未使用的变量
    // "no-unused-vars": 1,
    "no-unused-vars": 0, //暂时屏蔽掉
    //对象属性使用点而不是方括号
    // 'dot-notation': 1,

    // 屏蔽无必要的字符串相加
    "no-useless-concat": "warn",

    // 字符串使用字面量而不是加号连接
    "prefer-template": "warn",

    // 不允许空函数体
    "no-empty": "warn",

    // 块末插入空行
    "padding-line-between-statements": [
      "warn",
      { blankLine: "always", prev: "block-like", next: "*" },
    ],

    //尽量使用对象简写
    "object-shorthand": ["warn", "always", { ignoreConstructors: true }],

    // 回调函数必须使用箭头函数
    "prefer-arrow-callback": "warn",

    // 尽量使用对象解构赋值
    "prefer-destructuring": [
      "warn",
      {
        object: true,
      },
      {
        enforceForRenamedProperties: false,
      },
    ],

    //禁止在循环中声明函数
    "no-loop-func": "warn",

    //禁止循环中出现await。应使用await Promise.all(results)将promise集合并行处理
    "no-await-in-loop": "warn",
    "no-return-assign": "warn",
  },
}
