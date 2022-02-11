import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./views/Login";
import Register from "./views/Register";
import FriendList from "./views/Friend/FriendList";
import Main from "./views/Main";

function App() {
    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Main />}></Route>
                    <Route path='/login' element={<Login />}></Route>
                    <Route path='/register' element={<Register />}></Route>
                    <Route path='/friendlist' element={<FriendList />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
