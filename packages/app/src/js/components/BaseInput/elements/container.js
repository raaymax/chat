import styled from 'styled-components';

export const InputContainer = styled.div`
  position: relative;
  border-top: 1px solid #565856;
  background-color: var(--secondary_background);
  display: flex;
  flex-direction: column;

  & .toolbar {
    display: flex;
    flex-direction: row;
  }

  & .toolbar button:first-child {
    margin-left: 30px;
  }

  & .toolbar button {
    color: var(--secondary_foreground);
    margin: 2px 0 2px 2px;
    width: 25px;
    height: 25px;
    border: 0;
    padding: 1px 3px;
    background: none;
  }

  & .toolbar button:hover {
    color: var(--primary_foreground);
    background-color: var(--primary_active_mask);
  }

  & .actionbar {
    display: flex;
    flex-direction: row;
    padding: 5px;
    display: flex;
    justify-content: flex-end;
    flex-direction: row;
    height: 40px;
    margin-bottom: 5px;
    margin-right: 5px;
  }

  & .info {
    flex: 1;
    line-height: 30px;
    padding: 0px 10px;
    font-weight: 300;
    vertical-align: middle;
    font-size: .8em;
  }

  .info.error{
    color: #852007;
  }

  .info.action:hover{
    --text-decoration: underline;
    cursor: pointer;
    font-weight: bold;
  }

  & .actionbar .action {
    flex: 0 0 30px;
    width: 30px;
    height: 30px;
    padding: 0 6px;
    border-radius: 100%;
    line-height: 30px;
    align-items: center;
    align-content: center;
    justify-content: center;
    text-align: center;
    
    vertical-align: middle;
    margin-left: 10px;
  }
  & .actionbar .action.green {
    background-color: #1c780c;
  }
  & .actionbar .action.green:hover {
    background-color: #2aa115;
  }
  & .actionbar .action.green:active {
    background-color: #1c780c;
  }

  & .actionbar .action:hover {
    background-color: rgba(249,249,249,0.05);
  }
  & .actionbar .action:active {
    background-color: rgba(249,249,249,0.1);
  }
  & .actionbar .action.active {
    background-color: rgba(249,249,249,0.1);
  }

  .input {
    flex: 1;
    border: 0;
    padding: 5px 30px;

    .emoji img {
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      vertical-align: bottom;
    }
  }
  .input:focus-visible {
    outline: none;
  }

  & .ql-toolbar.ql-snow{
    border: 0;
  }

  & .ql-container.ql-snow {
    border: 0;
  }

  & .channel {
    color: #3080a0;
  }
`;
