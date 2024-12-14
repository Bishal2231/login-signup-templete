import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTempletes.js"
import { mailtrapClient } from "./mailtrap.js"
import { sender } from "./mailtrap.js"

export  const sendVerificationEmail=async(email,verificationToken)=>{

    const recipient=[{email}]

    try {
        
        const response=await mailtrapClient.send(
            {
                from:sender,
                to :recipient,
                subject:"verify your email",
                html:VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken),
                category:"Email Verification",
            }
        )
        console.log ( "email sent successfulyyu",response)
    } catch (error) {
        console.log(`error sendingcerification ${error}`)
        throw new Error(`error sendong code ${error}`)
    }
}

export const  sendWelcomeEmail=async(email,name)=>{
const recipient=[{email}]
    try {
        
        const response = await mailtrapClient.send({
			from: sender,
			to: recipient,
			template_uuid: "e65925d1-a9d1-4a40-ae7c-d92b37d593df",
			template_variables: {
				company_info_name: "Auth Company",
				name: name,
			},
		});
        console.log("welcome email send successfullty",response)
    } catch (error) {
        throw new Error(`error at welcome page ${error}`)
    }

}

export const sendPasswordResetEmail=async(email,resetURL)=>{
    const recipient=[{email}]
try {

   const response= await mailtrapClient.send({
    from:sender,
    to:recipient,
    subject:"reset your password",
    html:PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetURL)
    ,category:"password Reset"

   })
} catch (error) {
    console.log(error)
    
}

}
export const sentResetSuccessEmail=async(email)=>{

const recipient=[{email}]

try {
    const response=mailtrapClient.send({
        from:sender,
        to:recipient,
        subject:"Reset Success Email",
        html:PASSWORD_RESET_SUCCESS_TEMPLATE,
        category:"password Reset"
    
    })
    console.log("password reset successfull")
} catch (error) {
    console.log(error)
    throw new Error(`error sending password reset success email : ${email}`)
}

}