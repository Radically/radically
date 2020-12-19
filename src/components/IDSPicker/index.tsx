import { IDCSet } from "../../constants";
import styled from "styled-components";

interface IDSPickerProps {
  onIDSSelected: (ids: string) => void;
}

const IDSPickerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: 20pt;
  font-weight: bold;
`;

const IDSContainer = styled.div`
  cursor: pointer;
`;

const IDSPicker = (props: IDSPickerProps) => {
  const { onIDSSelected } = props;
  const IDSArray = Array.from(IDCSet);
  return (
    <IDSPickerContainer>
      {IDSArray.map((ids) => (
        <IDSContainer
          onClick={() => {
            onIDSSelected(ids);
          }}
        >
          {ids}
        </IDSContainer>
      ))}
    </IDSPickerContainer>
  );
};

export default IDSPicker;
