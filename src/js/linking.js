export const linking = {
  prefixes: ['https://lost-n-found-hub.vercel.app', 'lostnfoundhub://'],
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
