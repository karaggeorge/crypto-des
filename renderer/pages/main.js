import React from 'react';
import electron from 'electron';
import TextArea from "react-textarea-autosize";

export default class Main extends React.Component {
  state = {
    message: 'EÑ\u000f}Ì£r',
    key: '0110001001010001110010110010110010111100111100101010100000111011'
  }

  open = () => {
    const {message, key} = this.state;

    const {createDesWindow} = electron.remote.require('.');
    createDesWindow({message, key});
    this.setState({message: ''});
  }

  openMFromFile = () => {
    const {dialog, getCurrentWindow} = electron.remote;
    const {getFile} = electron.remote.require('.');

    const files = dialog.showOpenDialog(getCurrentWindow(), {
      openFile: true,
    });

    if(files.length > 0) {
      this.setState({message: getFile(files[0])});
    }
  }

  openKFromFile = () => {
    const {dialog, getCurrentWindow} = electron.remote;
    const {getFile} = electron.remote.require('.');

    const files = dialog.showOpenDialog(getCurrentWindow(), {
      openFile: true,
    });

    if(files.length > 0) {
      this.setState({key: getFile(files[0]).trim()});
    }
  }

  changeMessage = e => this.setState({message: e.target.value});
  changeKey = e => this.setState({key: e.target.value});

  render() {
    const {message, key} = this.state;
    return (
      <div className="fill">
        <div className='scrollable'>
          <h3>Message</h3>
          <TextArea value={message} onChange={this.changeMessage}/>
          <div className="btn" onClick={this.openMFromFile}>Open File</div>
          <h3>Key</h3>
          <TextArea value={key} onChange={this.changeKey}/>
          <div className="btn" onClick={this.openKFromFile}>Open File</div>
        </div>
        <div className="btn encrypt" onClick={this.open}>Encrypt</div>
        <style jsx global>{`
          html,
          body,
          .fill {
            width: 100vw;
            height: 100vh;
            margin: 0;
            display: flex;
            flex-direction: column;
          }

          .scrollable {
            flex: 1;
            overflow-y: auto;
          }

          .fill {
            padding: 32px;
            box-sizing: border-box;
            padding-bottom: 16px;
          }

          textarea {
            margin-bottom: 16px;
            outline: none !important;
            width: 90%;
          }

          .btn {
            width: 64px;
            background: #007aff;
            color: white;
            padding: 4px 8px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
          }

          .btn:hover {
            transform: scale(1.1);
          }

          .encrypt {
            margin-left: auto;
            margin-right: auto;
            margin-top: 8px;
            margin-bottom: 0;
            width: 128px;
          }
        `}</style>
      </div>
    )
  }
}
