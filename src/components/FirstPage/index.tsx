// yep, i'm not very imaginative
// the page with the welcome name and the radical and ids text boxes

import styled from "styled-components";
import IDSPicker from "../IDSPicker";
import Switch, { ReactSwitchProps } from "react-switch";
import { SettingsContext } from "../../contexts/SettingsContextProvider";
import { FunctionComponent } from "react";

const Input = styled.input.attrs((props) => ({
  // we can define static props
  type: "search",

  // or we can define dynamic ones
  size: props.size || "0.5em",
}))`
  // display: block;
  color: black;
  font-size: 1em;
  font-family: var(--default-sans);
  font-weight: bold;
  border: 1px solid #909090;
  // border-radius: 2px;

  /* here we use the dynamically computed prop */
  // margin: ${(props) => props.size};
  margin-top: ${(props) => props.size};
  padding: ${(props) => props.size};

  &:focus {
    border: 2px solid black;
  }

  box-sizing: border-box;
  width: 100%;
`;

const AppNameh1 = styled.h1`
  font-size: 1.5rem;
  // background-color: #ca4246;
  // background-color: red;

  /* Create the gradient. */
  background-image: linear-gradient(60deg, black, #00695c);

  /* Set the background size and repeat properties. */
  background-size: 100%;
  background-repeat: repeat;

  /* Use the text as a mask for the background. */
  /* This will show the gradient as a text color rather than element bg. */
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-background-clip: text;
  -moz-text-fill-color: transparent;
`;

const FirstPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const LetterBox = styled.div`
  width: 75%;
  @media (max-width: 600px) and (orientation: landscape) {
    width: 90%;
  }

  display: flex;

  @media (orientation: portrait) {
    flex-direction: column;
  }
`;

const RadicalIDSFlex = styled.div`
  flex: 0.8;
`;

const ToggleButtonFlex = styled.div`
  flex: 0.2;

  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  @media (orientation: landscape) {
    padding-left: 20px;
  }

  @media (orientation: portrait) {
    // the switches and search button should be on the same baseline in portrait mode
    align-items: flex-end;

    // add padding to the top
    padding-top: 10px;
  }
`;

const Button = styled.button`
  // display: inline-block;

  width: 100%;
  flex: 1;

  color: #00695c;
  font-size: 1em;
  // margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid #00695c;
  display: block;

  &:active {
    background-color: #00695c;
    color: white;
  }

  // in portrait mode add some margin
  @media (orientation: portrait) {
    margin-top: 10px;
  }
`;

const InputLabel = styled.label`
  fontweight: "normal";
  display: "block";
`;

const FirstPageSwitch = (props: ReactSwitchProps) => {
  const { onChange, checked, className, id } = props;
  return (
    <Switch
      onChange={onChange}
      checked={checked}
      uncheckedIcon={false}
      checkedIcon={false}
      height={20}
      width={50}
      onColor={"#00695c"}
      className={className}
      id="radical-frequency-checkbox"
    />
  );
};

const _SwitchLabelContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  @media (orientation: portrait) {
    padding-left: 5px;
    padding-right: 5px;
  }
`;

const SwitchLabelContainer: FunctionComponent<{}> = (props) => {
  const { children } = props;
  return <_SwitchLabelContainer>{children}</_SwitchLabelContainer>;
};

function FirstPage() {
  return (
    <FirstPageContainer>
      <AppNameh1>部首組合式漢字檢索</AppNameh1>
      <LetterBox>
        <RadicalIDSFlex>
          <div style={{ width: "100%" }}>
            <InputLabel>Radicals</InputLabel>
            <Input placeholder="食喜" />
          </div>

          <div style={{ width: "100%", paddingTop: "10px" }}>
            <InputLabel>IDS</InputLabel>
            <Input placeholder="食喜" />
          </div>

          <IDSPicker onIDSSelected={() => {}} />
        </RadicalIDSFlex>

        <SettingsContext.Consumer>
          {({
            exactRadicalFreq,
            setExactRadicalFreq,
          }: {
            exactRadicalFreq: boolean;
            setExactRadicalFreq: (arg0: boolean) => void;
          }) => (
            <ToggleButtonFlex>
              <SwitchLabelContainer>
                <FirstPageSwitch
                  onChange={(e) => {
                    setExactRadicalFreq(!exactRadicalFreq);
                  }}
                  checked={exactRadicalFreq}
                  className="radical-frequency-switch"
                  id="radical-frequency-checkbox"
                />

                <div
                  style={{
                    fontSize: "10pt",
                    textAlign: "justify",
                    paddingTop: "5px",
                  }}
                >
                  部首率完全一致*
                </div>
              </SwitchLabelContainer>

              <SwitchLabelContainer>
                <FirstPageSwitch
                  onChange={(e) => {}}
                  checked={true}
                  className="web-worker-switch"
                  id="web-worker-checkbox"
                />

                <div
                  style={{
                    fontSize: "10pt",
                    textAlign: "justify",
                    paddingTop: "5px",
                  }}
                >
                  託於副處理脈絡
                </div>
              </SwitchLabelContainer>

              {/* force flex wrap onto next line */}
              <div style={{ flexBasis: "100%", height: 0 }} />

              <Button>檢索</Button>
            </ToggleButtonFlex>
          )}
        </SettingsContext.Consumer>
      </LetterBox>
    </FirstPageContainer>
  );
}

export default FirstPage;
