const loginForm =
    document.getElementById("loginForm");

const errorMessage =
    document.getElementById("errorMessage");

loginForm.addEventListener(
    "submit",
    async function(e){

        e.preventDefault();

        const email =
            document.getElementById("email").value;

        const password =
            document.getElementById("password").value;

        try{

            const response =
                await fetch("/login",{
                    method:"POST",
                    headers:{
                        "Content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        email,
                        password
                    })
                });

            const result =
                await response.json();

            if(result.success){

                window.location.href =
                    "/dashboard";

                return;
            }

            errorMessage.textContent =
                result.message;

        }catch(err){

            console.error(err);

            errorMessage.textContent =
                "Server Error";

        }
    }
);