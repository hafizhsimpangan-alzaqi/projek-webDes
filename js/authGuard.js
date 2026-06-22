async function checkAuth() {

    try {

        const response =
            await fetch("/profile");

        if (response.status === 401) {

            window.location.replace("/login");
            return;
        }

    } catch (err) {

        window.location.replace("/login");
    }
}

window.addEventListener(
    "load",
    checkAuth
);

window.addEventListener(
    "pageshow",
    checkAuth
);