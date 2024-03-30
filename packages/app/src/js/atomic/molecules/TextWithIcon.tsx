import styled from 'styled-components';
import {Icon} from '../atoms/Icon';
import {Text} from '../atoms/Text';
import {useSize} from '../../contexts/size';
import {cn, ClassNames} from '../../utils';

const Container = styled.div`
  display: inline-block;
 .text {
   padding: 0px 10px; 
  }
`;

type TextWithIconProps = {
  children: any;
  size?: number;
  className?: ClassNames;
  icon: string;
};

export const TextWithIcon = ({
  children, size, className, icon,
}: TextWithIconProps) => {
  const $size = useSize(size);
  return (
    <Container className={cn(className)}>
      <Icon icon={icon} size={$size ? $size/2.3 : $size} />
      <Text size={$size ? $size/2.3 : $size}>{children}</Text>
    </Container>
  );
}
