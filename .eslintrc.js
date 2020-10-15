module.exports = {
    env: {
        browser: true,
        es6: true,
        jquery: true,
        jest: true,
    },
    // parserOptions: {
    //     ecmaVersion: 2015,
    //     sourceType: 'module',
    // },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        'no-plusplus': 0,
    },
    extends: ['airbnb-base'],
};
