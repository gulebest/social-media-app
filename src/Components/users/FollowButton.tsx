import { useSession } from "next-auth/react";
import React from "react";
import {
  useFollowUser,
  useUnfollowUser,
} from "../../../custom-hooks/useFollow";
import { User } from "../../../types/user";
import { useQueryClient } from "@tanstack/react-query";

type FollowButtonProps = {
  userId: string;
  username: string;
  isFollowing: boolean;
};

export default function FollowButton({
  userId,
  username,
  isFollowing,
}: FollowButtonProps) {
  const { mutate: followUserMutation, isPending: following } = useFollowUser();
  const { mutate: unFollowUserMutation, isPending: unfollowing } =
    useUnfollowUser();
  const session = useSession();
  const queryClient = useQueryClient();
  const authUserId = session.data?.user?.id;

  const handleFollow = () => {
    if (!authUserId) return;

    //store the previous state for rollback
    const previousUserDetails: User | undefined = queryClient.getQueryData([
      "userDetails",
      username,
    ]);

    //optimistically update the data before request is processes
    queryClient.setQueryData(["userDetails", username], {
      ...previousUserDetails,
      isFollowing: !isFollowing,
    });
    if (isFollowing) {
      unFollowUserMutation(
        { userId, username },
        {
          onError: (error) => {
            console.log(error.message);
            queryClient.setQueryData(
              ["userDetails", username],
              previousUserDetails
            );
          },
        }
      );
    } else {
      followUserMutation(
        { userId, username, authUserId },
        {
          onError: (error) => {
            console.log(error.message);
            queryClient.setQueryData(
              ["userDetails", username],
              previousUserDetails
            );
          },
        }
      );
    }
  };
  const loading = following || unfollowing;
  return (
    <>
      {isFollowing ? (
        <button
          disabled={loading}
          onClick={handleFollow}
          className="bg-dark-2 px-4 py-2 rounded-full cursor-pointer mt-6"
        >
          Following
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={handleFollow}
          className="bg-primary px-4 py-2 rounded-full cursor-pointer mt-6"
        >
          Follow
        </button>
      )}
    </>
  );
}