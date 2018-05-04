import React from 'react';

const Check = () => (
  <div className="checkmark pointer">
    <style jsx>{`
      .checkmark{
        width: 16px;
        height: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #007aff;
        border-radius: 50%;
      }

  .checkmark:after{
    /*Add another block-level blank space*/
    content: '';
    display: block;


    /*Make it a small rectangle so the border will create an L-shape*/
    width: 3px;
    height: 6px;

    /*Add a white border on the bottom and left, creating that 'L' */
    border: solid white;
    border-width: 0 2px 2px 0;

    /*Rotate the L 45 degrees to turn it into a checkmark*/
    transform: rotate(45deg);
  }
    `}</style>
  </div>
);

export default Check;
