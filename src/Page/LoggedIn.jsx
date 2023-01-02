import axios from "axios"
import { useEffect, useState } from "react"
import { useQuery } from "react-query"
import { Link } from "react-router-dom"

const Table = ({ page, data }) => {
    const [detail, setDetail] = useState([])
    const [isData, setIsData] = useState(false)

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

    const LikeButton = ({ id }) => {
        const [isLike, setIsLike] = useState(false)
        const [likedData, setLikedData] = useState([]);
        const handleLike = () => {
            setIsLike(!isLike)
        }

        return (
            <button className="btn-like" onClick={handleLike}>{ isLike ? <h1 className="text-sm">Liked</h1> : <i className="fa-solid fa-thumbs-up"></i> }</button>
        )
    }

    const UnlikeButton = ({ id }) => {
        const [isUnlike, setIsUnlike] = useState(false)
        const handleLike = () => {
            setIsUnlike(!isUnlike)
        }

        return (
            <button className="btn-unlike" onClick={handleLike}>{ isUnlike ? <h1 className="text-sm">Unliked</h1> : <i className="fa-solid fa-thumbs-down"></i> }</button>
        )
    }

    return (
        <>
        {isData ? <CardModal /> : <h2 className="text-sm font-semibold text-red-500 mb-2">Tidak ada Detail Data yang anda pilih</h2>}
        <div className="overflow-x-auto relative shadow-lg">
        <table className="w-full text-sm text-center shadow-xl">
            <thead className=" bg-gray-300">
                <tr>
                    <th scope="col" className="py-3 px-6">NO</th>
                    <th className="py-3 px-6">NAME</th>
                    <th className="py-3 px-6">DETAIL</th>
                    <th className="py-3 px-8">AKSI</th>
                </tr>
            </thead>
            <tbody>
            {data.map(user => (
                <tr key={user.id} className="bg-gray-200 border-b border-gray-400">
                    <th scope="row" className="py-4 px-6">{user.id}</th>
                    <td className="py-4 px-6">{user.first_name} {user.last_name}</td>
                    <td className="py-4 px-6">
                        <button onClick={() => getDetailData(user.id)} className="btn-detail ">Detail</button>
                    </td>
                    <td className="py-4 px-8 flex justify-center items-center gap-2">
                        <LikeButton id={user.id} />
                        <UnlikeButton id={user.id} />
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        </>
    )
}

const PagingTable = ({ items, itemsPerPage }) => {
    const [page, setPage] = useState(1);
    const totalPages = Math.ceil(items.length / itemsPerPage)

    const data = items.slice((page - 1) * itemsPerPage, page * itemsPerPage)

    const handleLogout = () => {
        localStorage.removeItem('token')
    }
    return (
        <div className="bg-slate-300 min-h-screen w-full px-4 py-8 md:px-24 lg:px-96">
            <Link to="/login"><button onClick={handleLogout} className="btn-logout"><i className="fa-solid fa-right-from-bracket"></i></button></Link>
            <Table page={page} data={data} />
            <div className="flex justify-center items-center gap-4 mt-6">
                {page > 1 && (
                    <button onClick={() => setPage(page - 1)} className="btn-pagination">Sebelumnya</button>
                )}
                {page < totalPages && (
                    <button onClick={() => setPage(page + 1)} className="btn-pagination">Selanjutnya</button>
                )}
            </div>
        </div>
        );
}

const LoggedIn = () => {
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

export default LoggedIn