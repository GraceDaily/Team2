import React, { useEffect, useState } from "react";

function Disclaimer () {
const [isOpen, setIsOpen] = useState(true);

useEffect (() => {
    setIsOpen(true);
},[]);

const closeWarning = () => {
    setIsOpen(false); 
  };

  return (
    <div>
        {isOpen && (      
            <div style = {{
              position: 'fixed',
              transform: 'translate(50%,50%)',
              backgroundColor: '#343434',
              padding: '20px',
              borderRadius: '10px',
              width: '50%',
              height: '50%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              zIndex: 1000,
            }}>
              <h2>Disclaimer</h2>
              <p>This site may contain adult content and/or images. Viewers must be over the age of 18.</p>
              <button onClick = {closeWarning} style = {{
                padding: '10px 20px',
                backgroundColor: '#FB0707',
                color: 'white',
                borderRadius: '10px'
              }}> 
              I understand    </button>
            </div>   
        )}
</div>
);
}

export default Disclaimer;

