import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";

function App() {
    return (
        <div>
            <h1 className='text-3xl font-bold underline'>Hello world!</h1>;
            <Router>
                <Routes>
                    <Route path='/' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                </Routes>
            </Router>
        </div>
    );
}

export default App;
