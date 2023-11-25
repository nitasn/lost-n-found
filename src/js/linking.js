export const linking = {
  prefixes: ['https://found-lost.vercel.app', 'foundlost://'],
  config: {
    screens: {
      FoundStack: {
        screens: {
          Feed: 'found',
          FilterPicker: 'found/query',
          PostPage: 'found/item',
        },
      },
      LostStack: {
        screens: {
          Feed: 'lost',
          FilterPicker: 'lost/query',
          PostPage: 'lost/item',
        },
      },
      ChatsStack: 'chats',
      SettingsStack: 'settings',
      NotFound: '*',
    },
  },
};
