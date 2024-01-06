import { useAuth } from "../../login-social/login";
import { useCollection } from "react-firebase-hooks/firestore";
import queryAllChats from "./queryAllChats";
import { AllPosts } from "../../ts/posts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createGlobalState, useGlobalState } from "../../ts/useGlobalState";
import { serverPOST } from "../../js/sendServerReq";
import { useEffect, useState } from "react";

export default function useAllChats() {
  const [user] = useAuth();
  const myUid = user?.uid;

  const [fbValue, fbLoading, fbError] = useCollection(queryAllChats(myUid));
  const chats = fbValue?.docs;

  const [userById] = useGlobalState(UserById);
  const [initialLoading] = useGlobalState(InitialLoading);

  const [fetchError, setFetchError] = useState(null);
  const error = fbError || fetchError;

  if (!user) return ["no-user", null];
  if (fbLoading || initialLoading) return ["loading", null];
  if (!chats) return ["no-chats", null]; // only return "no-chats" after "loading" check
  if (error) return [error, null];

  const chatingWithUids = chats.map((chat) =>
    chat.data().participants.find((uid) => uid !== myUid)
  );

  const missingUids = chatingWithUids.filter((uid) => !(uid in userById));

  if (missingUids.length === 0) {
    const conversations = chatingWithUids.map((uid) => userById[uid]);
    return [null, conversations];
  }

  useEffect(() => {
    (async () => {
      const res = await serverPOST("/api/get-users", { uids: missingUids }, { withAuth: false });
      const users = await res.json();
      fillUsersByIds(users);
      setFetchError(null);
    })().catch(setFetchError);
  }, [missingUids.join(",")]); // todo have reload button on error

  return ["loading", null];
}

const UserById = createGlobalState({});

const InitialLoading = createGlobalState(true);

AsyncStorage.getItem("userById").then((_userById) => {
  _userById && UserById.set(JSON.parse(_userById));

  const extractUsersFromPosts = (posts) => {
    const postsAuthors = posts.map((post) => post.author);
    fillUsersByIds(postsAuthors);
  };

  extractUsersFromPosts(AllPosts.get());
  AllPosts.subscribe(extractUsersFromPosts);

  InitialLoading.set(false);
});

/**
 * @param {Array<{ _id: string, name: string, profilePicUrl: string }>} users
 */
function fillUsersByIds(users) {
  const _userById = UserById.get();
  let _hasNewOne = false;
  users.forEach((user) => {
    if (!(user._id in _userById)) {
      _hasNewOne = true;
      const { _id, name, profilePicUrl } = user;
      _userById[user._id] = { _id, name, profilePicUrl };
    }
  });
  if (!_hasNewOne) {
    UserById.set(_userById);
    AsyncStorage.setItem("userById", JSON.stringify(_userById));
  }
}
