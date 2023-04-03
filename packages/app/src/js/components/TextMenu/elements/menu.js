import styled from 'styled-components';

export const Menu = styled.div`
  position: absolute;
  margin-top: ${(props) => -props.height * 30 - 40}px;
  width: 300px;
  height: ${(props) => props.height * 30 + 20}px;
  background-color: var(--primary_background);
  bottom: 70px;
  left: 20px;
  font-size: 1.2em;
  padding: 10px 0;
  border-radius: 10px;
  border: 1px solid var(--primary_border_color);
  top: ${(props) => props.top}px;
  left: ${(props) => props.left}px;
  
  &.hidden {
    display: none;
  }

  & ul{
    padding: 0;
    margin: 0;
    display: flex;
    list-style-type: none;
    flex-direction: column-reverse;
  }

  & ul li {
    height: 30px;
    display: flex;
    flex-direction: row;
    cursor: pointer;

    img {
      width: 1.5em;
      height: 1.5em;
      display: inline-block;
      vertical-align: bottom;
    }
  }
  & ul li:hover {
    background-color: var(--primary_active_mask);
  }

  & ul li.selected{
    background-color: var(--primary_active_mask);
  }

  & ul li span:first-child {
    height: 30px;
    width: 30px;
  }
  & ul li span {
    line-height: 30px;
    vertical-align: middle;
    text-align: center;
  }
`;
