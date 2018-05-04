import electron from 'electron';
import React from 'react';
import randomColor from 'randomcolor';

import Block from './components/block';
import Check from './components/check';
import Loader from './components/loader';
import FinalPermutation from './components/finalp';
import InitialPermutation from './components/initialp';
import Main from './components/mainp';
import Header from './components/header';

import {getMessage, getBinary} from './des';

import DES from './des';

class Message extends React.Component {
  save = () => {
    const {dialog, getCurrentWindow} = electron.remote;
    const {saveFile} = electron.remote.require('.');

    const path = dialog.showSaveDialog(getCurrentWindow(), {});
    saveFile(path, this.props.message);
  }

  render() {
    const {message} = this.props;

    return (
      <div>
        <div className='mess'>{message}</div>
        <div className='btnn' onClick={this.save}>Save to file</div>
        <style jsx>{`
          .mess {
            max-width: 100%;
            word-wrap: break-word;
          }

          .btnn {
            margin-top: 16px;
            width: 128px;
            background: #007aff;
            color: white;
            padding: 4px 8px;
            text-align: center;
            border-radius: 4px;
            cursor: pointer;
          }

          .btnn:hover {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    )
  }
}

class Total extends React.Component {
  render() {
    const {parts} = this.props;
    const message = parts.map(part => part.message).join('');
    const bmessage = parts.map(part => part.des.message.map(x => x.code).join('')).join('');
    const bcipher = parts.map(part => part.des.cipher.map(x => x.code).join('')).join('');
    const cipher = getMessage(bcipher);

    return (
      <div className="container">
        <h3>From the original message</h3>
        <Message message={message}/>
        <h3>We got its code</h3>
        <Message message={bmessage}/>
        <h3>Encrypted it to</h3>
        <Message message={bcipher}/>
        <h3>Which leads to the final cipher</h3>
        <Message message={cipher}/>
        <style jsx>{`

        `}</style>
      </div>
    )
  }
}

class Des extends React.Component {
  state = {
    step: 0,
    sPart: 0,
  }

  constructor(props) {
    super(props);

    if(!electron.ipcRenderer) return;

    electron.ipcRenderer.on('data', (event, data) => {
      this.load(data);
    });
  }

  load = ({message, key}) => {
    let msg = message;
    let k = ('0'.repeat(64) + key).substr(-64);
    if (message.length % 8 != 0) {
      msg += ' '.repeat(8 - (message.length%8));
    }
    const nParts = msg.length/8;
    const parts = [...Array(nParts).keys()].map(i => ({
      index: i+1,
      message: msg.slice(i*8, (i+1)*8),
      des: new DES(getBinary(msg.slice(i*8, (i+1)*8)), k, () => this.forceUpdate()),
    }));



    this.setState({parts});

    const cb = next => {
      this.setState({[next-1]: true}, () => {
        if (next < nParts) {
          setTimeout(() => {
            parts[next].des.start(next, cb);
          }, 1);
        }
      });
    }

    setTimeout(() => {
      parts[0].des.start(0, cb);
    }, 1)
  }

  render() {
    const steps = [
      InitialPermutation,
      Main,
      FinalPermutation
    ];

    const {step, parts, sPart} = this.state;
    const Component = steps[step];

    if (!Component) return null;

    return (
      <div className="fill">
        {
          !parts ? (
            <div className="lcenter"><Loader size={64}/></div>
          ) : (
            <div className="fill">
              <div className="mparts">
                <div className={`pbtn ${sPart === 0 ? 'disabled' : ''}`} onClick={() => this.setState({sPart: sPart-1, step: 0})}>Previous</div>
                <div className="pparts">
                  {
                    parts.map((part, i) => (
                      <div className={`mpart flex1`} key={i} onClick={() => this.setState({sPart: i, step: 0})}>
                        { i === sPart && <div className="selected" /> }
                        <div className="flex1">{this.state[i] ? <Check /> : <Loader />}</div>
                      </div>
                    ))
                  }
                </div>
                <div className={`mpart total ${this.state[parts.length-1] ? '' : 'disabled'}`} onClick={() => this.setState({sPart: parts.length})}>
                  { sPart === parts.length && <div className='selected' />}
                  <div className="flex1 pointer">Total</div>
                </div>
                <div className={`pbtn ${sPart === parts.length ? 'disabled' : ''}`} onClick={() => this.setState({sPart: sPart+1, step: 0})}>Next</div>
              </div>
              { sPart !== parts.length && <Header nextStep={() => this.setState({step: step+1})} prevStep={() => this.setState({step: step-1})} title={`' ${parts[sPart].message} '  -  ${Component.title}`} min={0} max={2} cur={step}/>}
              <div className='scroll-cont flex'>
                {
                  sPart === parts.length ? (
                    <Total parts={parts} />
                  ) : (
                    !parts[sPart].des.ready ? (
                      <div className="lcenter"><Loader size={64}/></div>
                    ) : (
                      <Component {...parts[sPart]}/>
                    )
                  )
                }
              </div>
            </div>
          )
        }
        <style jsx global>{`
            html,
            body,
            .fill {
              width: 100vw;
              height: 100vh;
              margin: 0;
              display: flex;
              flex-direction: column;
              font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif;
              font-size: 90%;
            }

            .flex1 {
              flex: 1;
            }

            .flex {
              display: flex;
              flex-direction: column;
            }

            .scroll-cont {
              flex: 1;
            }

            h1,
            h3,
            h5 {
              font-weight: normal;
              margin: 16px 0;
            }

            h3 + h3 {
              margin-top: 0;
            }

            .container {
              overflow-y: auto;
              flex: 1;
              padding: 32px 64px;
              padding-top: 16px;
            }

            .container h3 {
              margin-left: -24px;
            }

            .container h1 {
              margin-left: -32px;
            }

            .total {
              width: 128px;
              text-align: center;
              overflow: hidden;
              color: #007aff;
            }

            .lcenter {
              flex: 1;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .mparts {
              user-select: none;
              width: 100%;
              height: 32px;
              flex-shrink: 0;
              background-color: #f1f1f1;
              box-shadow: 0 1px 0 0 #ddd, inset 0 1px 0 0 #ddd;
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding: 0 16px;
              box-sizing: border-box;
            }

            .pparts {
              display: flex;
              align-items: center;
              overflow-x: scroll;
              flex: 1;
            }

            .pparts::-webkit-scrollbar { display: none; }

            .mpart .selected {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 1px solid #007aff;
              position: absolute;
              transform: translateY(-20%);
            }

            .total .selected {
              width: 48px;
              height: 48px;
              transform: translateY(-37%);
            }

            .mpart {
              display: flex;
              flex-direction: column;
              align-items: center;
              min-width: 32px;
              position: relative;
            }

            .pointer {
              cursor: pointer;
            }

            .pbtn {
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

            .pbtn:not(.disabled):hover {
              transform: scale(1.1);
            }

            .total.disabled {
              pointer-events: none;
              color: lightgray;
            }


            .pbtn.disabled {
              background: lightgray;
              color: black;
              pointer-events: none;
            }
        `}</style>
      </div>
    )
  }
}

export default Des;
