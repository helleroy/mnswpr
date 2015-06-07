module.exports = {
    getFromLocalStorage: function (key) {
        return window.localStorage ? JSON.parse(window.localStorage.getItem(key)) || {} : {};
    },
    setInLocalStorage: function (key, value) {
        if (window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(value));
        }
    }
};