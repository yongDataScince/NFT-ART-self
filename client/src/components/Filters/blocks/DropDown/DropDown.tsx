import { useEffect, useRef, useState } from 'react';
import ChevronIcon from '../../../UI/icons/ChevronIcon';
import * as Styled from './styles';

interface Item {
  id: number;
  name: string;
  choised?: boolean;
}

interface Props {
  title: string;
  items: Item[],
  onChoise: (id: number) => void
}

export const DropDown: React.FC<Props> = ({ title, items, onChoise }) => {
  const [opened, setOpened] = useState<boolean>(false);
  const contentRef = useRef<null | HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if(contentRef.current?.clientHeight) {
      setContentHeight(contentRef.current.clientHeight)
    }
  }, [contentRef])

  return (
    <Styled.DropDownMain opened={opened} maxHeight={contentHeight} delay={(items.length + 1) * 0.05 * Number(!opened)}>
      <Styled.DropDownHead onClick={() => setOpened(!opened)}>
        {title}
        <Styled.OpenButton opened={opened}>
          <ChevronIcon viewBox="0 0 22 10" />
        </Styled.OpenButton>
      </Styled.DropDownHead>

      <Styled.DropDownContent ref={contentRef}>
        {items.map(({ name, id, choised }) => 
          <Styled.DropDownContentItem key={id} delay={id * 0.05} opened={opened} onClick={() => onChoise(id)} choised={choised}>
            {name}
          </Styled.DropDownContentItem>
        )}
      </Styled.DropDownContent>
    </Styled.DropDownMain>
  )
}