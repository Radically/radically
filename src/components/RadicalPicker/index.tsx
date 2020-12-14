import React, { useState, useEffect, useRef, forwardRef } from "react";
import {
  FixedSizeList,
  FixedSizeList as List,
  ListChildComponentProps,
} from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Button, Icon, Input } from "semantic-ui-react";
import styled from "styled-components";
import SimpleBar from "simplebar-react";
import { IDCSet } from "../../constants";
import { usePrevious } from "../../utils";

const RADICALS_PER_ROW = 8; // arbitrary

const ReadingsSection = styled(SimpleBar)`
  background-color: white;
  margin-top: 5px;
  border-radius: 5px;
  padding: 5px;
  max-height: 100px;
`;

const HeaderRow = styled.div`
  font-size: 12pt;
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  align-items: center;
`;

const NormalRow = styled.div`
  padding-left: 5px;
  padding-right: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IndividualRadicalCell = styled("div")<{ selected: boolean }>`
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.selected ? "#2185d0" : "none")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border-radius: 5px;
  cursor: pointer;
`;

const RadicalPickerRow = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { arrayified, handleRadicalClick, selectedInfo } = data;
  if (arrayified[index].header) {
    return <HeaderRow style={style}>{arrayified[index].name}</HeaderRow>;
  }
  return (
    <NormalRow
      key={index}
      style={{
        ...style,
      }}
    >
      {arrayified[index].radicals.map((radical: string, col: number) => (
        <IndividualRadicalCell
          selected={selectedInfo.index === index && selectedInfo.col === col}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleRadicalClick(event, index, col, radical);
          }}
        >
          {radical}
        </IndividualRadicalCell>
      ))}

      {new Array(RADICALS_PER_ROW - arrayified[index].radicals.length)
        .fill(undefined)
        .map((x) => (
          <IndividualRadicalCell selected={false} />
        ))}
    </NormalRow>
  );
};

const NarrowedRadicalPickerRow = (props: ListChildComponentProps) => {
  const { index, style, data } = props;
  const { narrowedArrayified, selectedInfo, handleRadicalClick } = data;
  return (
    <NormalRow key={index} style={style}>
      {narrowedArrayified[index].map((radical: string, col: number) => (
        <IndividualRadicalCell
          selected={selectedInfo.index === index && selectedInfo.col === col}
          onClick={(event: React.MouseEvent<HTMLElement>) => {
            handleRadicalClick(event, index, col, radical);
          }}
        >
          {radical}
        </IndividualRadicalCell>
      ))}

      {new Array(RADICALS_PER_ROW - narrowedArrayified[index].length)
        .fill(undefined)
        .map((x) => (
          <IndividualRadicalCell selected={false} />
        ))}
    </NormalRow>
  );
};

const RadicalPickerContainer = styled.div`
  box-shadow: 0px 3px 15px rgba(0, 0, 0, 0.2);
  background-color: #e3e3e3;
  padding: 5px;
  border-radius: 5px;
  // max-height: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  &:focus {
    outline: none;
  }
`;

const TwoPaneContainer = styled.div`
  padding-top: 5px;
  flex: 1;
  display: flex;
  min-height: 0;
`;

const StrokesScrollContainer = styled(SimpleBar)`
  border-radius: 5px;
  width: 50px;
  // overflow: scroll;
  // background-color: red;
  background-color: white;
`;

const RadicalsScrollContainer = styled.div`
  font-weight: bold;
  font-size: 15pt;
  background-color: white;
  flex: 1;
  margin-left: 5px;
  border-radius: 5px;
`;

const NarrowedRadicalsContainer = styled.div`
  margin-top: 5px;
  background-color: white;
  border-radius: 5px;
  flex: 1;
  min-height: 0;
  font-size: 15pt;
  font-weight: bold;
