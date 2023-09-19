import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from './authSlice';
import { useLoginMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation, faHouse } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
    const userRef = useRef()
    const errRef = useRef()
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [persist, setPersist] = usePersist();

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
    const handleToggle = () => setPersist(prev => !prev)

    if (isLoading) return <div>Loading ...</div>

    const errorContainer = (
        <p ref={errRef} className="alert alert-danger d-flex justify-content-between align-items-center" aria-live="assertive">
            <div>{errMsg}</div>
            <FontAwesomeIcon icon={faTriangleExclamation} />
        </p>
    )

    const content = (
        <section className="public">
            <header>
                <h1>Employee Login</h1>
            </header>
            <main className="login">
                <div className="form__container">
                    {/* aria-live is for creen reader can read when err message appear */}
                    {errMsg && errorContainer}
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

                        <div className="mb-3">
                            <label htmlFor="persist" className="form-label text-dark mx-2">
                                Trust This Device
                            </label>
                            <input
                                className="form-check-input"
                                type="checkbox"
                                id="persist"
                                name="persist"
                                checked={persist}
                                onChange={handleToggle}
                            />
                        </div>
                    </form>
                </div>
            </main>
            <footer>
                <Link to="/"><FontAwesomeIcon icon={faHouse} /> Back to Home</Link>
            </footer>
        </section>
    )
    return content
}

export default Login; 