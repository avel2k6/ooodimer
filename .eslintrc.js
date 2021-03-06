module.exports = {
    env: {
        browser: true,
        es6: true,
        jquery: true,
        jest: true,
    },
    parser: 'babel-eslint',
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'windows'],
        'no-plusplus': 0,
        'no-console': 0,
        'import/prefer-default-export': 0,
    },
    extends: [
        'airbnb-base',
        'plugin:react/recommended'],
    plugins: [
        'react',
    ],
    settings: {
        "import/core-modules": [ 'electron' ],
        react: {
            createClass: 'createReactClass', // Regex for Component Factory to use,
            // default to "createReactClass"
            pragma: 'React', // Pragma to use, default to "React"
            fragment: 'Fragment', // Fragment to use (may be a property of <pragma>), default to "Fragment"
            version: 'detect', // React version. "detect" automatically picks the version you have installed.
            // You can also use `16.0`, `16.3`, etc, if you want to override the detected value.
            // default to latest and warns if missing
            // It will default to "detect" in the future
            flowVersion: '0.53', // Flow version
        },
        // propWrapperFunctions: [
        //     // The names of any function used to wrap propTypes, e.g. `forbidExtraProps`. If this isn't set, any propTypes wrapped in a function will be skipped.
        //     'forbidExtraProps',
        //     { property: 'freeze', object: 'Object' },
        //     { property: 'myFavoriteWrapper' },
        // ],
        // linkComponents: [
        //     // Components used as alternatives to <a> for linking, eg. <Link to={ url } />
        //     'Hyperlink',
        //     { name: 'Link', linkAttribute: 'to' },
        // ],
    },
    globals: {
        "MAIN_WINDOW_WEBPACK_ENTRY": true
    }
};