`;

interface RadicalPickerProps {
  reverseMap: ReverseMap;
  variantRadicals: VariantRadicals;
  baseRadicals: BaseRadicals;
  strokeCount: StrokeCount;
  readings: Readings;
  onRadicalSelected: (radical: string) => void;
}

interface SelectedInfo {
  index: number;
  col: number;
  radical: string;
}

const outerElementType = forwardRef((props, ref: any) => (
  <div
    onKeyDown={(e) => {
      const { key } = e;
      if (key.startsWith("Arrow")) e.preventDefault();
    }}
    ref={ref}
    {...props}
  />
));

const RadicalPicker = (props: RadicalPickerProps) => {
  const {
    baseRadicals,
    variantRadicals,
    strokeCount,
    readings,
    reverseMap,
    onRadicalSelected,
  } = props;

  const [selectedInfo, setSelectedInfo] = useState({} as SelectedInfo);
  const [narrowedRadicals, setNarrowedRadicals] = useState([] as string[]);

  const arrowKeyPressed = useRef(false);

  const inputRef = useRef<Input>(null);
  const listOuterRef = useRef<HTMLElement>(null);
  const pickerContainerRef = useRef<HTMLDivElement>(null);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    if (searchText === "") setNarrowedRadicals([]);
  }, [searchText]);

  useEffect(() => {
    if (!radicalSelected) return;
    const narrowed = !!narrowedArrayified.length;
    let { index, col } = selectedInfo;
    // todo: avoid using setTimeout..
    if (arrowKeyPressed.current)
      setTimeout(() => {
        (narrowed
          ? (narrowedRadicalListRef as any)
          : (radicalListRef as any)
        ).current.scrollToItem(index, "center");
        pickerContainerRef.current?.focus();
      }, 5);
  }, [selectedInfo]);

  const radicalListRef = useRef<FixedSizeList>(null);
  const narrowedRadicalListRef = useRef<FixedSizeList>(null);
  const strokeCountToRadicals: { [key: number]: string[] } = { 999: [] };
  // for (let radical of baseRadicals) {
  for (let radical of Object.keys(variantRadicals)) {
    const strokes = strokeCount[radical] || 999;
    if (!strokeCountToRadicals[strokes]) strokeCountToRadicals[strokes] = [];
    strokeCountToRadicals[strokes].push(radical);
  }

  const strokeCountToStart: { [key: string]: number } = {};

  const arrayified: {
    header: boolean;
    name?: string;
    radicals?: string[];
  }[] = [];
  for (let strokeCount in strokeCountToRadicals) {
    strokeCountToStart[strokeCount] = arrayified.length;
    arrayified.push({
      header: true,
      name: `${strokeCount === "999" ? "" : strokeCount}筆畫${
        strokeCount === "999" ? "不詳" : ""
      }`,
    });

    let tempArray;
    for (
      let i = 0, j = strokeCountToRadicals[strokeCount].length;
      i < j;
      i += RADICALS_PER_ROW
    ) {
      tempArray = strokeCountToRadicals[strokeCount].slice(
        i,
        i + RADICALS_PER_ROW
      );
      arrayified.push({
        header: false,
        radicals: tempArray,
      });
    }
  }

  const narrowedArrayified: string[][] = [];
  let tempArray;
  for (let i = 0, j = narrowedRadicals.length; i < j; i += RADICALS_PER_ROW) {
    tempArray = narrowedRadicals.slice(i, i + RADICALS_PER_ROW);
    narrowedArrayified.push(tempArray);
  }

  const handleRadicalClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    col: number,
    radical: string
  ) => {
    arrowKeyPressed.current = false;
    if (selectedInfo.index === index && selectedInfo.col === col)
      onRadicalSelected(radical);
    setSelectedInfo({ index, col, radical });
    event.stopPropagation();
    event.preventDefault();
    pickerContainerRef.current?.focus();
  };

  // get the 1st level decomposition of each individual character + all related radicals, add them all into a set
  const performSearch = () => {
    setSelectedInfo({} as SelectedInfo);
    const relatedRadicals = new Set<string>();
    if (searchText) {
      for (let char of searchText) {
        if (char in reverseMap) relatedRadicals.add(char);
        // add the 1st level decomp
        if (reverseMap[char])
          for (let { ids } of reverseMap[char].ids_strings) {
            for (let radical of ids) {
              if (!IDCSet.has(radical)) relatedRadicals.add(radical);
            }
          }

        if (variantRadicals[char])
          for (let radical of Array.from(variantRadicals[char]))
            relatedRadicals.add(radical);
      }
    }
    // add all variants of the result for convenience, e.g. 见 -> 見
    for (let char of Array.from(relatedRadicals)) {
      if (variantRadicals[char])
        for (let radical of Array.from(variantRadicals[char]))
          relatedRadicals.add(radical);
    }
    setNarrowedRadicals(Array.from(relatedRadicals));
  };

  const radicalSelected = "index" in selectedInfo && "col" in selectedInfo;

  // todo: move the "next index, col" calculation to another function for easier unit testing
  const handleFocusedArrowButton = (btn: string) => {
    const narrowed = !!narrowedArrayified.length;
    const _selectedInfo = { ...selectedInfo };

    if (!radicalSelected) {
      // first row, first col
      _selectedInfo.index = narrowed ? 0 : 1;
      _selectedInfo.col = 0;
    } else {
      let { index, col } = _selectedInfo;

      if (btn.endsWith("Up")) {
        _selectedInfo.index = Math.max(index - 1, narrowed ? 0 : 1);
        // if we are using the regular radical picker
        if (!narrowed && arrayified[_selectedInfo.index].header)
          _selectedInfo.index -= 1;
      } else if (btn.endsWith("Down")) {
        _selectedInfo.index = Math.min(
          index + 1,
          narrowed
            ? narrowedArrayified.length - 1
            : arrayified.length -
                (arrayified[arrayified.length - 1].header ? 2 : 1)
          // edge case
        );
        // if we are using the regular radical picker
        if (!narrowed && arrayified[_selectedInfo.index].header)
          _selectedInfo.index += 1;
      } else if (btn.endsWith("Left")) {
        _selectedInfo.col = Math.max(col - 1, 0);
      } else if (btn.endsWith("Right")) {
        _selectedInfo.col = Math.min(
          col + 1,
          narrowed
            ? narrowedArrayified[index].length - 1
            : (arrayified[index] as any).radicals.length - 1
        );
      }
    }

    // set the radical
    let { index, col } = _selectedInfo;
    col = Math.min(
      col,
      narrowed
        ? narrowedArrayified[index].length - 1
        : (arrayified[index].radicals as any).length - 1
    );
    _selectedInfo.col = col;
    if (narrowed) _selectedInfo.radical = narrowedArrayified[index][col];
    else _selectedInfo.radical = (arrayified[index].radicals as any)[col];
    setSelectedInfo(_selectedInfo);
  };

  const handleInputArrowDown = () => {
    const _selectedInfo = { ...selectedInfo };
    _selectedInfo.index = narrowed ? 0 : 1;
    _selectedInfo.col = 0;
    setSelectedInfo(_selectedInfo);
  };

  const narrowed = narrowedRadicals.length;

  const isInputFocused =
    (inputRef.current as any)?.inputRef.current === document.activeElement;

  return (
    <RadicalPickerContainer
      ref={pickerContainerRef}
      onKeyDown={(e: React.KeyboardEvent) => {
        const { key } = e;
        if (key.startsWith("Arrow") && !isInputFocused) {
          // click on radical -> still false -> use arrow key to scroll
          arrowKeyPressed.current = true;
          handleFocusedArrowButton(key);
          e.preventDefault();
        } else if (key === "Enter") {
          if (arrowKeyPressed.current) onRadicalSelected(selectedInfo.radical);
        }
      }}
      tabIndex={-1}
    >
      <Input
        ref={inputRef}
        onClick={() => {
          setSelectedInfo({} as SelectedInfo);
        }}
        onKeyDown={(e: any) => {
          const { key } = e;
          if (key === "ArrowDown") {
            arrowKeyPressed.current = true;
            e.stopPropagation();
            e.preventDefault();
            handleInputArrowDown();
            pickerContainerRef.current?.focus();
          } else if (key === "Enter") {
            if (!arrowKeyPressed.current) performSearch();
          }
        }}
        value={searchText}
        onChange={(e) => {
          setSearchText(e.target.value);
          // reset
          arrowKeyPressed.current = false;
        }}
        /* action={{
          color: "blue",
          icon: "search",
          onClick: performSearch,
        }} */
        placeholder="Search..."
        action
      >
        <input />

        {searchText && (
          <Button
            onClick={() => {
              setSelectedInfo({} as SelectedInfo);
              setSearchText("");
            }}
            icon
            color="grey"
          >
            <Icon name="close" />
          </Button>
        )}

        <Button onClick={performSearch} icon color="blue">
          <Icon name="search" />
        </Button>
      </Input>

      {narrowedRadicals.length > 0 && (
        <NarrowedRadicalsContainer
          onClick={() => {
            setSelectedInfo({} as SelectedInfo);
          }}
        >
          <AutoSizer>
            {({ height, width }) => (
              <List
                ref={narrowedRadicalListRef}
                height={height}
                itemData={{
                  narrowedArrayified,
                  selectedInfo,
                  handleRadicalClick,
                }}
                itemCount={narrowedArrayified.length}
                itemSize={35}
                width={width}
              >
                {NarrowedRadicalPickerRow}
              </List>
            )}
          </AutoSizer>
        </NarrowedRadicalsContainer>
      )}

      {narrowedRadicals.length === 0 && (
        <TwoPaneContainer>
          <StrokesScrollContainer>
            {Object.keys(strokeCountToRadicals).map((strokeCount) => (
              <div
                onClick={() => {
                  // depend on useEffect to scroll
                  arrowKeyPressed.current = true;
                  if (!narrowed) {
                    const firstOfSectionIndex =
                      strokeCountToStart[strokeCount] + 1;
                    if (firstOfSectionIndex === arrayified.length) return;

                    setSelectedInfo({
                      index: firstOfSectionIndex,
                      col: 0,
                      radical: (arrayified[firstOfSectionIndex] as any)
                        .radicals[0],
                    });
                  }
                }}
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  paddingTop: "10px",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
              >
                {strokeCount === "999" ? "不詳" : strokeCount}
              </div>
            ))}
          </StrokesScrollContainer>

          <RadicalsScrollContainer
            onClick={() => {
              setSelectedInfo({} as SelectedInfo);
            }}
          >
            <AutoSizer>
              {({ height, width }) => (
                <List
                  outerElementType={outerElementType}
                  outerRef={listOuterRef}
                  ref={radicalListRef}
                  height={height}
                  itemData={{ arrayified, selectedInfo, handleRadicalClick }}
                  itemCount={arrayified.length}
                  itemSize={35}
                  width={width}
                >
                  {RadicalPickerRow}
                </List>
              )}
            </AutoSizer>
          </RadicalsScrollContainer>
        </TwoPaneContainer>
      )}

      {radicalSelected && (
        <ReadingsSection>
          {selectedInfo.radical in readings
            ? Object.entries(readings[selectedInfo.radical]).map((entry) => (
                <div>
                  <span style={{ fontWeight: "bold" }}>{entry[0]}:</span>{" "}
                  {entry[1]}
                </div>
              ))
            : "No info available."}
        </ReadingsSection>
      )}
    </RadicalPickerContainer>
  );
};

export default RadicalPicker;
