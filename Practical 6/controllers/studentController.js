const { ObjectId } = require('mongodb');
const { getDB } = require('../db_connection');
// 'require' se jab ham 'mongoDB' ki library mnga rhe hai, to vo ek bhut bada object deti hai jisme saare functions or tools hote hai. And apne '{ ObjectId }' se ye bta rhe hai ki mujhe poori mongoDB ki library nhi chahiye, mujhe uske andr jo 'ObjectId' hai, bas vo nikal kar de do. Is method ko 'Object Destructuring' kehte hai.
// const mongodb = require('mongodb');
// const ObjectId = mongodb.ObjectId;
// Ab upr waale syntax me dekho, ye bda pad rha hai, pehle saari library mngai, and fir sirf 'ObjectId' use kra. Isliye simple bnane ke liye vo 'Object Destructuring' wala syntax use kra h.

// POST - Add Student
async function addStudent(req, res) { 
// Because database se data (list vgera) mangwana ek "time taking" kaam hai, isiliye hamne ise asynchronous bnaya hai.
// req (Request): Isme vo saara data hota hai jo user (ya frontend) bhej raha hai (jaise student ka name, roll number, etc.)
// res (Response): Iska use ham tab krenge jab hame wapas user ko btana hoga ki student add (ya jo bhi operation perform kr rhe) hua ya nhi.
    try {
        const db = getDB(); 
        // Database access krega and db variable me store krega for further use.
        const result = await db.collection("students").insertOne(req.body); 
        // 'db.collection' means, poora collection (jo ki key:value pair me hoga) me se 'students' name ka jo collection, usme user ka bheja hua data daal do. And ye data 'insertOne' method se insert hoga, ye ek data insert karta hai. 'req.body' me vo data hai jo user ne bheja hai and insertOne function us table (collection) me insert kar dega. Apne agar jyada items insert krna chahte hai ek baar me to apne 'insertMany' use kr skte hai.

        res.status(201).json({ 
            // '201' standard status code hai, means "Created". Telling browser ki kaam hogya and data create ho gya.
            message: "Student Added Successfully", 
            // Apne user ko wapas (res = result) ek "Success Message" and save hua data bhej rhe hai in JSON format.
            data: result
        });
    } catch (error) { 
        // Agar try ke andr koi bhi galti hui (jaise database connect nahi hua), toh control seedha yahan aa jaayega.
        res.status(500).json({ // '500' means Internal Server Error. 
            error: error.message // Isse user ko btaya jaaega ki real me problem kya hai.
        });
    }
}

// GET - Get All Students
async function getStudents(req, res) {
    try { // Ham apna main code hamesha iske andar likhte hai, taaki pehle ye wala part execute ho, and agar koi problem aai to catch wala ho. Saara logic iske andar hota hai, taaki agar database down ho, to crash na ho.
        const db = getDB(); 
        // database ka connection db variable me store kra hai.
        const students = await db.collection("students").find().toArray();
        // '.find()': means sab kuch dhoondh lo do bhi students collection me. And agar apne 'find({name: "Rahul"})' likhte hai to sirf yahi wala find krega.
        // 'toArray()': MongoDB data ko "Cursor" (pointer) me deta hai. Hame JS ke normal array (list) me badlne ke liye '.toArray()' ka use krna pdta hai.

        res.json(students); 
        // data ke milne par ham use JSON format me user ko bhej dete hai. Yahan hamne .status(200) isiliye nahi likha kyuki JS me successful response ka default status code 200 hota hai. 
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
}

// PATCH - Update Student
// Patch ka use krte hai agar koi specific part of data ko update krna ho, and put se poora data update hota hai, chahe kuch hissa hi kyu na update krna ho
async function updateStudent(req, res) { 
// pichle do parts me 'req' ka use nhi hua tha, but is baar do cheejein milengi: URL se ID and Body se new data.
    try {
        const db = getDB();
        const id = req.params.id; // isse parameters me se ids aa jaaengi students ki, jaise url hota hai: /students/12345, ye 12345 wahi id hai jo ham req.params se nikaal rhe hai.

        const result = await db.collection("students").updateOne(
            // 'updateOne()' function do kaam kar rha hai: 
            { _id: new ObjectId(id) },
            // Filter (Kise dhoondhna hai?): MongoDB me id sirf ek string nhi hoti, vo ek special 'ObjectId' hoti hai. Isliye ham new ObjectId(id) use krte hai taaki MongoDB samajh ske ki ham kis document ki baat kar rhe hai. MongoDB string ID ko nhi pehchanta, use object format chahiye hota hai.
            { $set: req.body }
            // Update (Kya badlna hai?): Yaha '$set' means sirf vahi cheeje badlo jo 'req.body' me aai hai, baaki data ko mat chedo. Agar ham iska use nhi krte hai to MongoDb purane saare data ko htakr new data rkh deta hai, chahe usme kam cheeje kyu na ho original waale se.
        );

        res.json({
            message: "Student Updated Successfully",
            result // yaha ham user ko update ka result bhej denge.
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
}

//DELETE - Delete Student
async function deleteStudent(req, res) {
    try {
        const db = getDB();
        const id = req.params.id;

        const result = await db.collection("students").deleteOne(
            // ye MongoDB ka ek method hai jiski madad se hame jisko delete krna hai, use hi delete kar skte hai.
            { _id: new ObjectId(id) }
            // Ye MongoDB ka ek filter hai, jisme ham MongoDB ko bol rhe hai ki usko delete kro jiski _id hamari di hui id se match karti hai.
        );

        res.json({
            message: "Student Deleted Successfully",
            result // Btaega ki kitne documents delete hue hai.
        });
    } catch(error) {
        res.status(500).json({
            error: error.message
        });
    }
}



module.exports = {
    addStudent,
    getStudents,
    updateStudent,
    deleteStudent
};
// Aise export krna isliye jroori hai taaki ham 'studentRoutes.js' wali file me use kar ske. Iske bina, ye functions sirf isi file tak limited reh jaaenge.