

export const Header = () => {
    return (
        <>
            <nav className="user-header">
                <div className="logo">Webbshop</div>
                <div className="search-bar">
                    <input type="text" placeholder="Search..."/>
                </div>
                <ul className="nav-links">
                    <li>Home</li>
                    <li>Products</li>
                    <li>About</li>
                </ul>
                <button className="sign-in">Sign in</button>
            </nav>
        </>
    )
}