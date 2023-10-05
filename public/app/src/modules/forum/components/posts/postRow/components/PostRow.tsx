
import React, { ReactElement } from 'react';
import "../styles/PostRow.sass"
import { Post } from '../../../../models/Post';
import { Points } from '../../points';
import PostMeta from '../../post/components/PostMeta';

interface PostRowProps extends Post {
  onUpvoteClicked: () => void;
  onDownvoteClicked: () => void;
  isLoggedIn: boolean;
  activeFilter: string;
}

function isDateCreatedToday(date: string | Date): boolean {
  // Parse the input date string into a Date object
  if (typeof date === "string")
    date = new Date(date);

  // Get the current date
  const currentDate = new Date();

  // Compare the year, month, and day components of the two dates
  const isSameYear = date.getFullYear() === currentDate.getFullYear();
  const isSameMonth = date.getMonth() === currentDate.getMonth();
  const isSameDay = date.getDate() === currentDate.getDate();

  // If all three components match, the date is from today
  return isSameYear && isSameMonth && isSameDay;
}


/**
 * What this method does is to render a post row with the post meta data and the points
 * 
 * If it is a NEW post it will be highlighted with a light grey background
 * 
 * @param {React.PropsWithChildren<PostRowProps>} props 
 * @returns {ReactElement}
 */
const PostRow: React.FC<PostRowProps> = (props): ReactElement => (
  <div className="post-row" style={{ backgroundColor: props.activeFilter === "NEW" && isDateCreatedToday(props.createdAt) ? "lightgrey" : "" }}>
    <Points
      onUpvoteClicked={() => props.onUpvoteClicked()}
      onDownvoteClicked={() => props.onDownvoteClicked()}
      points={props.points}
      isLoggedIn={props.isLoggedIn}
    />
    <PostMeta {...props} />
  </div>
)

export default PostRow;