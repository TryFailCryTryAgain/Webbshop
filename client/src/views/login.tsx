
const LoginPage = () => {
    return (
        <>

            <main className="login-container">

                <form className="login-form">

                    <h2 className="login-title">Login Here</h2>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="text"/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password"/>
                    </div>

                    <button type="submit">Log in</button>

                    <div className="form-footer">
                        <p>Don't have an account? <a href="/register">Register here</a></p>
                    </div>
                </form>

            </main>
        </>
    );
};

export default LoginPage;