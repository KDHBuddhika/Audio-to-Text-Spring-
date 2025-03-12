import { useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background?.default || "#f5f5f5",
}));

const AudioUploader = () => {
  const [file, setFile] = useState(null);
  const [transcription, setTranscription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setTranscription(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <Typography variant="h3" gutterBottom align="center" color="primary">
        Audio to Text Transcriber
      </Typography>

      <Box sx={{ width: "100%", textAlign: "center" }}>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          id="audio-upload"
          style={{ display: "none" }}
        />
        <label htmlFor="audio-upload">
          <Button variant="contained" component="span">
            Choose Audio File
          </Button>
        </label>
        {file && (
          <Typography variant="body1" sx={{ mt: 2 }}>
            Selected file: {file.name}
          </Typography>
        )}
      </Box>

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!file || isLoading}
        sx={{ mt: 2, mb: 2 }}
      >
        {isLoading ? <CircularProgress size={24} /> : "Upload and Transcribe"}
      </Button>

      {transcription && (
        <Box sx={{ width: "100%", mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Transcription Result
          </Typography>
          <TextField
            multiline
            rows={6}
            value={transcription}
            variant="outlined"
            fullWidth
            InputProps={{
              readOnly: true,
            }}
          />
        </Box>
      )}
    </StyledContainer>
  );
};

export default AudioUploader;