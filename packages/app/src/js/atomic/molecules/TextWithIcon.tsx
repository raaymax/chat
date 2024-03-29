import styled from 'styled-components';
import {Icon} from '../atoms/Icon';
import {useSize} from '../../contexts/size';

const Container = styled.div`
  display: inline-block;
 .text {
   padding: 0px 10px; 
  }
`;

type TextWithIconProps = {
  children: any;
  size?: number;
  className?: string;
  icon: string;
};

export const TextWithIcon = ({
  children, size, className, icon,
}: TextWithIconProps) => {
  const $size = useSize(size);
  return (
    <Container className={`${className || ''}`}>
      <Icon icon={icon} size={$size} />
      <span className='text'>{children}</span>
    </Container>
  );
}
