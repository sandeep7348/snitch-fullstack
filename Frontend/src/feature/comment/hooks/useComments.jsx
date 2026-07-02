import { useContext } from "react";
import { CommentsContext } from "../comment.context.jsx";

export function useComments() {
  return useContext(CommentsContext);
}