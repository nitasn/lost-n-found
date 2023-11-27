export const linking = {
  prefixes: ["https://lost-n-found-hub.vercel.app", "lostnfoundhub://"],
  config: {
    screens: {
      FoundStack: {
        initialRouteName: 'Feed',
        screens: {
          Feed: "found",
          FilterPicker: "found/search",
          PostPage: "found/item",
        },
      },
      LostStack: {
        initialRouteName: 'Feed',
        screens: {
          Feed: "lost",
          FilterPicker: "lost/search",
          PostPage: "lost/item",
        },
      },
      ChatsStack: "chats",
      SettingsStack: "settings",
      NotFound: "*",
    },
  },
};
