import { IDCSet } from "../../constants";
import styled from "styled-components";
import { withTheme } from "@material-ui/core/styles";

interface IDSPickerProps {
  onIDSSelected: (ids: string) => void;
}

const IDSPickerContainer = withTheme(styled("div")`
  display: flex;
  flex-wrap: wrap;
  // justify-content: space-between;

  // padding-left: 15px;
  // padding-right: 15px;
  // padding-top: 10px;
  // padding-bottom: 10px;

  font-size: 20pt;
  // font-weight: bold;

  margin-top: 10px;

  color: ${(props) => props.theme.palette.text.primary};
`);

const IDSContainer = styled.div`
  cursor: pointer;
  width: 30px;
  height: 30px;
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
