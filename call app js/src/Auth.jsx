import { useState } from "react"



export function Auth(){


  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSignUp, setIsSignUp] = useState(true)


  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp)
  }


  const userDataSubmitting = async(e)=> {
    e.preventDefault();


  const url = isSignUp ? "https://www.manithbbratnayake.com/signup" : "https://www.manithbbratnayake.com/signin";


  
  try {
    const response = await fetch(url, 
      {
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },
          body: JSON.stringify({
            email : email,
            password : password,
          }),
      
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data); // Success message from the backend
        navigate("/frontend")      
      } else {
        throw new Error('Error registering user', e);
      }
    } catch (error) {
      console.error('There was an error!', error);
      alert('Error registering user');
    }
  };   
  

 return (
   <>
      
    <form onSubmit={userDataSubmitting}>
      
   <div className="form-group">
      <label htmlFor="exampleInputEmail1">User ID </label>
      <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter UserName"
              value={email} onChange={(e) => setEmail(e.target.value)}/>
   </div>
      
   <div className="form-group">
      <label htmlFor="exampleInputPassword1">Password</label>
      <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" value={password} 
              onChange={(e) => setPassword(e.target.value)}/>
    </div>
    
   
    <button type="submit" className="btn btn-primary">{isSignUp ? "Sign Up" : "Sign In"}</button>
    <h6 onClick={toggleAuthMode}>{isSignUp ? "Already Sign Up? Try Sign In instead" : "New here? Sign Up Instead"}</h6>


  </form>


   </>
 )  




}
