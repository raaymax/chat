import styled from 'styled-components';

const ColumnContainer= styled.div<{$image: string}>`
  flex: 0 0 300px;
  display: block;
  max-width: 300px;
  border-left: 2px solid ${(props) => props.theme.Labels};
  border-radius: 0;
  padding: 10px;  
  margin-bottom: 10px;
  margin-right: 10px;
  cursor: pointer;

  .text {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: pre-wrap;
    font-size: 0.8em;
  }
  * {
    cusor: pointer;
  }  
  
  
  .image {
    width: 100%;
    height: 150px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url(${(props) => props.$image});
  }
  
  img {
    max-width: 100%;
    height: 150px;
  }
  &:hover {
    border-color: ${(props) => props.theme.borderColorHover};
  }
`;

type Link = {
  url: string;
  siteName: string;
  title: string;
  description: string;
  images: string[];
};

type BodyColumnProps = {
  link: string;
  width: number;
  children: React.ReactNode;
};

export const BodyColumn = ({ link, width, children }: BodyColumnProps) => (
  <ColumnContainer style={{
    width: `${width}px`, 
    flex: `0 0 ${width}px`
  }} onClick={() => window.open(link, '_blank')?.focus()}>
    {children}
  </ColumnContainer>
);

