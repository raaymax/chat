import styled from 'styled-components';

export const Container = styled.div`
  position: absolute;
  top: -15px;
  height: 32px;
  right: 10px;
  z-index: 50;
  background-color: var(--primary_background);
  border: 1px solid #565856;
  border-radius: 0.3em;
  padding: 1px 5px;
  font-size: 0.9em;


  i {
    padding: 2px 5px;
    line-height: 24px;
    width: 24px;
    text-align: center;
    vertical-align: middle;
    display: inline;
    font-style: normal;
    cursor: pointer;
    border-radius: 0.2em;
  }

  body.mobile & {
    width: 100%;
    top: -50px;
    right: 0;
    border-radius: 0;
    border-top: 1px solid #565856;
    border-bottom: 1px solid #565856;
    border-left: 0;
    border-right: 0;
    margin: 0;
    padding: 0;
    height: 50px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    i {
      flex: 0 50px;
      line-height: 50px;
      font-size: 25px;

    }
  }

  i:hover {
    background-color: var(--primary_active_mask);
  }

  i:active {
    background-color: var(--secondary_active_mask);
  }
`;
