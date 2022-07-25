import { useMutation, useQuery } from "@tanstack/react-query";
import { IPost } from "./Posts";

interface IPostDetailProps {
  post: IPost;
}
interface IComments {
  id: number;
  email: string;
  body: string;
}

async function fetchComments(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId: number) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ title: "REACT QUERY FOREVER!!!!" }),
    }
  );
  return response.json();
}

export function PostDetail({ post }: IPostDetailProps) {
  // replace with useQuery
  const { data, isLoading, isError } = useQuery<IComments[]>(
    ["comments", post.id],
    () => fetchComments(post.id)
  );
  const deleteMutation = useMutation((postId: number) => deletePost(postId));
  const updateMutation = useMutation((postId: number) => updatePost(postId));
  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate(post.id)}>
        Delete
      </button>{" "}
      <button onClick={() => updateMutation.mutate(post.id)}>
        Update title
      </button>
      {deleteMutation.isError && <div style={{ color: "red" }}>ERROR</div>}
      {deleteMutation.isLoading && (
        <div style={{ color: "blue" }}>deleting post...</div>
      )}
      {deleteMutation.isSuccess && (
        <div style={{ color: "green" }}>success delete post</div>
      )}
      {updateMutation.isError && <div style={{ color: "red" }}>ERROR</div>}
      {updateMutation.isLoading && (
        <div style={{ color: "blue" }}>updating post...</div>
      )}
      {updateMutation.isSuccess && (
        <div style={{ color: "green" }}>success update post</div>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {isError && <div>ERROR!</div>}
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        data?.map((comment) => (
          <li key={comment.id}>
            {comment.email}: {comment.body}
          </li>
        ))
      )}
    </>
  );
}
