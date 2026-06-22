async function loadProfile() {

    try {

        const response =
            await fetch("/profile");

        if (response.status === 401) {

            window.location.replace("/login");
            return;
        }

        const result =
            await response.json();

        if (!result.success) {

            window.location.replace("/login");
            return;
        }

        document.getElementById("welcomeName")
            .textContent =
            `Selamat Datang Kembali, ${result.user.fullname}`;

        document.getElementById("profileName")
            .textContent =
            `Hi, ${result.user.fullname}`;

        document.getElementById("identityNumber")
            .textContent =
            result.user.identity_number ||
            "Peserta Umum";

        document.getElementById("department")
            .textContent =
            result.user.department ||
            "Umum";

    } catch (err) {

        console.error(err);

        window.location.replace("/login");
    }
}

loadProfile();