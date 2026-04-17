import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {

const navigate = useNavigate();

const [email,setEmail] = useState("");
const [password,setPassword] = useState("");

const handleRegister = (e) => {

e.preventDefault();

localStorage.setItem("user", JSON.stringify({email,password}));

alert("Registration Successful");

navigate("/login");

};

return (

<div className="flex items-center justify-center h-screen">

<form onSubmit={handleRegister} className="bg-white p-8 shadow-lg rounded">

<h2 className="text-2xl mb-4">Register</h2>

<input
type="email"
placeholder="Email"
value={email}
onChange={(e)=>setEmail(e.target.value)}
className="border p-2 w-full mb-3"
/>

<input
type="password"
placeholder="Password"
value={password}
onChange={(e)=>setPassword(e.target.value)}
className="border p-2 w-full mb-3"
/>

<button className="bg-teal-600 text-white px-4 py-2 w-full">
Register
</button>

</form>

</div>

);

}

export default Register;