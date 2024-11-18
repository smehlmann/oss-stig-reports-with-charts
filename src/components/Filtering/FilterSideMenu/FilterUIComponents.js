import { Typography, Box, Button } from "@mui/material";
import { styled} from "@mui/system";


export const SectionTitle = styled(Typography)(({ theme }) => ({
    ...theme.typography.h5,
}));

export const ToggleSectionContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    alignItems: 'center'
}));

export const DropdownSectionContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
}));

export const ButtonContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
}));

export const ApplyButton = styled(Button)(({ theme }) => ({
    backgroundColor: theme.palette.primary.dark,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.main, 
    },
  }));
  
export const ClearAllButton = styled(Button)(({ theme }) => ({
    variant: 'outlined', 
    borderColor: theme.palette.primary.dark, 
    color: theme.palette.primary.dark, 
    '&:hover': {
      borderColor: theme.palette.primary.main, 
      color: theme.palette.primary.main,
    },
}));