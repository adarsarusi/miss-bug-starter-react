const { useState } = React
const { Route, Routes } = ReactRouterDOM
const Router = ReactRouterDOM.HashRouter

import { authService } from './services/auth.service.js'

import { UserMsg } from './cmps/UserMsg.jsx'
import { AppHeader } from './cmps/AppHeader.jsx'
import { AppFooter } from './cmps/AppFooter.jsx'
import { Home } from './pages/Home.jsx'
import { BugIndex } from './pages/BugIndex.jsx'
import { BugDetails } from './pages/BugDetails.jsx'
import { AboutUs } from './pages/AboutUs.jsx'
import { LoginSignUp } from './pages/LoginSignUp.jsx'
import { UserDetails } from './pages/UserDetails.jsx'

export function App() {
    const [loggedinUser, setLoggedinUser] = useState(authService.getLoggedinUser())

    return <Router>
        <div className="app-wrapper">
            <AppHeader loggedinUser={loggedinUser} setLoggedinUser={setLoggedinUser} />
            <UserMsg />
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/bug" element={<BugIndex />} />
                    <Route path="/bug/:bugId" element={<BugDetails />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/auth" element={<LoginSignUp setLoggedinUser={setLoggedinUser} />} />
                    <Route path="/user/:userId" element={<UserDetails />} />
                </Routes>
            </main>
            <AppFooter />
        </div>
    </Router>
}
