import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0,
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
  },
}));

export default function ControlledAccordions() {
  const classes = useStyles();
  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={classes.root}>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography className={classes.heading}>Register</Typography>
          <Typography className={classes.secondaryHeading}>Create an account</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            When register, provide a phone number in which you would like to recieve the notification.  
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2bh-content"
          id="panel2bh-header"
        >
          <Typography className={classes.heading}>Cameras</Typography>
          <Typography className={classes.secondaryHeading}>
            Create the Camera streaming
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You can use multiple cameras, just make sure to have the <a href="https://www.getscw.com/decoding/rtsp">RTSP URL</a> and <a href="https://www.purevpn.com/blog/how-to-forward-ports-on-your-router/">
            forward </a> the ports on your internet Router.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography className={classes.heading}>Profiles</Typography>
          <Typography className={classes.secondaryHeading}>
            Create the profiles to detect 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            You can create multiple profiles; you just need to provide a name and picture of the person. An ID type photo works the best.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography className={classes.heading}>Dashboard</Typography>
          <Typography className={classes.secondaryHeading}>
            Full Control 
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Start or Stop the camera streaming any time, the Dashboard allows you to control when and which cameras use and generate 
            face encodings when adding new profiles.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}