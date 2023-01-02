import axios from "axios"
import { useState, useEffect } from "react"
import { useQuery } from "react-query"
import { Link, useNavigate } from "react-router-dom"

const Table = ({ page, data }) => {
    const [detail, setDetail] = useState([])
    const [isData, setIsData] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if(localStorage.getItem('token')) {
            navigate('/')
        }
    }, [navigate])

    const getDetailData = async (id) => {
        try {
            const response = await axios.get(`https://reqres.in/api/users/${id}`)
            setIsData(true)
            setDetail(response.data.data)
        } catch (error) {
            console.log(error)
        }
    }

    const CardModal = () => {
        const handleClose = () => {
            document.getElementById('card').classList.add('hidden')
        }

        return (
            <div id="card" className="w-64 bg-white rounded-md shadow-lg px-4 py-2 mx-auto mb-6">
                <button onClick={handleClose} className="text-sm flex justify-end w-full"><i className="fa-solid fa-xmark"></i></button>
                <h1 className="font-bold text-center text-base mb-2">DETAIL DATA</h1>
                <img src={detail.avatar} className="w-48 mx-auto"></img>
                <p className="text-sm mt-3 text-center font-medium">First Name : {detail.first_name}</p>
                <p className="text-sm mt-1 text-center font-medium">Last Name : {detail.last_name}</p>
                <p className="text-sm mt-1 text-center font-medium">Email : {detail.email}</p>
            </div>
        )
    }

    return (
        <>
        {isData ? <CardModal /> : <h2 className="text-sm font-semibold text-red-500 mb-2">Tidak ada Detail Data yang anda pilih</h2>}
        <table className="w-full text-sm text-center shadow-lg">
            <thead className=" bg-gray-400">
                <tr>
                    <th scope="col" className="py-3 px-6">NO</th>
                    <th className="py-3 px-6">NAME</th>
                    <th className="py-3">DETAIL</th>
                </tr>
            </thead>
            <tbody>
            {data.map(user => (
                <tr key={user.id} className="bg-gray-300 border-b border-gray-400">
                    <th scope="row" className="py-4 px-6">{user.id}</th>
                    <td className="py-4 px-6">{user.first_name} {user.last_name}</td>
                    <td className="py-4">
                        <button onClick={() => getDetailData(user.id)} className="btn-detail ">Detail</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </>
    )
}

const PagingTable = ({ items, itemsPerPage }) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage)

    const data = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)
    return (
        <div className="bg-slate-300 min-h-screen w-full px-6 py-8 md:px-24 lg:px-96">
            <Table page={page} data={data} />
            <div className="flex justify-center items-center gap-4 mt-6">
                {page > 1 && (
                    <button onClick={() => setPage(page - 1)} className="btn-pagination">Sebelumnya</button>
                )}
                {page < totalPages && (
                    <button onClick={() => setPage(page + 1)} className="btn-pagination">Selanjutnya</button>
                )}
            </div>
            <div className="bg-white rounded-md shadow-md px-4 py-2 mt-4">
                <p className="text-sm font-medium text-center">Untuk fitur lengkap silahkan login</p>
                <Link to="/login"><button className="btn-login mt-4">Login</button></Link>
            </div>
        </div>
        );
}

const NotLoggedIn = () => {
    const [datas1, setDatas1] = useState([])
    const [datas2, setDatas2] = useState([])
    const { isLoading1, isError1, data: data1 } = useQuery('data1', () => 
        axios.get('https://reqres.in/api/users?page=1')
        .then((data1) => {
            setDatas1(data1.data.data)
        })
    )
    const { isLoading2, isError2, data: data2 } = useQuery('data2', () => 
        axios.get('https://reqres.in/api/users?page=2')
        .then((data2) => {
            setDatas2(data2.data.data)
        })
    )

    const allData = [...datas1, ...datas2]

    if (isError1 && isError2) return <h1>Error : { isError1.message }, silahkan coba lagi</h1>
    if (isLoading1 && isLoading2) return <h1>Loading data...</h1>

    return <PagingTable items={allData} itemsPerPage={4} />
}

export default NotLoggedIn