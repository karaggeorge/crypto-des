import React from 'react';
import electron from 'electron';
import randomColor from 'randomcolor';

const openMenu = ({code, color, index, onChange}) => () => {
  if (!onChange) return;

  const {Menu} = electron.remote;
  const menu = Menu.buildFromTemplate([
    {
      label: 'Color',
      click() {
        onChange(index, {code, color: randomColor({luminosity: 'dark', hue: 'green'})});
      }
    }, {
      label: `Switch to ${1^code}`,
      click() {
        onChange(index, {code: (1^code).toString(), color: randomColor({luminosity: 'dark', hue: 'red'})})
      }
    }
  ]);

  menu.popup({});
};

export const Bit = ({code, color, index, onChange}) => (
  <span onClick={openMenu({code, color, index, onChange})}>
    {code}
    <style jsx>{`
      span {
        color: ${color || 'auto'};
        font-weight: ${color ? 'bold' : 'normal'};
        cursor: ${onChange ? 'pointer' : 'auto'};
      }

      span:hover {
        font-size: ${onChange ? '150%' : '100%'};
      }
    `}</style>
  </span>
)

export default class Block extends React.Component {
  copy = () => {
    const {clipboard} = electron.remote;

    clipboard.writeText(this.props.block.map(x => x.code).join(''));
  }

  render() {
    const {block = [], name, sub, center, split = 4, onChange} = this.props;

    return (
      <div>
        {name && <span className="title"><span className="name">{name}<sub>{sub}</sub></span> =</span>}
        {
          [...Array(block.length/split).keys()].map(x => (
            <span className="part" key={x}>
              {
                block.slice(x*split, (x+1)*split).map((y, i) => <Bit {...{...y, index: x*split + i, onChange, key: i}} />)
              }
            </span>
          ))
        }
        <div className="copy" title="Copy" onClick={this.copy}>📋</div>
        <style jsx>{`
            div {
              display: inline-block;
            }

            .name {
              min-width: 32px;
              display: inline-block;
              text-align: ${center ? 'center' : 'left'};
            }

            .title {
              padding-right: 16px;
            }

            .part + .part:before {
              content: " • "
            }

            .copy {
              margin-left: 8px;
              font-size: 130%;
              line-height: 100%;
              padding-top: 4px;
              cursor: pointer;
            }
        `}</style>
      </div>
    );
  }
}
