import React from 'react'
import { useState } from 'react'
import"../auth.form.scss"
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useauth.js'

export const Login = () => {
    const { loading, handlelogin } = useAuth();
    const navigate = useNavigate()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")

    const handleSubmit = async (e) => {
       e.preventDefault();
       const data = await handlelogin({ email, password });

       if (data?.user) {
         navigate('/')
       }
    }

    if(loading){
        return (<main><h1>loading....</h1></main>)
    }

  return (
    <main>
        <div className="form-container">
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <div className="input-grp">
                    <label htmlFor="email">Email</label>
                    <input  onChange={(e)=>{setemail(e.target.value)}}
                    type='email' id='email' name='email' placeholder='enter email adress'/>          
                </div>
                <div className="input-grp">
                <label htmlFor="password">Password</label>
                <input onChange={(e)=>{setpassword(e.target.value)}} type="password" id='password' name='password' placeholder='enter password' />
                </div>

                <button className='button primary-button'>Login</button>
            </form>

              <p>Dont have an account?<Link to={"/register"}>register</Link></p>
                    
        </div>
    </main>
  )
}

export default Login
