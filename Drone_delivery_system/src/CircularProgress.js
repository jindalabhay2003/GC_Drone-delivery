import * as React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

function CircularProgressWithLabel(props) {
  return (
    <Box classname="d-flex flex-col" >
    <Box style={{marginTop: "16rem"}} thickness={"2"} sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress size={"10rem"} color='success' variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography fontSize={35} style={{color: "white"}} variant="caption" component="div" color="text.primary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
    <Typography color="success" style={{color: "white"}} variant='h5' >Alma Fiesta 2023</Typography>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

export default function CircularStatic({setLoading}) {
  const [progress, setProgress] = React.useState(10);

  React.useEffect(() => {
    setLoading(true);
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? setLoading(false) : prevProgress + 10));
    }, 400);
    
    return () => {
      clearInterval(timer);
      
    };
    
  }, []);

  return <CircularProgressWithLabel value={progress} />;
}
