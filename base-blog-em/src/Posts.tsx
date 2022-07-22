import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { PostDetail } from "./PostDetail";
export interface IPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}
const maxPostPage = 10; // 최대 페이지 수 10으로 설정

// pageNum을 인자로 받아서 해당 페이지의 포스트를 fetch함
async function fetchPosts(pageNum: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`
  );
  return response.json();
}

function Posts() {
  const [currentPage, setCurrentPage] = useState(0); // 현재페이지를 0으로 초기설정
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const queryClient = useQueryClient();

  // replace with useQuery
  const { data, isLoading, isError } = useQuery<IPost[]>(
    ["posts", currentPage], // 쿼리키를 페이지마다 지정
    () => fetchPosts(currentPage),
    {
      staleTime: 2000, // staleTime을 2초로 설정하여 fetch된 데이터는 2초간 fresh 상태
    }
  );

  useEffect(() => {
    if (currentPage <= maxPostPage - 2) {
      const nextPage = currentPage + 1;
      queryClient.prefetchQuery(["posts", nextPage], () =>
        fetchPosts(nextPage)
      );
    }
  }, [currentPage, queryClient]);

  if (isError) return <h3>ERROR!</h3>;
  if (isLoading) return <h3>Loading...</h3>;
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
        <button
          disabled={currentPage <= 0} // 현재페이지가 0 이하면 previous 버튼 비활성화
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Previous page
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          disabled={currentPage >= maxPostPage - 1} // 현재페이지가 9 이상이면 next 버튼 비활성화
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next page
        </button>
      </div>
      <hr />
      {selectedPost && <PostDetail post={selectedPost} />}
    </>
  );
}

export default Posts;
