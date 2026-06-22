const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                const response =
                    await fetch(
                        "/logout",
                        {
                            method: "POST"
                        }
                    );

                const result =
                    await response.json();

                if (result.success) {

                    window.location.href =
                        "/login";

                    return;
                }

                alert(result.message);

            } catch (err) {

                console.error(err);

                alert("Server Error");

            }

        }
    );
}