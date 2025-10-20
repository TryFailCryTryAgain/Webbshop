
const RegisterPage = () => {
    return (
        <>
            <main className="register-container">
                <form className="register-form">
                    <h2 className="register-title">Register Here</h2>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="first_name">First Name</label>
                            <input 
                                type="text" 
                                id="first_name"
                                name="first_name"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Last Name</label>
                            <input 
                                type="text" 
                                id="last_name"
                                name="last_name"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="tel">Phone Number</label>
                        <input 
                            type="tel" 
                            id="tel"
                            name="tel"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            name="email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input 
                            type="text" 
                            id="address"
                            name="address"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="ZIP">ZIP Code</label>
                            <input 
                                type="text" 
                                id="ZIP"
                                name="ZIP"
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            name="password"
                            required
                        />
                        <div className="password-strength">
                            <div className="strength-bar"></div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input 
                            type="password" 
                            id="confirm-password"
                            name="confirm-password"
                            required
                        />
                    </div>

                    <button type="submit">Register</button>

                    <div className="form-footer">
                        <p>Already have an account? <a href="/login">Login here</a></p>
                    </div>
                </form>
            </main>
        </>
    );
};

export default RegisterPage;