import { useState } from "react";
import { Link, useNavigate } from "react-router-dom"
import './page-auth.css'
import { AuthWrapper } from "./AuthWrapper";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { Login } from "../../services/auth";

export const LoginPage = () => {
    const [formData, setFormData] = useState({
        password: '',
        email: '',
    });
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            let result = await Login(formData);
            if (Object.keys(result).length > 0 && result.access_token) {
                localStorage.setItem("token", result.access_token)
                localStorage.setItem("bots", JSON.stringify(result.bots))
                localStorage.setItem("managed_users", JSON.stringify(result.managed_users))
                toast.success("Đăng nhập thành công")
                setTimeout(() => {
                    navigate("/message-management")
                }, 500)
            } else {
                toast.warning(result.detail)
            }
        } catch (error) {
            console.log(error);
        }
        setLoading(false)
    };
    return (
        <>
            {loading && <Loading />}
            <AuthWrapper>
                <h4 className="mb-2">Welcome to Chat Bot! 👋</h4>
                <form id="formAuthentication" className="mb-3" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                            type="text"
                            className="form-control"
                            id="email"
                            value={formData.name}
                            onChange={handleChange}
                            name="email"
                            placeholder="Enter your email or username"
                            autoFocus />
                    </div>
                    <div className="mb-3 form-password-toggle">
                        <div className="d-flex justify-content-between">
                            <label className="form-label" htmlFor="password">Password</label>
                            <Link aria-label="Go to Forgot Password Page" to="/auth/forgot-password">
                                <small>Forgot Password?</small>
                            </Link>
                        </div>
                        <div className="input-group input-group-merge">
                            <input
                                type="password"
                                autoComplete="true"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="form-control"
                                name="password"
                                placeholder="&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;&#xb7;"
                                aria-describedby="password" />
                            <span className="input-group-text cursor-pointer"></span>
                        </div>
                    </div>

                    <div className="mb-3">
                        <button aria-label='Click me' className="btn btn-primary d-grid w-100" type="submit">Sign in</button>
                    </div>
                </form>



            </AuthWrapper>
        </>
    )
}