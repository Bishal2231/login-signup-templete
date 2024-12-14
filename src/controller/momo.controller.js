import {asynchandler} from "../utility/asynchandler.js"



const handleMomo=asynchandler(async(req,res)=>{

    const {name,price,message}=req.body
    console.log(name)
    console.log(price)
    console.log(message)


})

export {handleMomo}