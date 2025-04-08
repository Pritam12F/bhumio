import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { useContext, useState } from "react";
import { GoogleAuthContext } from "../context/auth/context";

export function SelectMenu() {
  const [sheet, setSheet] = useState("");
  const { documents, setDocument } = useContext(GoogleAuthContext);

  const handleChange = (event: SelectChangeEvent) => {
    setSheet(event.target.value);
    setDocument?.(event.target.value);
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
        {documents.map(({ name, id }) => (
          <MenuItem value={id}>{name}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
