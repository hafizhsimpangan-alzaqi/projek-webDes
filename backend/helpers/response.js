// backend/helpers/response.js

//helper untuk response
function sendJson(res,statusCode,data){
    res.writeHead(statusCode,{ //menulis header dengan status code 200 dan content type text/plain
        'Content-Type':'application/json'
    });

    res.end(JSON.stringify(data)); //mengakhiri response dengan mengirimkan data dalam format JSON
}
//helper untuk menangani error
function handleDbError(res,err){
    console.error(err);

    sendJson(res,500,{
        success:false,
        message:"Server Error"
    });
}

//digunakan untuk mengekspor modul atau fungsi yang ada di file ini.
module.exports ={
    sendJson,
    handleDbError
}