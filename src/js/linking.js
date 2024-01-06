export const linking = {
  prefixes: ["lost-it.vercel.app", "lostit://"],
  config: {
    screens: {
      FoundStack: {
        initialRouteName: "Feed",
        screens: {
          Feed: "found",
          FilterPicker: "found/search",
          PostPage: "found/item",
        },
      },
      LostStack: {
        initialRouteName: "Feed",
        screens: {
          Feed: "lost",
          FilterPicker: "lost/search",
          PostPage: "lost/item",
        },
      },
      ChatsStack: "chats",
      ChatsStack: {
        initialRouteName: "ChatsScreen",
        screens: {
          ChatsScreen: "chats",
          ConversationScreen: "conversation",
        },
      },
      MoreStack: {
        initialRouteName: "MorePage",
        screens: {
          MorePage: "more",
          PostComposer: "new-post",
        },
      },
      NotFound: "*",
    },
  },
};
