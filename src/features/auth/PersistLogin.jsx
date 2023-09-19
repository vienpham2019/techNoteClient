import { useEffect, useRef, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false);

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        if (effectRan.current === true || process.env.NODE_ENV !== 'development') { // for react 18 strict mode
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    // const res = 
                    await refresh()
                    // const { accessToken } = res.data
                    setTrueSuccess(true)
                } catch (error) {
                    console.log(error)
                }
            }

            if (!token && persist) verifyRefreshToken()
        }

        return () => effectRan.current = true

    }, [])

    let content
    if (!persist) {
        // console.log('no persis')
        content = <Outlet />
    } else if (isLoading) {
        // console.log('loadind')
        content = <p>Loading ...</p>
    } else if (isError) {
        // console.log('error')
        content =
            <div className="alert alert-danger" role="alert">
                {`${error?.data?.message} - `}
                <Link to='/login'>Please Login again</Link>
            </div>
    } else if (isSuccess && trueSuccess) { // persist: yes, token: yes
        // console.log('success')
        content = <Outlet />
    } else if (token && isUninitialized) { // persist: yes, token: yes
        // console.log('token and uninit', isUninitialized)
        content = <Outlet />
    }

    return content
}

export default PersistLogin