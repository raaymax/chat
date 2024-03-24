import styled from 'styled-components';

type IconProps = {
  className: string;
  size?: number;
}

const StyledIcon = styled.i<{ $size?: number}>`
  margin: auto;
  padding: 0;
  vertical-align: middle;
  text-align: center;
  display: inline;
  ${(props) => {
    if (props.$size) {
      return `
        width: ${props.$size}px;
        height: ${props.$size}px;
        line-height: ${props.$size}px;
        font-size: ${props.$size}px;
      `;
    }
  }}
`;


export const Icon = ({ size, className}: IconProps) => (
  <StyledIcon className={'icon ' + className} $size={size} />
);
