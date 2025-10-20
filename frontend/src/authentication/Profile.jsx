import Header from "../components/header.jsx";
import { Link, useParams } from "react-router-dom";
import useFetchData from "../hooks/fetchData.jsx"

export default function Profile() {
    const { id } = useParams();
    const fetchId = id || "me";
    const [userProfile, setUserProfile] = useFetchData(`http://localhost:8000/api/auth/profile/${fetchId}`);

    return (
        <>
            <Header />

            <section className="min-h-[90vh] max-w-[1200px] mx-auto  mt-16 py-4 px-4">

                {userProfile.map(({ username, bio, posts }) => {
                    return (
                        <div key={username}>
                            <section className="flex max-w-[1200px] items-center justify-between gap-4">
                                <div className="flex gap-4">
                                    <h1 className="text-2xl font-bold">{username}</h1>
                                </div>
                                {!id ? (
                                    <Link to="/edit-profile">
                                        <button className="font-semibold bg-blue-200 px-4 py-2 mt-1.5 rounded-lg hover:scale-105 hover:bg-blue-400 transition-all duration-300 cursor-pointer">
                                            Edit Profile
                                        </button>
                                    </Link>
                                ) : (
                                    <div></div>
                                )}
                            </section>

                            <p className="mt-2 ml-4 text-[18px]">{bio ? bio : "Edit your bio......"}</p>

                            <section className="mt-6 mx-auto">
                                <p className="text-lg font-bold mb-2">POSTS</p>
                                <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {posts.map((post) => (
                                        <div key={post.id} className="p-4 mb-2 bg-white rounded-lg shadow">
                                            <div className="">
                                                <h2 className="text-xl font-bold">{post.title}</h2>
                                                <p>{post.details}</p>
                                            </div>
                                            <div className="flex flex-row justify-end">
                                                <Link className to={`/comments/${post.id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                                    </svg>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </section>
                            </section>
                        </div>
                    );
                })}
            </section>
        </>

    )
}