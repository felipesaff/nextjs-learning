import Link from 'next/link';
import axios from 'axios';
import { Post } from '@/types';

interface Props {
    posts: Post[];
    users: Array<{
        name: string;
        id: number;
    }>
}

export default function Home({posts, users}: Props) {
  return (
    <main
      className='flex flex-col min-h-screen items-center p-24'
    >
        <Link href='/' className="text-indigo-600">return</Link>
        {
            posts.map((post, i) => (
                <Link
                    href={`/blog/post/${post.id}`}
                    key={i}
                    className='border border-indigo-400 px-2 py-4 my-2 rounded-lg w-96 max-w-[80vw]'
                >
                    <p className='text-center'>
                        <i>{users.find(user => user.id === post.userId)?.name} </i>
                        posted:
                    </p>
                    <h1 className='font-bold text-lg mb-2' > {post.title} </h1>
                </Link>
            ))
        }
    </main>
  )
}

export async function getStaticProps() {
    const [users, posts] = await Promise.all([
        axios.get(`${process.env.API_URL}/users`)
        .then(res => res.data),
        axios.get(`${process.env.API_URL}/posts`)
        .then(res => res.data)
    ]);
    return {props: { posts, users } }
}