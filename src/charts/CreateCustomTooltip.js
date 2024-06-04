import React, { useEffect, useState } from 'react';
import "../Charts.css";


const CreateCustomTooltip = ({ tooltipModel }) => {
  const [position, setPosition] = useState({ left: 0, top: 0 });

  useEffect(() => {
    if (!tooltipModel || tooltipModel.opacity === 0) {
      setPosition({ left: 0, top: 0 });
      return;
    }

    
    setPosition({
      left: tooltipModel.caretX,
      top: tooltipModel.caretY,
    });

    
  }, [tooltipModel]);


  if (!tooltipModel || tooltipModel.opacity === 0) {
    return null;
  }

  const titleLines = tooltipModel.title || [];
  const bodyLines = tooltipModel.body.map(b => b.lines);


  return (
    <div id="chartjs-tooltip" style={{ ...position, position: 'absolute', pointerEvents: 'none' }}>
      <div className="tooltip-header" >
        {titleLines.map((title, i) => (
          <div key={i}>{title}</div>
        ))}
      </div>
      <hr className="tooltip-separator" />
      <div className="tooltip-body" style={{ backgroundColor: '#F6F6F6', padding: '5px', borderRadius: '0 0 5px 5px' }}>
        {bodyLines.map((body, i) => (
          <div key={i}><span className="tooltip-color" style={{ backgroundColor: tooltipModel.labelColors[i].backgroundColor }}></span> {body}</div>
        ))}
      </div>
    </div>
  );
};

export default CreateCustomTooltip;

/*
old return:

  return (
    <div id="chartjs-tooltip" style={{ position: 'absolute', ...position, backgroundColor: '#333', color: '#fff', borderRadius: '5px', padding: '10px', pointerEvents: 'none' }}>
      <div className="tooltip-header" style={{ backgroundColor: '#ECEFF1', padding: '5px', borderRadius: '5px 5px 0 0' }}>
        {titleLines.map((title, i) => (
          <div key={i}>{title}</div>
        ))}
      </div>
      <hr className="tooltip-separator" style={{ borderColor: '#DDDDDD', margin: '0' }} />
      <div className="tooltip-body" style={{ backgroundColor: '#F6F6F6', padding: '5px', borderRadius: '0 0 5px 5px' }}>
        {bodyLines.map((body, i) => (
          <div key={i}><span className="tooltip-color" style={{ display: 'inline-block', width: '10px', height: '10px', marginRight: '5px', borderRadius: '50%', backgroundColor: tooltipModel.labelColors[i].backgroundColor }}></span> {body}</div>
        ))}
      </div>
    </div>
  );
  
  */