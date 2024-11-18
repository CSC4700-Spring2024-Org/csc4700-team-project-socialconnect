import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { createContext, useContext, useState } from "react"
import '../Styles/sidebar.css'
import SocialConnectLogo from '../SocialConnectLogo.png'

const SidebarContext = createContext();

export default function Sidebar({ children }) {
    const [expanded, setExpanded] = useState(false)
    return (
        <>
            <aside className={`sidebar-container ${expanded ? "expanded" : ""}`}>
                <nav className="sidebar-nav-container">
                    <div className="sidebar-toggle-container">
                        <button onClick={() => setExpanded((curr) => !curr)} className={`sidebar-toggle ${expanded ? "expanded" : ""}`}>
                            {expanded ? <FaChevronLeft /> : <FaChevronRight />}
                        </button>
                    </div>
                    <SidebarContext.Provider value={{ expanded }}>
                        <div className="sidebar-items-container">
                            <img className="sidebar-logo" src={SocialConnectLogo}></img>
                            <ul className="sidebar-ul">{children}</ul>
                        </div>
                    </SidebarContext.Provider>
                </nav>
            </aside>
        </>
    )
}

export function SidebarItem({ icon, text, active, onClick }) {
    const { expanded } = useContext(SidebarContext)
    return (
        <li className={`sidebar-li ${active ? "active" : "inactive"}`} onClick={onClick}>
            {icon}
            <span className={`sidebar-span ${expanded ? "expanded" : "collapsed"}`}>{text}</span>

            {!expanded && (
                <div className="custom-class">
                    {text}
                </div>
            )}
        </li>
    )
}