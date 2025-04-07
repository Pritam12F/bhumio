import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useState } from "react";

type SelectProps = {
  name: string;
  url: string;
}[];

export function SelectMenu({
  sheetList,
  setDocument,
}: {
  sheetList: SelectProps;
  setDocument: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [sheet, setSheet] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSheet(event.target.value);
    setDocument(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="demo-select-small-label">Age</InputLabel>
      <Select
        labelId="demo-select-small-label"
        id="demo-select-small"
        value={sheet}
        label="Age"
        onChange={handleChange}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {sheetList.map(({ name, url }) => (
          <MenuItem value={url}>{name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
