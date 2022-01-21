module.exports = {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.js",
        "./resources/**/*.jsx",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/aspect-ratio"),
        require("@tailwindcss/line-clamp"),
        require("@tailwindcss/typography"),
    ],
};
