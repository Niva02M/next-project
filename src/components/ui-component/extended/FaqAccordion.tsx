'use client';

import { useEffect, useState, ReactElement } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';

// assets
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// types
import { ThemeMode } from 'types/config';
import { Typography } from '@mui/material';

type MainAccordionItem = {
  _id: string;
  question: ReactElement | string;
  answer: ReactElement | string;
  disabled?: boolean;
  expanded?: boolean;
  defaultExpand?: boolean | undefined;
};

type AccordionItem = {
  _id: string;
  section: ReactElement | string;
  description: ReactElement | string;
  content: MainAccordionItem[];
};

interface AccordionProps {
  data: AccordionItem[];
  defaultExpandedId?: string | boolean | null;
  expandIcon?: ReactElement;
  square?: boolean;
  toggle?: boolean;
}

// ==============================|| ACCORDION ||============================== //

const FaqAccordion = ({ data, defaultExpandedId = null, expandIcon, square, toggle }: AccordionProps) => {
  const theme = useTheme();

  const [expanded, setExpanded] = useState<string | boolean | null>(null);
  const handleChange = (panel: string) => (event: React.SyntheticEvent<Element, Event>, newExpanded: boolean) => {
    if (toggle) setExpanded(newExpanded ? panel : false);
  };

  useEffect(() => {
    setExpanded(defaultExpandedId);
  }, [defaultExpandedId]);

  return (
    <Box sx={{ width: '100%' }}>
      {data &&
        data.map((item: AccordionItem) => (
          <Box key={item._id} sx={{ mt: 4, '&:first-child': { mt: 0 } }}>
            <Typography variant="h2">{item.section}</Typography>
            <Typography mb={1.5}>{item.description}</Typography>
            {item.content.map((faqItem: MainAccordionItem) => (
              <MuiAccordion
                key={faqItem._id}
                defaultExpanded={!faqItem.disabled && faqItem.defaultExpand}
                expanded={(!toggle && !faqItem.disabled && faqItem.expanded) || (toggle && expanded === faqItem._id)}
                disabled={faqItem.disabled}
                square={square}
                onChange={handleChange(faqItem._id)}
              >
                <MuiAccordionSummary
                  expandIcon={expandIcon || expandIcon === false ? expandIcon : <ExpandMoreIcon />}
                  sx={{ color: theme.palette.mode === ThemeMode.DARK ? 'grey.600' : 'grey.900', fontWeight: 500 }}
                >
                  {faqItem.question}
                </MuiAccordionSummary>
                <MuiAccordionDetails>{faqItem.answer}</MuiAccordionDetails>
              </MuiAccordion>
            ))}
          </Box>
        ))}
    </Box>
  );
};

export default FaqAccordion;
