import React,{useState}from 'react'
import { useNavigate,Link } from 'react-router'
import { useAuth } from '../hooks/useauth.js'
export const Register = () => {
 
     const navigate = useNavigate()
     const [username, setusername] = useState("")
     const [email, setemail] = useState("")
     const [password, setpassword] = useState("")
     const {loading,handleregister} = useAuth()

           const handleSubmit = async (e) =>{
        e.preventDefault()
        await handleregister({username,email,password})
        navigate("/")
    }

    if(loading){
        return(<main><h1>loading....</h1></main>)
    }

    return (
    
    <div><main>
        <div className="form-container">
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-grp">
                    <label htmlFor="email">Email</label>
                    <input onChange={(e)=>{setemail(e.target.value)}} type='email' id='email' name='email' placeholder='enter email adress'/>          
                </div>
                 <div className="input-grp">
                    <label htmlFor="username">Username</label>
                    <input  onChange={(e)=>{setusername(e.target.value)}}type='text' id='username' name='username' placeholder='enter username'/>          
                </div>
                <div className="input-grp">
                <label htmlFor="password">Password</label>
                <input  onChange={(e)=>{setpassword(e.target.value)}}type="passowrd" id='password' name='password' placeholder='enter password' />
                </div>

                <button className='button primary-button'>Register</button>
            </form>

            <p>Already have an account?<Link to={"/login"}>login</Link></p>
        </div>
    </main></div>
  )
}


export default Register