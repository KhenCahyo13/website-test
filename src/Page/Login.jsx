import axios from "axios";
import React, { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider, useMutation} from "react-query";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const Login = () => {
    const handleLogin = async () => {
        return await axios.post('https://reqres.in/api/login', {
            email: email,
            password: password
        }).then((response) => {
            setLoading(true)
            setStatus(true)
            setMessage('Login berhasil, diarahkan ke halaman utama...')
            localStorage.setItem('token', JSON.stringify(response.data))
            setTimeout(() => {
                navigate('/')
            }, 2000);
        }).catch((error) => {
            setMessage('Login gagal, username atau password anda salah')
            setTimeout(() => {
                setMessage('')
            }, 2000)
        })
    }
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const mutation = useMutation(handleLogin)

    useEffect(() => {
        if(localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate])

    return (
        <div className="bg-slate-300 min-h-screen w-full px-6 py-32 md:px-24 lg:px-96">
            <div className="bg-white w-full px-4 py-6 rounded-md shadow-lg">
                <h1 className="font-semibold">Website Test</h1>
                <div className={status ? 'sukses' : 'gagal'}>{message}</div>
                <form>
                    <div className="mt-2">
                        <label className="block text-sm font-normal text-gray-400" htmlFor="email">Email *</label>
                        <input onChange={(event) => setEmail(event.target.value)} value={email} className="form-control" type="email" id="email" name="email" placeholder="Masukkan email anda" autoComplete="off" required />
                    </div>
                    <div className="mt-2">
                        <label className="block text-sm font-normal text-gray-400" htmlFor="password">Password *</label>
                        <input onChange={(event) => setPassword(event.target.value)} value={password} className="form-control" type="password" id="password" name="password" placeholder="Masukkan password anda" autoComplete="off" required />
                    </div>
                    <div className="mt-6">
                        <button type="button" onClick={() => mutation.mutate({
                            email, password
                        })} className="btn-login">{ loading ? "Loading" : "Login" }</button>
                    </div>
                </form>
            </div>
        </div>
    )
};

const LoginPage = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <Login />
        </QueryClientProvider>
    )
}

export default LoginPage;