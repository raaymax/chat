import {h} from 'preact';

export const FilePlaceholder = ({data: {fileName, contentType, progress}, ondelete}) => console.log('render', progress) || (
  <div class='file-placeholder'>
    <div class='type'><i class='fa-solid fa-file' /></div>
    <div class='name'>{fileName} [{contentType}]</div>
    <div class='remove' onclick={ondelete}><i class='fa-solid fa-xmark' /></div>
    <div class='progress' style={`width: ${progress}%;`} />
  </div>
)
