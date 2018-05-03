import React from 'react';

class Block extends React.Component {
  render() {
    const {block, name, sub, center, split = 4} = this.props;

    return (
      <div>
        {name && <span className="title"><span className="name">{name}<sub>{sub}</sub></span> =</span>}
        {
          [...Array(block.length/split).keys()].map(x => (
            <span className="part" key={x}>{block.slice(x*split, (x+1)*split)}</span>
          ))
        }
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
        `}</style>
      </div>
    );
  }
}

class InitialPermutation extends React.Component {

  render() {
    const {des} = this.props;

    return (
      <div className="container">
        <h1>Initial Message Permutation</h1>
        <h3>From the initial message</h3>
        <Block name='m' block={des.message}/>

        <h3>We get the permutation</h3>
        <Block name='m' sub="0" block={des.initialPermutation} />

        <h3>And then split it into two parts</h3>
        <Block name='L' sub="0" block={des.l[0]} />
        <Block name='R' sub='0' block={des.r[0]} />
        <h1>Finding C<sub>0</sub> and D<sub>0</sub></h1>
        <h3>Starting with the initial key</h3>
        <Block name='K' block={des.key}/>
        <h3>We get the initial permutation</h3>
        <Block name='K' sub='0' block={des.initialKeyPermutation}/>
        <h3>And spliting that, we get</h3>
        <Block name='C' sub='0' block={des.c[0]} />
        <Block name='D' sub='0' block={des.d[0]} />
      </div>
    )
  }

  static title = 'Initial Permutation'
}

class Main extends React.Component {
  state = {
    step: 1,
  }

  render() {
    const {step} = this.state;
    const {des} = this.props;

    return (
      <div className="flex">
        <Header title={`Step ${step}`} nextStep={() => this.setState({step: step+1})} prevStep={() => this.setState({step: step-1})} min={1} max={16} cur={step}/>
        <div className="container flex">
          <h1>To find the key for the round:</h1>
          <h3>Starting with</h3>
          <Block name='C' sub={step-1} block={des.c[step-1]}/>
          <Block name='D' sub={step-1} block={des.d[step-1]}/>
          <h3>We shift each one to get</h3>
          <Block name='C' sub={step} block={des.c[step]}/>
          <Block name='D' sub={step} block={des.d[step]}/>
          <h3>And then apply the permutation to get the round key</h3>
          <Block name='K' sub={step} block={des.k[step]} split={6}/>
          <h1>To compute the round</h1>
          <h3>We start with</h3>
          <div><span>L<sub>{step}</sub> = </span><Block name='R' sub={step-1} block={des.r[step-1]} center/></div>
          <h3>To get R<sub>{step}</sub> we need to calculate L<sub>{step}</sub> ⊕ ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</h3>
          <div className="steps">
            <div className="step">
              <h3>To calculate ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</h3>
              <div className="steps">
                <div className="step">
                  <h3>First, we calculate E(R<sub>{step-1}</sub>)</h3>
                  <div><span>E(R<sub>{step-1}</sub>) = </span><Block block={des.er[step]}/></div>
                </div>
                <div className="step">
                  <h3>Then, E(R<sub>{step-1}</sub>) ⊕ K<sub>{step}</sub></h3>
                  <div className='addition'>
                    <div className='names'>
                      <span>E(R<sub>{step-1}</sub>)</span>
                      <span>K<sub>{step}</sub></span>
                      <span>E(R<sub>{step-1}</sub>) ⊕ K<sub>{step}</sub></span>
                    </div>
                    <div className='values'>
                      <Block block={des.er[step]} split={6}/>
                      <Block block={des.k[step]} split={6}/>
                      <div/>
                      <Block block={des.erxork[step]} split={6}/>
                    </div>
                  </div>
                </div>
                <div className="step">
                  <h3>Now, we work with the S-boxes</h3>
                  <table>
                    <thead>
                      <tr>
                        <th><i>i</i></th>
                        <th><strong>block</strong> <i>i</i></th>
                        <th><strong>Row (</strong>b<sub>1</sub>b<sub>6</sub><strong>)</strong></th>
                        <th><strong>Column (</strong>b<sub>2</sub>b<sub>3</sub>b<sub>4</sub>b<sub>5</sub><strong>)</strong></th>
                        <th><strong>Entry</strong></th>
                        <th><strong>Bits</strong></th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        des.blocks[step].map((x,i) => {
                          const row = des.rows[step][i];
                          const column = des.columns[step][i];
                          const entry = des.entries[step][i];
                          const bits = des.bits[step][i];

                          return (
                            <tr key={i}>
                              <td>{i+1}</td>
                              <td>{x}</td>
                              <td>{row.dec} ({row.binary})</td>
                              <td>{column.dec} ({column.binary})</td>
                              <td>{entry}</td>
                              <td>{bits}</td>
                            </tr>
                          );
                        })
                      }
                    </tbody>
                  </table>
                </div>
                <div className="step">
                  <h3>At this point we get</h3>
                  <span>C<sub>1</sub>C<sub>2</sub>C<sub>3</sub>C<sub>4</sub>C<sub>5</sub>C<sub>6</sub>C<sub>7</sub>C<sub>8</sub> = </span><Block block={des.cs[step]}/>
                </div>
                <div className="step">
                  <h3>Applying the permutation we get</h3>
                  <span>ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>) = </span><Block block={des.frk[step]}/>
                </div>
              </div>
            </div>
            <div className="step">
              <h3>So, to compute R<sub>{step}</sub></h3>
              <div className='addition'>
                <div className='names'>
                  <span>L<sub>{step-1}</sub></span>
                  <span>ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</span>
                  <span>L<sub>{step-1}</sub> ⊕ ƒ(R<sub>{step-1}</sub>, K<sub>{step}</sub>)</span>
                </div>
                <div className='values'>
                  <Block block={des.l[step-1]}/>
                  <Block block={des.frk[step]}/>
                  <div/>
                  <Block block={des.r[step]}/>
                </div>
              </div>
            </div>
          </div>
          <h3>Therefore</h3>
          <Block name='L' sub={step} block={des.l[step]} />
          <Block name='R' sub={step} block={des.r[step]} />
        </div>

        <style jsx>{`
            .addition {
              display: flex;
            }

            .names {
              display: flex;
              flex-direction: column;
              text-align: right;
              padding-right: 8px;
              height: 72px;
              justify-content: space-around;
            }

            .values {
              display: flex;
              flex-direction: column;
              height: 72px;
              justify-content: space-around;
              padding-left: 8px;
            }

            .values div {
              height: 0;
              width: 100%;
              border-bottom: 1px solid black;
            }

            .steps {
              padding-left: 32px;
            }

            .step {
              padding-left: 32px;
            }

            .step h3 {
              margin-left: -32px;
            }

            table {
              border-collapse: collapse;
            }

            th, td {
              padding: 16px;
              border: 1px solid black;
              font-weight: normal;
              text-align: center;
            }
        `}</style>
      </div>
    )
  }

  static title = 'Main Process'
}

class Switch extends React.Component {
  render() {
    return null;
  }
}

class Header extends React.Component {
  render() {
    const {title, nextStep, prevStep, min, max, cur} = this.props;

    return(
      <div className="header-container">
        <div className={`btn ${cur === min ? 'disabled' : ''}`} onClick={prevStep}>Previous</div>
        <div className="title">{title}</div>
        <div className={`btn ${cur === max ? 'disabled' : ''}`} onClick={nextStep}>Next</div>
        <style jsx>{`
          .header-container {
            width: 100%;
            height: 128px;
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
            height: 32px;
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

class Des extends React.Component {
  state = {
    step: 1,
    des: new DES('0100010111010001000011110111110110010110110011001010001101110010', '0110001001010001110010110010110010111100111100101010100000111011')
  }

  render() {
    const steps = [
      InitialPermutation,
      Main,
      Switch
    ];

    const {des, step} = this.state;
    const Component = steps[step];

    if (!Component) return null;

    return (
      <div className="fill">
        <Header nextStep={() => this.setState({step: step+1})} prevStep={() => this.setState({step: step-1})} title={Component.title} min={0} max={2} cur={step}/>
        <div className='scroll-cont flex'>
          <Component nextStep={() => this.setState({step: step + 1})} des={des}/>
        </div>
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

            .flex {
              display: flex;
              flex-direction: column;
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
        `}</style>
      </div>
    )
  }
}

export default Des;


const initPermutation = [58, 50, 42, 34, 26, 18, 10, 2, 60, 52, 44, 36, 28, 20, 12, 4, 62, 54, 46, 38, 30, 22, 14, 6, 64, 56, 48, 40, 32, 24, 16, 8, 57, 49, 41, 33, 25, 17, 9, 1, 59, 51, 43, 35, 27, 19, 11, 3, 61, 53, 45, 37, 29, 21, 13, 5, 63, 55, 47, 39, 31, 23, 15, 7];
const initKeyPermutation = [57, 49, 41, 33, 25, 17, 9, 1, 58, 50, 42, 34, 26, 18, 10, 2, 59, 51, 43, 35, 27, 19, 11, 3, 60, 52, 44, 16, 63, 55, 47, 39, 31, 23, 15, 7, 62, 54, 46, 38, 30, 22, 14, 6, 61, 53, 45, 17, 29, 21, 13, 5, 28, 20, 12, 4];
const eofr = [32, 1, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9, 8, 9, 10, 11, 12, 13, 12, 13, 14, 15, 16, 17, 16, 17, 18, 19, 20, 21, 20, 21, 22, 23, 24, 25, 24, 25, 26, 27, 28, 29, 28, 29, 30, 31, 32, 1];
const keyPermutation = [14, 17, 11, 24, 1, 5, 3, 28, 15, 6, 21, 10, 23, 19, 12, 4, 26, 8, 16, 7, 27, 20, 13, 2, 41, 52, 31, 37, 47, 55, 30, 40, 51, 45, 33, 48, 44, 49, 39, 56, 34, 53, 46, 42, 50, 36, 29, 32];
const csPermutation = [16, 7, 20, 21, 29, 12, 28, 17, 1, 15, 23, 26, 5, 18, 31, 10, 2, 8, 24, 14, 32, 27, 3, 9, 19, 13, 30, 6, 22, 11, 4, 25];

const sBoxes = [
  [
    [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
    [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
    [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
    [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
  ], [
    [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
    [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
    [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
    [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
  ], [
    [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
    [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
    [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
    [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
  ], [
    [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
    [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
    [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
    [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
  ], [
    [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
    [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
    [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
    [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
  ], [
    [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
    [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
    [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
    [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
  ], [
    [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
    [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
    [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
    [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
  ], [
    [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
    [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
    [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
    [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
  ]
];

const xor = (a, b) => {
  return a.map((x,i) => (x ^ b[i]).toString());
}

class DES {
  constructor(message, key, cb) {
    this.message = message.split('');
    this.cb = cb;

    this.key = key.split('');

    this.l = {};
    this.r = {};
    this.k = {};
    this.er = {};
    this.c = {};
    this.d = {};
    this.erxork = {};
    this.blocks = {};
    this.rows = {};
    this.columns = {};
    this.entries = {};
    this.bits = {};
    this.cs = {};
    this.frk = {};
    this.encrypt();
  }

  encrypt = () => {
    this.initialPermutation = this.initPermute();
    this.l[0] = this.initialPermutation.slice(0, 32);
    this.r[0] = this.initialPermutation.slice(32);
    this.initialKeyPermutation = this.initKeyPermute();
    this.c[0] = this.initialKeyPermutation.slice(0, 28);
    this.d[0] = this.initialKeyPermutation.slice(28);
    for(var i = 1;i <= 16;i++) {
      this.calculateKey(i);
      this.calculateStep(i);
    }
  }

  initPermute = () => {
    return [...Array(64).keys()].map(x => this.message[initPermutation[x]-1]);
  }

  initKeyPermute = () => {
    return [...Array(56).keys()].map(x => this.key[initKeyPermutation[x]-1]);
  }

  shiftLeft = (s, p) => {
    const shiftAmount = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1][s-1];

    return [...p.slice(shiftAmount), ...p.slice(0, shiftAmount)];
  }

  calculateKey = s => {
    this.c[s] = this.shiftLeft(s, this.c[s-1]);
    this.d[s] = this.shiftLeft(s, this.d[s-1]);
    const cd = [...this.c[s], ...this.d[s]];
    this.k[s] = [...Array(48).keys()].map(x => cd[keyPermutation[x] - 1]);
  }

  calculateStep = s => {
    this.l[s] = this.r[s-1];
    this.r[s] = xor(this.l[s-1], this.f(s, this.r[s-1], this.k[s]));
  }

  f = (s, r, k) => {
    this.er[s] = [...Array(48).keys()].map(x => r[eofr[x]-1]);
    this.erxork[s] = xor(this.er[s], this.k[s]);

    this.blocks[s] = [...Array(8).keys()].map(x => this.erxork[s].slice(x*6, (x+1)*6));
    this.rows[s] = this.blocks[s].map(x => ({
      binary: x[0]+x[5],
      dec: parseInt(x[0]+x[5], 2)
    }));
    this.columns[s] = this.blocks[s].map(x => ({
      binary: x[1]+x[2]+x[3]+x[4],
      dec: parseInt(x[1]+x[2]+x[3]+x[4], 2)
    }));
    this.entries[s] = this.blocks[s].map((x,i) => sBoxes[i][this.rows[s][i].dec][this.columns[s][i].dec]);
    this.bits[s] = this.entries[s].map(x => ('0000' + x.toString(2)).substr(-4));

    this.cs[s] = this.bits[s].map(x => x.split('')).reduce((res, x) => [...res, ...x], []);
    this.frk[s] = [...Array(32).keys()].map(x => this.cs[s][csPermutation[x] - 1]);
    return this.frk[s];
  }
}
