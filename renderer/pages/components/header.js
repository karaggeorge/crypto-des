import React from 'react';

export default class Header extends React.Component {
  render() {
    const {title, nextStep, prevStep, min, max, cur} = this.props;

    return(
      <div className="header-container">
        <div className={`btn ${cur === min ? 'disabled' : ''}`} onClick={prevStep}>Previous</div>
        <div className="title">{title}</div>
        <div className={`btn ${cur === max ? 'disabled' : ''}`} onClick={nextStep}>Next</div>
        <style jsx>{`
          .header-container {
            user-select: none;
            width: 100%;
            height: 32px;
            flex-shrink: 0;
            background-color: #f1f1f1;
            box-shadow: 0 1px 0 0 #ddd, inset 0 1px 0 0 #ddd;
            display: flex;
            align-items: center;
            padding: 0 16px;
            box-sizing: border-box;
          }

          .title {
            flex: 1;
          }

          .btn {
            width: 64px;
            height: 24px;
            background: #007aff;
            border-radius: 4px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            margin-right: 16px;
            padding: 0 4px;
          }

          .btn:not(.disabled):hover {
            transform: scale(1.1);
          }


          .disabled {
            background: lightgray;
            color: black;
            pointer-events: none;
          }
        `}</style>
      </div>
    );
  }
}
