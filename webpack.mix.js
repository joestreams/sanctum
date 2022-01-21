const mix = require("laravel-mix");

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel applications. By default, we are compiling the CSS
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js("resources/js/app.js", "public/js")
    .react()
    .extract([
        "react",
        "react-dom",
        "react-router-dom",
        "classnames",
        "@heroicons/react",
        "@headlessui/react",
    ])
    .postCss("resources/css/app.css", "public/css", [require("tailwindcss")]);

if (mix.inProduction()) {
    mix.version();
} else {
    mix.browserSync({
        notify: false,
        proxy: "localhost",
    }).disableSuccessNotifications();
}
