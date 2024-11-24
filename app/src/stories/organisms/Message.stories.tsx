import type { Meta, StoryObj } from '@storybook/react';
 
import '../../styles.ts';
import { Message } from '../../js/components/organisms/Message';
import { allModes } from "../../../.storybook/modes.ts";
import { HoverProvider } from '../../js/components/contexts/hover.tsx';
import { store, actions } from '../../js/store';
import { useHoverCtrl } from '../../js/components/contexts/useHoverCtrl.ts';

 
const meta: Meta<typeof Message> = {
  component: Message,
  parameters: {
    chromatic: {
      modes: {
        mobile: allModes["mobile"],
        desktop: allModes["default"],
      },
    },
  },
  decorators: [
    (Story) => (
      <HoverProvider><Story /></HoverProvider>
    ),
  ],
  loaders: [async () => {
    store.dispatch(actions.users.add({
      id: '123',
      name: 'User',
    }));
    store.dispatch(actions.users.add({
      id: '321',
      name: 'User2',
    }));
    store.dispatch(actions.emojis.add({
      shortname: ':thumbsup:',
      unicode: '1f44d',
    }));
    store.dispatch(actions.emojis.add({
      shortname: ':thumbsdown:',
      unicode: '1f44e',
    }));
  }],
};
 
export default meta;
type Story = StoryObj<typeof Message>;
 
const BaseMessage = {
  id: '321',
  channelId: 'main',
  userId: '123',
  createdAt: '2021-01-01T00:00:00Z',
  clientId: '123',
  flat: 'Hello, world!',
  links: [],
  emojiOnly: false,
  reactions: [],
  attachments: [],
  linkPreviews: [],
  parentId: '',
  appId: '123',
  pinned: false,
  editing: false,
  updatedAt: '2021-01-01T00:00:00Z',
  message: {
    line: { text: 'Hello, world!' },
  },
}

const LongTextMessage = {
  ...BaseMessage,
  flat: 'nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
  message: {
    line: { text: 'nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?' },
  }
}

export const Primary: Story = {
  args: {
    mode: 'default',
    channelId: '123',
    data: {
      ...BaseMessage,
    },
  },
};

export const ReadReceipts: Story = {
  args: {
    mode: 'default',
    channelId: '123',
    data: {
      ...BaseMessage,
      progress: [
        {userId: '123', user: {avatarUrl: '', name: 'User'}},
        {userId: '123', user: {avatarUrl: '', name: 'User'}}
      ],
    },
  },
};
export const LongText: Story = {
  args: {
    mode: 'default',
    channelId: '123',
    data: {
      ...LongTextMessage,
    }
  },
};

export const WithThread: Story = {
  args: {
    mode: 'default',
    channelId: '123',
    data: {
      ...LongTextMessage,
      thread: [
        {
        childId: '123',
        userId: '123',
        },
        {
        childId: '321',
        userId: '321',
        }
      ],
    }
  },
};
export const WithReaction: Story = {
  args: {
    mode: 'default',
    channelId: '123',
    data: {
      ...BaseMessage,
      reactions: [
        {
          userId: '123',
          reaction: ':thumbsup:',
        },
        {
          userId: '321',
          reaction: ':thumbsup:',
        },
        {
          userId: '321',
          reaction: ':thumbsdown:',
        }

      ]
    }
  },
};

export const Ephemeral: Story = {
  args: {
    mode: 'default',
    data: {
      ...BaseMessage,
      priv: true,
    }
  },
};

export const Continuation: Story = {
  args: {
    mode: 'default',
    sameUser: true,
    data: {
      ...BaseMessage,
    }
  },
};

export const EmojiOnly: Story = {
  args: {
    mode: 'default',
    data: {
      ...BaseMessage,
      flat: ':thumbsup:',
      message: {
        emoji: ":thumbsup:",
      },
      emojiOnly: true,
    }
  },
};


export const WithImages: Story = {
  args: {
    mode: 'default',
    data: {
      ...BaseMessage,
      attachments: [
        {
          id: '123',
          fileName: 'image.jpg',
          contentType: 'image/jpeg',
          url: 'https://picsum.photos/200',
        },
        {
          id: '321',
          fileName: 'image2.jpg',
          contentType: 'image/jpeg',
          url: 'https://picsum.photos/200',
        }
      ]
    }
  },
};

export const WithError: Story = {
  args: {
    mode: 'default',
    data: {
      ...BaseMessage,
      info: {
        type: 'error',
        msg: 'Sending message failed',
        action: 'retry',
      }
    }
  },
};
export const WithLinkPreview: Story = {
  args: {
    mode: 'default',
    data: {
      ...BaseMessage,
      flat: 'http://example.com',
      message: {link: {href: 'http://example.com', children: {text: 'http://example.com'}}},
      links: ['http://example.com'],
      linkPreviews: [
        {
          url: 'http://example.com',
          title: 'Example',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sollicitudin scelerisque nisl quis condimentum. Aliquam eget lacus eros. Vestibulum ac posuere massa, eget euismod enim. Nulla interdum magna tortor. Vestibulum sagittis, ex in maximus maximus, neque purus tempor magna, sit amet molestie sapien est id augue. Nulla imperdiet leo nec nisl commodo, nec fringilla leo vehicula. Suspendisse nibh orci, convallis at dictum ut, volutpat non orci. Nulla scelerisque sapien eget purus ullamcorper, eu pellentesque odio tincidunt. Vivamus quis maximus sapien, vitae placerat urna. Vestibulum finibus facilisis aliquam. Aliquam iaculis augue vel metus varius cursus.',
          images: ['https://picsum.photos/200'],
          videos: [],
          mediaType: 'website',
          favicons: [],
          charset: 'utf-8',
          siteName: 'Example',
          contentType: 'text/html',
        },{
          url: 'http://example.com',
          title: 'Example',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sollicitudin scelerisque nisl quis condimentum. Aliquam eget lacus eros. Vestibulum ac posuere massa, eget euismod enim. Nulla interdum magna tortor. Vestibulum sagittis, ex in maximus maximus, neque purus tempor magna, sit amet molestie sapien est id augue. Nulla imperdiet leo nec nisl commodo, nec fringilla leo vehicula. Suspendisse nibh orci, convallis at dictum ut, volutpat non orci. Nulla scelerisque sapien eget purus ullamcorper, eu pellentesque odio tincidunt. Vivamus quis maximus sapien, vitae placerat urna. Vestibulum finibus facilisis aliquam. Aliquam iaculis augue vel metus varius cursus.',
          images: ['https://picsum.photos/200'],
          videos: [],
          mediaType: 'website',
          favicons: [],
          charset: 'utf-8',
          siteName: 'Example',
          contentType: 'text/html',
        }

      ]
    }
  },
};
