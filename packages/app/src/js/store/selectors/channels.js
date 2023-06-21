import { useSelector } from 'react-redux'

export const useChannels = () => useSelector((state) => Object.values(state.channels)
  .filter((channel) => channel.channelType !== 'DIRECT' && channel.users.includes(state.meId)));
