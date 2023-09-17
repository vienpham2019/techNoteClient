import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from './authSlice';
import { useLoginMutation } from "./authApiSlice";

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [login, { isLoading }] = useLoginMutation();

    useEffect(() => {
        // this is setfocus to username input when the component load 
        userRef.current.focus()
    }, [])

    useEffect(() => {
        // this is for set err message = '' when username or password change 
        setErrMsg('');
    }, [username, password])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { accessToken } = await login({ username, password }).unwrap();
            dispatch(setCredentials({ accessToken }));
            setUserName('');
            setPassword('');
            navigate('/dash');
        } catch (error) {
            if (!error.status) {
                setErrMsg('No Server Response')
            } else if (error.status === 400) {
                setErrMsg('Missing Username or Password')
            } else if (error.status === 401) {
                setErrMsg('Unauthorized')
            } else {
                setErrMsg(error.data?.message)
            }
        }
        errRef.current.focus();
    }

    const onUsernameChange = (e) => setUserName(e.target.value);
    const onPasswordChange = (e) => setPassword(e.target.value);

    if (isLoading) return <div>Loading ...</div>

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <div className="form__container">
                    {/* aria-live is for creen reader can read when err message appear */}
                    <p ref={errRef} className="text-danger" aria-live="assertive">{errMsg}</p>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label text-black">
                                Username
                            </label>
                            <input
                                className="form-control"
                                name="username"
                                type="text"
                                id="username"
                                ref={userRef}
                                value={username}
                                onChange={onUsernameChange}
                                autoComplete="off"
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label text-black">
                                Password
                            </label>
                            <input
                                className="form-control"
                                name="password"
                                type="password"
                                id="password"
                                value={password}
                                onChange={onPasswordChange}
                                autoComplete="off"
                                required
                            />
                        </div>
                        <button className="btn btn-outline-info" type="submit">
                            Sign In
                        </button>
                    </form>
                </div>
            </main>
            <footer>
                <Link to="/">Back to Home</Link>
            </footer>
        </section>
    )
    return content
}

export default Login; 