import { Document } from "../../hooks/useExportDashboard";
import {
  Paper,
  Typography,
  Box,
  Grid,
  Chip,
  Button,
  Card,
  CardContent,
  CardActions
} from "@mui/material";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface ExportDocumentsProps {
  documents: Document[];
}

export const ExportDocuments = ({ documents }: ExportDocumentsProps) => {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        position: 'relative',
        zIndex: 1,
        boxShadow: (theme) => theme.shadows[2]
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Export Documents
      </Typography>

      <Grid container spacing={3}>
        {documents.map((doc) => (
          <Grid item xs={12} md={6} lg={4} key={doc.id} component="div">
            <Card
              variant="outlined"
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: (theme) => theme.shadows[2],
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {doc.name}
                  </Typography>
                  <Chip
                    label={doc.status}
                    color={doc.status === "approved" ? "success" : "warning"}
                    size="small"
                    variant="outlined"
                  />
                </Box>

                <Box sx={{ mt: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Type: {doc.type}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    Uploaded by: {doc.uploadedBy}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Date: {doc.uploadDate}
                  </Typography>
                </Box>
              </CardContent>

              <CardActions sx={{ justifyContent: 'flex-start', px: 2, pb: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  startIcon={<OpenInNewIcon />}
                  onClick={() => window.open(doc.url, "_blank")}
                >
                  View Document
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
