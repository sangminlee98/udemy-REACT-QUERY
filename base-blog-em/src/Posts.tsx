import { useState } from "react";
import { useQuery } from 'react-query';

import { PostDetail } from "./PostDetail";
export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
const maxPostPage = 10;

async function fetchPosts() {
  const response = await fetch(
    "https://jsonplaceholder.typicode.com/posts?_limit=10&_page=0"
  );
  return response.json();
}

function Posts() {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  // replace with useQuery
  const {data, isLoading, isError} = useQuery<IPost[]>('posts', fetchPosts, {staleTime: 2000});

  if(isError) return (<h3>ERROR!</h3>)
  if(isLoading) return (<h3>Loading...</h3>)
  return (
    <>
      <ul>
        {data?.map((post) => (
          <li
            key={post.id}
            className="post-title"
            onClick={() => setSelectedPost(post)}
          >
            {post.title}
          </li>
        ))}
      </ul>
      <div className="pages">
        <button disabled onClick={() => {}}>
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button disabled onClick={() => {}}>
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

export default Posts