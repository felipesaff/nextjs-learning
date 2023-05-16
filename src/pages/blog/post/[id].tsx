import axios from "axios"
import { GetServerSideProps } from "next";
import Link from "next/link";
import Error from "next/error";
import { Comment, Post, User } from "@/types";

interface Props {
    post: Post;
    comments: Comment[];
    user: User;
    error?: boolean;
}

export default function Post({user, comments,post, error}: Props) {
    if(error) return <Error statusCode={500} />
    return (
            <div className="lg:w-1/2 w-3/4 mx-auto py-2">
                <Link href='/blog' className="text-indigo-600">return</Link>
                <div className="border-b border-indigo-600 py-2 my-4">
                    <p className="font-bold text-sm"> {user.name} says: </p>
                    <h1 className="text-center font-bold text-3xl my-4"> {post.title} </h1>
                    <p> {post.body} </p>
                </div>
                <p className="text-xl text-center mt-8 mb-4">Comments ({comments.length}) </p>
                {
                    comments.map((comment, i) => (
                        <div key={i} className="mb-6 pl-3 border-l border-indigo-400">
                            <p className="font-bold">{comment.email}:</p>
                            <p> {comment.body} </p>
                        </div>
                    ))
                }
            </div>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    try {
        const [
            post,
            comments,
            users
        ] = await Promise.all([
            axios.get(`${process.env.API_URL}/posts/${context.params?.id}`)
            .then(res => res.data)
            .catch(err => err.json()),
            axios.get(`${process.env.API_URL}/comments?postId=${context.params?.id}`)
            .then(res => res.data)
            .catch(err => err.json()),
            axios.get(`${process.env.API_URL}/users`)
            .then(res =>res.data)
            .catch(err => err.json())
        ])
        const user = users.find((user: User) => user.id === post.userId)
    
        return {props: {user, post, comments}}
    }
    catch {
        return {props: { error: true } }
    }
}