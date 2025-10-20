import { Header } from "../components/header";

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

                </form>

            </main>
        </>
    );
};

export default LoginPage;