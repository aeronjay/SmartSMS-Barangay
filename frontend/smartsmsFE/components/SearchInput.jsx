import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchInput() {
    const [search, setSearch] = useState("");

    return (
        <TextField
            variant="outlined"
            placeholder="Search residents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            sx={{
                width: "100%",
                backgroundColor: "white",
                borderRadius: "8px",
                m: 0,
                p: 0,
                "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                    // Reduce padding here
                    padding: "4px 8px",  // Adjust these values as needed
                    "& fieldset": {
                        borderColor: "#d1d5db",
                    },
                    "&:hover fieldset": {
                        borderColor: "#9ca3af",
                    },
                    "&.Mui-focused fieldset": {
                        borderColor: "#6b7280",
                    },
                },
                // Reduce input padding specifically
                "& .MuiInputBase-input": {
                    padding: "4px 4px",  // Adjust these values as needed
                },
            }}
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#9ca3af" }} />
                        </InputAdornment>
                    ),
                }
            }}
        />
    );
}