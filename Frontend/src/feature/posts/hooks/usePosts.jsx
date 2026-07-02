import { useContext } from "react";
import { PostsContext } from "../posts.context";

export function usePosts() {
  return useContext(PostsContext);
}
