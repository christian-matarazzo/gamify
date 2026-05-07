import AppHeader from "../components/AppHeader"
import Hero from "../components/Hero";
import AppFooter from "../components/AppFooter"
import { Outlet } from "react-router-dom"

export default function DefaultLayout() {
    return (
        <>
            <div className="app-wrapper">
                <AppHeader />
                <main className="main-content">
                    <Outlet />
                </main>
                <AppFooter />
            </div>
        </>
    )
}