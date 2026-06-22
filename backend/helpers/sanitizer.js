// backend/helpers/sanitizer.js

function sanitizeUser(user){
    return {
        id:user.id,
        fullname:user.fullname,
        email:user.email,
        role:user.role,
        identity_number:user.identity_number,
        department:user.department,
        photo:user.photo,
        bio:user.bio
    };
}

function sanitizeCourse(course) {
    return{
        id:course.id,
        teacher_id:course.teacher_id,
        teacher_name:course.teacher_name,
        title:course.title,
        description:course.description,
        thumbnail:course.thumbnail,
    }
}

function sanitizeModule(module){
    return {
        id:module.id,
        course_id:module.course_id,
        title:module.title,
        description:module.description,
        order_no:module.order_no
    };
}

function sanitizeMaterial(material){
    return {
        id:material.id,
        module_id:material.module_id,
        title:material.title,
        type:material.type,
        content:material.content,
        file_path:material.file_path
    };
}

//digunakan untuk mengekspor modul atau fungsi yang ada di file ini.
module.exports ={
    sanitizeUser,
    sanitizeCourse,
    sanitizeModule,
    sanitizeMaterial
}