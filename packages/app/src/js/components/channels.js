import {h} from 'preact';

const Channel = ({name}) => (
  <div class='channel'>{name}</div>
)

export const Channels = () => (
  <div class='channels'>
    <Channel name='main' />
  </div>
)
